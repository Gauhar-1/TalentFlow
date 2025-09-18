import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const getAssessment = async (jobId: string) => {
    const response = await axios(`/api/assessments/${jobId}`);
    if (!response.data) {
        throw new Error(`Failed to fetch assessment for job ${jobId}. Status: ${response.status}`);
    }
    return response.data;
};

export const useGetAssessment = (jobId : string) => {
    if(jobId.length == 0) console.log("jobId not found in params");
    return useQuery({
        queryKey: ['assessments', jobId],
        queryFn: () => getAssessment(jobId),
        enabled: !!jobId, 
    });
};

