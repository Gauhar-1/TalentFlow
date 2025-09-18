
export type Candidate = {
    id : string,
    name: string,
    email : string,
    stage: string,
    jobId: string
}

export type Columns = {
    id : string,
    title : string
}

export type CandidateStages = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';

export interface CandidatesProps {
    candidatesData : Candidate[]
}

export type TimeLine = {
     id: number, 
    status: CandidateStages, 
    date: Date, 
    notes: string, 
    actor: string
}