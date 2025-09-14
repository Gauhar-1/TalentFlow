import { db } from '../db';

export async function seedDatabase() {
    try{
        const jobCount = await db.jobs.count();
        if(jobCount > 0){
            console.log('Database already seeded.');
            return;
        }

        await db.jobs.bulkAdd([
            { title: 'Frontend Developer', slug: 'frontend-developer', status: 'active', tags: ['React', 'TypeScript'], order: 1},
            { title: 'Backend Engineer', slug: 'backend-engineer', status: 'active', tags: ['Node.js', 'Go'], order: 2 },
            { title: 'UI/UX Designer', slug: 'ui-ux-designer', status: 'archieved', tags: ['Figma'], order: 3 },
            { title: 'Frontend Developer', slug: 'frontend-developer', status: 'active', tags: ['React', 'TypeScript'], order: 4},
            { title: 'Backend Engineer', slug: 'backend-engineer', status: 'active', tags: ['Node.js', 'Go'], order: 5 },
            { title: 'UI/UX Designer', slug: 'ui-ux-designer', status: 'archieved', tags: ['Figma'], order: 6 },
        ]);

        console.log('Database seeded successfully!');
    }
    catch(error){
        console.error('Error seeding database:', error);
    }
}