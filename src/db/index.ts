
import Dexie, { type Table } from 'dexie';

export interface IJob {
    id?:  number;
    title: string;
    slug: string;
    status: 'active' | 'archieved';
    tags: string[];
    order: number;
}

export interface ICandidate {
    id?: number;
    name: string;
    email: string;
    jobId: number;
    stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
}

export interface IAssessment {
    jobId: number;
    structure: any;
}

export interface ITimelineEvent {
    id? : number;
    candidateId: number;
    timestamp: Date;
    event: string;
}

export class TalentFlowDB extends Dexie {
    jobs!: Table<IJob>;
    candidates!: Table<ICandidate>;
    assessments!: Table<IAssessment>;
    timeline!: Table<ITimelineEvent>;

    constructor(){
        super('talentFlowDB');
        this.version(1).stores({
            jobs: '++id, title, status, order',
            candidates: '++id, name, email, jobId, stage',
            assessments: '&jobId',
            timeline: '++id, candidateId, timestamp',
        });
    }
}

export const db = new TalentFlowDB();