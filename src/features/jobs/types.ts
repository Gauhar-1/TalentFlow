export interface Job {
    id:  number;
    title: string;
    slug: string;
    status: 'active' | 'archieved';
    tags: string[];
    order: number;
}

export interface JobsProps {
    jobs: Job[];
}

export interface JobProp {
    job: Job;
}