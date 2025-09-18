import { useInfiniteQuery, useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios"
import type { Candidate } from "../types";



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