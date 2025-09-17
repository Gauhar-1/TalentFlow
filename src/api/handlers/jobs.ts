import { db } from "@/db";
import { delay, http, HttpResponse } from "msw";

const BASE_URL = '/api/jobs';

const ITEMS_PER_PAGE = 10;

export const jobsHandlers = [
    http.get(`${BASE_URL}/all`, async() =>{
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
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const title = url.searchParams.get('title');
        const status = url.searchParams.get('status');
        const tags = url.searchParams.getAll('tags');
        
        try {
      let query = db.jobs.orderBy('order'); // Start with an ordered collection

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

      // Apply pagination to the filtered array
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      // Simulate network delay
      await delay(300);

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