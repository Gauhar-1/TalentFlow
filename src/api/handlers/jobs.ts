import { db } from "@/db";
import { delay, http, HttpResponse } from "msw";

const BASE_URL = '/api/jobs';



export const jobsHandlers = [
    http.get(BASE_URL, async({ request }) =>{
        try{
            // const url = new URL(request.url);
            // const status = url.searchParams.get('status');
            // const search = url.searchParams.get('search');
            // const page = Number(url.searchParams.get('page') || '1');
            // const pageSize = Number(url.searchParams.get('pageSize') || '10');

            let query = db.jobs.orderBy('order');

            if(status && status !== 'all') {
                query = query.filter(job => job.status === status);
            }
            // if(search) {
            //     query = query.filter(job =>
            //         job.title.toLowerCase().includes(search.toLowerCase())
            //     );
            // }

            const totalJobs = await query.count();

            const jobs = await query.toArray();

            // delay : Simulate network latency as required
            await delay(Math.random() * 1000 + 200);

            // const jobs = await db.jobs.toArray();
            console.log("Jobs: ", jobs);

            return HttpResponse.json({
                jobs,
                // totalPages: Math.ceil(totalJobs / pageSize),
            }, { status: 201 });
        }
        catch(error) {
            console.error('[MSW] Handler for GET /jobs failed:', error);
            return HttpResponse.json({ message: 'Error fetching jobs', }, { status: 500 });
        }
    }),

    http.post(BASE_URL, async ({ request }) => {
        // Simulate a 10% error rate on write endpoints
        if(Math.random() < 0.1) {
            await delay(400);
            return HttpResponse.json({ message: 'Failed to create job'}, { status: 500 } );
        }

        // add type
        const newJobData = await request.json() as any;

        if(!newJobData.title) {
            return HttpResponse.json({ message: 'Tilte is requires '}, { status: 400});
        }

        try {
            const newJob = {
                ...newJobData,
                status: 'active',
                order: (await db.jobs.count()) + 1,
            };

            const id = await db.jobs.add(newJob);

            await delay(600);
            return HttpResponse.json({ ...newJob, id }, { status: 201 });
        }
        catch(error)  {
            return HttpResponse.json({ message: 'Error adding job to DB'}, { status: 500 });
        }
    }),
];