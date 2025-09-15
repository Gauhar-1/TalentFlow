import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { JobsApiResponse, UseJobsProps } from '../types';



const fetchJobs = async (): Promise<JobsApiResponse> => {

    const response = await axios.get(`/api/jobs`);

    if(!response.data){
        throw new Error('An error occurred while fetching the jobs');
    }

    return response.data;
};

export const useJobs = () => {
    return useQuery ({
        queryKey: ['jobs', {}],
        queryFn: () => fetchJobs(),
    });
};