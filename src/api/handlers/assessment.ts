
import { db, type IAssessment, type IAssessmentSubmission } from '@/db';
import { http, HttpResponse } from 'msw';
import { randomDelay, shouldError } from '../utils';
import { faker } from '@faker-js/faker';



export const assessmentHandlers = [
    http.get('/api/assessments/:jobId', async ({ params }) => {
        await randomDelay();
        const jobId = params.jobId as string;
        if(!jobId) return console.log("Couldn't find jobId");

        console.log(`[MSW] Intercepted GET /assessments/${jobId}`);

        try {
            const assessment = await db.assessments.get({ jobId });
            if (!assessment) {
                console.warn(`[MSW] No assessment found for jobId: ${jobId}`);
                return HttpResponse.json({ error: 'Assessment not found' }, { status: 404 });
            }
            console.log(`[MSW] Found assessment for jobId ${jobId}:`, assessment);
            return HttpResponse.json(assessment);
        } catch (e) {
            console.error('[MSW] Error fetching assessment:', e);
            return HttpResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
    }),

    http.put('/api/assessments/:jobId', async ({ request, params }) => {
        await randomDelay();
        if (shouldError()) {
            console.error('[MSW] Simulating 500 Internal Server Error for PUT /assessments/:jobId');
            return HttpResponse.json({ error: 'Failed to save assessment due to a server error' }, { status: 500 });
        }

        const jobId = params.jobId as string;
        if(!jobId) return console.log("Couldn't find jobId");

        const data  = await request.json() as IAssessment;

        if (typeof data !== 'object' || data === null) {
            return HttpResponse.json({ error: 'Bad request: Invalid JSON body provided.' }, { status: 400 });
        }

        console.log(`[MSW] Intercepted PUT /assessments/${jobId} with payload:`, data);
        
        try {
            const id = await db.assessments.put({ ...data, jobId });
            const savedAssessment = await db.assessments.get(id);
            console.log('[MSW] Successfully saved assessment:', savedAssessment);
            return HttpResponse.json(savedAssessment, { status: 200 });
        } catch (e) {
            console.error('[MSW] Error saving assessment:', e);
            return HttpResponse.json({ error: 'Failed to write to the database' }, { status: 500 });
        }
    }),

    
   http.post('/api/assessments/:jobId/submit', async ({ request, params }) => {
    console.log('MSW: Intercepted assessment submission.');

    try {
      const { jobId } = params;
      const {candidateId, answers } = await request.json() as Partial<IAssessmentSubmission>;

      if (!candidateId || !answers) {
        return HttpResponse.json(
          { error: '`candidateId` and `answers` are required fields.' },
          { status: 400 }        );
      }

      const newSubmission: IAssessmentSubmission = {
        submissionId: faker.string.uuid(),
        jobId: String(jobId), 
        candidateId: candidateId,
        answers: answers,
        submittedAt: new Date().toISOString(),
      };

      await db.assessmentSubmissions.add(newSubmission);

      console.log(' MSW: Submission successfully saved to Dexie:', newSubmission);

      return HttpResponse.json(newSubmission, { status: 201 }); 

    } catch (error) {
      console.error('MSW: Error processing submission:', error);
      return HttpResponse.json(
        { error: 'Failed to save submission to the database.' },
        { status: 500 }
      );
    }
  }),
];
