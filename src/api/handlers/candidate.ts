import { db, type Stages } from "@/db";
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

            console.log("Candidates: ", candidates);

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

   http.patch('/candidates/:id', async ({ request, params }) => {
        await randomDelay();
        if (shouldError()) {
            console.error('[MSW] Simulating 500 Internal Server Error for PATCH /candidates/:id');
            return HttpResponse.json({ error: 'A server error occurred, please try again.' }, { status: 500 });
        }

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

                // 2. Create a new timeline event for this stage change
                const timelineEvent = {
                    candidateId,
                    status: newStatus,
                    actor: faker.person.fullName(),
                    notes: `The Candidate is moved to ${stage}`,
                    date : (new Date()).toISOString(),
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

    http.get('/candidates/:id/timeline', async ({ params }) => {
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
]