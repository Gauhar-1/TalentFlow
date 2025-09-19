import {  useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { IJob } from "@/db";
import type { Job } from "../types";

interface ReorderVariables {
    jobId: string;
    fromOrder: number;
    toOrder: number;
}


// The data sent when updating an existing job
export interface UpdateJobPayload {
    jobId: string;
    updates: Partial<Omit<IJob, 'id' | 'order'>>;
}

const reorderJob = async ({ jobId, fromOrder, toOrder }: ReorderVariables) => {
    const response = await axios.patch(`/api/jobs/${jobId}/reorder`, { fromOrder, toOrder });
    return response.data;
};

function reorderArray(list: IJob[], fromOrder: number, toOrder: number): IJob[] {
    const fromIndex = fromOrder - 1;
    const toIndex = toOrder - 1;
    const result = Array.from(list);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    return result.map((item, index) => ({ ...item, order: index + 1 }));
}


export const useReorderJobs = () => {
    const queryClient = useQueryClient();
    const queryKey = ['jobs']; 

    return useMutation({
        mutationFn: reorderJob,
        onMutate: async ({ fromOrder, toOrder }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousJobs = queryClient.getQueryData<IJob[]>(queryKey);

            const optimisticJobs = previousJobs ? reorderArray(previousJobs, fromOrder, toOrder) : [];
            
            queryClient.setQueryData(queryKey, optimisticJobs);

            return { previousJobs };
        },
        onError: ( context : any) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(queryKey, context.previousJobs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

const createJob = async (newJob: Partial<Job>): Promise<Job> => {
    const response = await axios.post('/api/jobs', newJob);
    return response.data;
};

const updateJob = async ({ jobId, updates }: UpdateJobPayload): Promise<Job> => {
    const response = await axios.patch(`/api/jobs/${jobId}`, updates);
    return response.data;
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            console.log('Job created successfully, invalidating jobs list.');
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();
    const queryKey = ['jobs'];

    return useMutation({
        mutationFn: updateJob,
        onMutate: async ({ jobId, updates }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousJobs = queryClient.getQueryData<IJob[]>(queryKey);

            queryClient.setQueryData<IJob[]>(queryKey, (oldData = []) =>
                oldData.map(job =>
                    job.id === jobId ? { ...job, ...updates } : job
                )
            );

            return { previousJobs };
        },
        onError: ( context : any) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(queryKey, context.previousJobs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};