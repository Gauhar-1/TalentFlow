import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { JobsApiResponse, UseJobsProps } from '../types';



const fetchJobs = async ({ status, search, page, pageSize }: UseJobsProps): Promise<JobsApiResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (page) params.append('page', String(page));
    if (pageSize) params.append('pageSize', String(pageSize));

    const response = await axios.get(`/api/jobs`);

    if(!response.data){
        throw new Error('An error occurred while fetching the jobs');
    }

    return response.data;
};

export const useJobs = ({ status, search, page, pageSize }: UseJobsProps ) => {
    return useQuery ({
        queryKey: ['jobs', { status, search, page, pageSize }],
        queryFn: () => fetchJobs({ status, search, page, pageSize }),
    });
};