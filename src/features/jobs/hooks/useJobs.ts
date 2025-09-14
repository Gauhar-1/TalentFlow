import type { IJob } from "../../db";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


interface JobsApiResponse {
    jobs: IJob[];
    totalPages: number;
}

interface UseJobsProps {
    status?: 'active' | 'archived' | 'all';
    search?: string;
    page?: number;
    pageSize?: number;
}

const fetchJobs = async ({ status, search, page, pageSize }: UseJobsProps): Promise<JobsApiResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (page) params.append('page', String(page));
    if (pageSize) params.append('pageSize', String(pageSize));

    const response = await axios.get(`/api/jobs`);

    console.log("Response: ", response.data)

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