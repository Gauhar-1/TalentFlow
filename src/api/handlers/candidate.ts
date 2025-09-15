import { db } from "@/db";
import { delay, http, HttpResponse } from "msw";

const BASE_URL = '/api/candidates';

export const candidateHandlers = [
    http.get(BASE_URL, async()=>{
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
            return HttpResponse.json({ message: 'Error fetching jobs', }, {
                status: 500
            });
        }
    })
]