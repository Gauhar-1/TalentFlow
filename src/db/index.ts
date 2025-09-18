
import Dexie, { type Table } from 'dexie';

export interface IJob {
    id:  string;
    title: string;
    slug: string;
    status: 'active' | 'archived';
    tags: string[];
    order: number;
}

export interface ICandidate {
    id: string;
    name: string;
    email: string;
    jobId: string;
    stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
}

export type Stages = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';


export interface IAssessment {
    id: string;
    jobTitle: string,
    jobId: string,
    sections: Section[];
}

export interface Section {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export interface Question {
    id: string;
    label: string;
    type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';

    options?: string[];

    validations?: {
        required?: boolean;
        maxLength?: number;
        range?: { min: number; max: number };
    };

    conditions?: Condition[];
}

export interface Condition {
    questionId: string;
    operator: '===' | '!==';
    value: any;
}

export interface ITimelineEvent {
    candidateId: string, 
    status: string, 
    date: string, 
    notes: string, 
    actor: string
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