import { db, type ICandidate, type Stages } from "@/db";
import { delay, http, HttpResponse } from "msw";
import { randomDelay, shouldError } from "../utils";
import { faker } from "@faker-js/faker";

const BASE_URL = '/api/candidates';

const PAGE_SIZE = 50;

interface UpdateCandidatePayload {
    stage: Stages;
}

export const candidateHandlers = [
    http.get(`${BASE_URL}/all`, async()=>{
        try {
            const candidates = await db.candidates.toArray();

            await delay(Math.random() * 1000 + 200);

            return HttpResponse.json({
                candidates
            }, { status: 200 });
        }
        catch(error){
            console.error('[MSW] Handler for GET /candidates failed:', error);
            return HttpResponse.json({ message: 'Error fetching candidates', }, {
                status: 500
            });
        }
    }),

    http.get(BASE_URL, async ({ request }) => {
    const url = new URL(request.url);
    const cursor = parseInt(url.searchParams.get('cursor') || '0');
    const stage = url.searchParams.get('stage');

    try {
      let query = db.candidates.toCollection();

      // The handler now ONLY filters by stage
      if (stage && stage !== 'all') {
        query = query.filter(c => c.stage === stage);
      }
      
      const totalCount = await query.count();
      const candidates = await query.offset(cursor).limit(PAGE_SIZE).toArray();
      const nextCursor = (cursor + candidates.length < totalCount) ? cursor + candidates.length : undefined;

      return HttpResponse.json({ items: candidates, nextCursor, totalCount });
    } catch (error) {
      console.error('[MSW] Handler for GET /candidates failed:', error);
      return HttpResponse.json({ message: 'Error fetching candidates', }, {
                status: 500
            });
    }
  }),

   http.patch(`${BASE_URL}/:id`, async ({ request, params }) => {
        await randomDelay();
        if (shouldError()) {
            console.error('[MSW] Simulating 500 Internal Server Error for PATCH /candidates/:id');
            return HttpResponse.json({ error: 'A server error occurred, please try again.' }, { status: 500 });
        }

        console.log("called");
        const candidateId = params.id as string;

        try {
            const { stage } = await request.json() as UpdateCandidatePayload;
            if (!stage || typeof stage !== 'string') {
                return HttpResponse.json({ error: 'Request body must include a valid "stage".' }, { status: 400 });
            }

            await db.transaction('rw', db.candidates, db.timeline, async () => {
                const updatedCount = await db.candidates.update(candidateId, { stage });

                if (updatedCount === 0) {
                    throw new Error('Candidate not found'); // This will cause the transaction to fail
                }

                const newStatus = stage.charAt(0).toUpperCase() +stage.slice(1);

                const timelineEvent = {
                    candidateId,
                    status: newStatus,
                    actor: faker.person.fullName(),
                    notes: `The Candidate is moved to ${stage}`,
                    date : (new Date()).toLocaleString(),
                };
                await db.timeline.add(timelineEvent);
            });

            console.log(`[MSW] Successfully updated candidate ${candidateId} to stage "${stage}" and added timeline event.`);
            return HttpResponse.json({ success: true, message: 'Candidate stage updated successfully.' });

        } catch (e : any) {
            console.error(`[MSW] Error processing request: ${e.message}`);
            if (e.message.includes('Candidate not found')) {
                 return HttpResponse.json({ error: `Candidate with ID ${candidateId} not found.` }, { status: 404 });
            }
            return HttpResponse.json({ error: 'Failed to update candidate.' }, { status: 500 });
        }
    }),

    http.get(`${BASE_URL}/:id/timeline`, async ({ params }) => {
        await randomDelay();

        const candidateId = params.id as string;

        try {
           
            const timelineEvents = await db.timeline
                .where({ candidateId })
                .reverse()
                .sortBy('date');

            if (!timelineEvents.length) {
                console.warn(`[MSW] No timeline events found for candidateId: ${candidateId}`);
            }

            console.log(`[MSW] Fetched ${timelineEvents.length} timeline events for candidate ${candidateId}.`);
            return HttpResponse.json(timelineEvents);

        } catch (e) {
            console.error('[MSW] Error fetching timeline:', e);
            return HttpResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
    }),

     http.post('/api/candidates', async ({ request }) => {
        await randomDelay();
        if (shouldError()) {
            return HttpResponse.json({ error: 'A Simulating server error occurred while creating the candidate.' }, { status: 500 });
        }

        try {
            const { name, email, jobId } = await request.json() as Partial<ICandidate>;
            if (!name || !email ||!jobId) {
                console.log("Name",name);
                console.log("email",email);
                console.log("JobId",jobId);
                return HttpResponse.json({ error: 'Name and email are required fields.' }, { status: 400 });
            }
            
            const newCandidate : ICandidate = {
                id: faker.string.uuid(),
                name,
                email,
                jobId, 
                stage: 'applied',
            };

            
             await db.candidates.add(newCandidate);


                const timelineEvent = {
                    candidateId: newCandidate.id,
                    status: 'Candidate applied.',
                    notes: 'Applied via company website.',
                    actor: faker.person.fullName(),
                    date: faker.date.recent({ days: 30 }).toISOString(),
                };

                await db.timeline.add(timelineEvent);

            return HttpResponse.json(newCandidate, { status: 201 }); // 201 Created

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            return HttpResponse.json({ error: `Failed to create candidate: ${errorMessage}` }, { status: 500 });
        }
    }),
]