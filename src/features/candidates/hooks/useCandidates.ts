import { useInfiniteQuery, useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios"
import type { Candidate, TimeLine } from "../types";



const fetchAllCandidates = async() =>{
    const response = await axios.get(`/api/candidates/all`);
    return response.data;
}

export const useCandidates = ()=>{
    return useQuery ({
        queryKey: ['candidates', 'all'],
        queryFn: fetchAllCandidates,
    })
}

export const useCandidatesByJob = (jobId: string) => {
    if(!jobId) console.log("no job Id", jobId);
    return useQuery({
        queryKey: ['candidates', jobId], 
        queryFn: fetchAllCandidates, 
        select: (allCandidates) => {
           return allCandidates?.candidates?.filter((c: Candidate) => c.jobId === jobId)
        },
        enabled: !!jobId, // Only run if jobId is present
    });
};

export const useCandidatesById = (candidateId: string) => {
    if(!candidateId) console.log("no job Id", candidateId);
    return useQuery({
        queryKey: ['candidates', 'all'], 
        queryFn: fetchAllCandidates, 
        select: (allCandidates) => {
            console.log("all candidate", allCandidates);
           return allCandidates?.candidates?.filter((c: Candidate) => c.id === candidateId)
        },
        enabled: !!candidateId, 
    });
};

type CandidatesQueryKey = readonly ['candidates', 'infinite', string];

const fetchCandidates = async( context: QueryFunctionContext<CandidatesQueryKey>) => {
    const [_key,_infinite, stageFilter] = context.queryKey;
    const pageParam = context.pageParam || 0;
    const params = new URLSearchParams();
    params.append('cursor', String(pageParam));

    if(stageFilter && stageFilter !== 'all'){
        params.append('stage', stageFilter);
    }
    const res = await axios.get(`api/candidates?${params.toString()}`)
    return res.data;
}

export const useInfiniteCandidates = (filter : string) =>{
    return useInfiniteQuery({
        queryKey: ['candidates','infinite', filter] as const,
        queryFn: fetchCandidates,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
}

const getCandidateTimeline = async ( candidateId : string) => {

    if (!candidateId) {
        console.log("Couldn't find", candidateId);
        return []; 
    }

    const response = await axios.get(`/api/candidates/${candidateId}/timeline`);
    return response.data;
};

export const useGetCandidateTimeline = (candidateId: string) => {
    return useQuery<TimeLine[]>({
        queryKey: ['timeline', candidateId],
        
        queryFn: () =>getCandidateTimeline(candidateId),
        
        enabled: !!candidateId,
    });
};