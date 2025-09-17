import { useInfiniteQuery, useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios"



const fetchAllCandidates = async() =>{
    try{
        const response = await axios.get(`/api/candidates/all`);

        if(!response.data){
            throw new Error('An error occurred while fetching the jobs');
        }

        return response.data;
    }
    catch(error){
        console.error("Error occurred while fetching the candidates", error)
    }
}

export const useCandidates = ()=>{
    return useQuery ({
        queryKey: ['candidates', {}],
        queryFn: () => fetchAllCandidates(),
    })
}

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