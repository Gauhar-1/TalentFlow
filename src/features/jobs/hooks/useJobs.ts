import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PaginatedJobsResponse, UseJobsOptions } from '../types';



const fetchJobs = async (options : UseJobsOptions): Promise<PaginatedJobsResponse> => {

    if(options.fetchAll){
        const response = await axios('/api/jobs/all');
        if(!response.data) throw new Error('Network response was not there');
        return response.data; 
    }
    else{
        const params = new URLSearchParams();
        params.append('page', String(options.page || 1));
        if(options.filters?.title) params.append('title', options.filters.title);
        if(options.filters?.status) params.append('status', options.filters.status);

        const response = await axios.get(`/api/jobs?${params.toString()}`);
    
        if(!response.data){
            throw new Error('An error occurred while fetching the jobs');
        }
    
        return response.data;
    }

};

export const useJobs = (options: UseJobsOptions = {}) => {

    const queryKey = options.fetchAll ? ['jobs', 'all'] : ['jobs', { page: options.page, filters: options.filters }];

    return useQuery ({
        queryKey: queryKey,
        queryFn: () => fetchJobs(options),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
};