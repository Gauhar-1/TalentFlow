import { db, type IJob } from "@/db";
import { delay, http, HttpResponse } from "msw";
import { randomDelay, shouldError } from "../utils";
import { faker } from "@faker-js/faker";

const BASE_URL = '/api/jobs';

const ITEMS_PER_PAGE = 10;

type ReorderPayload = {
    fromOrder : number,
    toOrder : number
}

export const jobsHandlers = [
    http.get(`${BASE_URL}/all`, async() =>{
        randomDelay();
        try{

            let query = db.jobs.orderBy('order');

            const jobs = await query.toArray();

            await delay(Math.random() * 1000 + 200);

            return HttpResponse.json({
                jobs,
            }, { status: 201 });
        }
        catch(error) {
            console.error('[MSW] Handler for GET /jobs failed:', error);
            return HttpResponse.json({ message: 'Error fetching jobs', }, { status: 500 });
        }
    }),

    http.get(BASE_URL, async ({ request })=>{
        randomDelay();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const title = url.searchParams.get('title');
        const status = url.searchParams.get('status');
        const tags = url.searchParams.getAll('tags');
        
        try {
      let query = db.jobs.orderBy('order'); 

      if (status && status !== 'all') {
        query = query.filter(job => job.status === status);
      }
      
      if (title && status !== '') {
        query = query.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
      }

      if(tags.length > 0) {
        query = query.filter(job =>
            tags.every(filterTag => job.tags.includes(filterTag))
        );
      }

      const filteredJobs = await query.toArray();
      const totalItems = filteredJobs.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);


      return HttpResponse.json({
        jobs: paginatedJobs,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error('[MSW] Failed to get paginated jobs:', error);
      return HttpResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
    }
    }),

    // Create Job
    http.post(BASE_URL, async ({ request }) => {
        
        randomDelay();
        if (shouldError()) {
            console.error('[MSW] Simulating a 500 Internal Server Error for job reorder.');
            return HttpResponse.json(
                { error: 'A random database error occurred. The operation was rolled back.' },
                { status: 500 }
            );
        }
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

    http.patch('/api/jobs/:id/reorder', async ({ request, params }) => {
        randomDelay();

        if (shouldError()) {
            console.error('[MSW] Simulating a 500 Internal Server Error for job reorder.');
            return HttpResponse.json(
                { error: 'A random database error occurred. The operation was rolled back.' },
                { status: 500 }
            );
        }

        const jobId = params.id as string;

        try {
            const { fromOrder, toOrder } = await request.json() as ReorderPayload;
            if (fromOrder === toOrder || !fromOrder || !toOrder) {
                return HttpResponse.json({ message: 'No reorder needed.' }, { status: 200 });
            }
            
            
            await db.transaction('rw', db.jobs, async () => {
                const jobToMove = await db.jobs.get({id : jobId});
                if (!jobToMove || jobToMove.order !== fromOrder) {
                    console.log("Job to Move ",jobToMove);
                    throw new Error('Job to be moved not found at the specified `fromOrder`.');
                }

                if (fromOrder < toOrder) {
                    await db.jobs
                        .where('order').between(fromOrder + 1, toOrder)
                        .modify(job => { job.order-- });
                } else {
                    await db.jobs
                        .where('order').between(toOrder, fromOrder - 1)
                        .modify(job => { job.order++ });
                }

                await db.jobs.update({id : jobId}, { order: toOrder });
            });

            console.log(`[MSW] Successfully reordered job ${jobId} from ${fromOrder} to ${toOrder}.`);
            return HttpResponse.json({ success: true, message: `Job reordered successfully.` });

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            console.error(`[MSW] Reorder transaction failed: ${errorMessage}`);
            return HttpResponse.json({ error: 'Reorder failed and was rolled back.' }, { status: 500 });
        }
    }),

    http.post('/api/jobs', async ({ request }) => {
        await randomDelay();
        if (shouldError()) {
            return HttpResponse.json({ error: 'Server error while creating job.' }, { status: 500 });
        }

        try {
            const { title, slug, tags } = await request.json() as Partial<IJob>;
            if (!title) {
                return HttpResponse.json({ error: 'Title is required.' }, { status: 400 });
            }
            
            const lastJob = await db.jobs.orderBy('order').last();
            const newOrder = lastJob ? lastJob.order + 1 : 1;

            const newJob  : IJob = {
                id: faker.string.uuid(),
                title,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
                tags: tags || [],
                status: 'active', 
                order: newOrder,
            };

             await db.jobs.add(newJob);
            
            return HttpResponse.json({ newJob }, { status: 201 });

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            return HttpResponse.json({ error: `Failed to create job: ${errorMessage}` }, { status: 500 });
        }
    }),

    http.patch('/api/jobs/:id', async ({ request, params }) => {
        await randomDelay();
        if (shouldError()) {
            return HttpResponse.json({ error: 'Server error while updating job.' }, { status: 500 });
        }

        const jobId = params.id as string;
        
        try {
            const updates = await request.json() as Partial<IJob>;
            
            // Dexie's update method applies the partial changes
            const updatedCount = await db.jobs.update(jobId, updates);
            
            if (updatedCount === 0) {
                return HttpResponse.json({ error: `Job with ID ${jobId} not found.` }, { status: 404 });
            }

            const updatedJob = await db.jobs.get(jobId);

            console.log(`[MSW] Patched job ${jobId} with updates:`, updates);
            return HttpResponse.json(updatedJob, { status: 200 });

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            return HttpResponse.json({ error: `Failed to update job: ${errorMessage}` }, { status: 500 });
        }
    }),
];