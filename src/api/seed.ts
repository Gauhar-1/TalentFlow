import { db, type IAssessment, type ICandidate, type IJob, type ITimelineEvent, type Stages } from '../db';
import { faker } from '@faker-js/faker';
import { ASSESSMENT_TEMPLATES } from './utils';

const JOB_COUNT = 100;
const CANDIDATE_COUNT = 1000;

type  jobStatus = 'active' | 'archived';

const jobStatuses = ['active', 'archived'];
const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const jobTags = ['React', 'TypeScript', 'Node.js', 'Go', 'Figma', 'Remote', 'Full-time'];


export async function seedDatabase() {
    try{
        const jobCount = await db.jobs.count();
        if(jobCount > 0){
            console.log('Database already seeded.');
            return;
        }

        await db.jobs.clear();
        await db.candidates.clear();

        console.log('Seeding new data...');

        const jobs: IJob[] = [];
        for(let i = 0; i < JOB_COUNT; i++){
            const title = faker.person.jobTitle();
            jobs.push({
                id: faker.string.uuid(),
                title: title,
                slug: faker.helpers.slugify(title).toLowerCase(),
                status: faker.helpers.arrayElement(jobStatuses) as jobStatus,
                tags: faker.helpers.arrayElements(jobTags, { min: 1, max: 3 }),
                order: i + 1,
            });
        }

        await db.jobs.bulkAdd(jobs);
        console.log(`Seeded ${jobs.length} jobs.`);

        const candidates: ICandidate[] = [];
        for(let i =0; i< CANDIDATE_COUNT; i++){
            candidates.push({
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                stage: faker.helpers.arrayElement(candidateStages) as Stages,
                jobId: faker.helpers.arrayElement(jobs).id,
            })
        }

         await db.candidates.bulkAdd(candidates );
        console.log(`Seeded ${candidates.length} candidates.`)

        const timelineEvents : ITimelineEvent[] = [];
        candidates.forEach(c => {
            timelineEvents.push({
                candidateId: c.id,
                status: 'Candidate applied.',
                notes: 'Applied via company website.',
                actor: faker.person.fullName(),
                date: faker.date.recent({ days: 30 }).toISOString(),
            });
        });
        await db.timeline.bulkAdd(timelineEvents);
        console.log(`Seeded ${timelineEvents.length} candidates.`);


        const assessments : IAssessment[] =[];
        for(let i=0; i< ASSESSMENT_TEMPLATES.length; i++){
            const template = ASSESSMENT_TEMPLATES[i];
            const linkedJob = jobs[i];

            template.jobTitle = linkedJob.title;

            const assessment = {
                ...template,
                id: `assess-${faker.string.uuid()}`,
                jobId: linkedJob.id,
                sections: template.sections.map(section => ({
                    ...section,
                    id: `sec-${faker.string.uuid()}`,
                })),
            };

            assessments.push(assessment);
        }

        await db.assessments.bulkAdd(assessments);



        console.log('Database seeded successfully!');
    }
    catch(error){
        console.error('Error seeding database:', error);
    }
}