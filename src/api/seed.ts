import { db, type ICandidate, type IJob, type Stages } from '../db';
import { faker } from '@faker-js/faker';

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

        await db.candidates.bulkAdd(candidates);
        console.log(`Seeded ${candidates.length} candidates.`)

        console.log('Database seeded successfully!');
    }
    catch(error){
        console.error('Error seeding database:', error);
    }
}