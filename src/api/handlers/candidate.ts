import { db } from "@/db";
import { delay, http, HttpResponse } from "msw";

const BASE_URL = '/api/candidates';

const PAGE_SIZE = 50

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
]