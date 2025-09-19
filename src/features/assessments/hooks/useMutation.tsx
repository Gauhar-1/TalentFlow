import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { updateAssessmentProps } from "../types";
import axios from "axios";
import type { IAssessmentSubmission } from "@/db";

interface SubmitAssessmentVariables {
  jobId: string;
  candidateId: string;
  answers: Record<string, any>;
}

export const updateAssessment = async ({ jobId, assessment }: updateAssessmentProps) => {
    const response = await axios.put(`/api/assessments/${jobId}`, {assessment} , {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.data) {
        const errorData = await response.data();
        throw new Error(errorData.error || 'Failed to update assessment.');
    }
    return response.data();
};




export const useUpdateAssessment = (onSuccess : any) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAssessment,
        onMutate: async ({ jobId, assessment }) => {
            await queryClient.cancelQueries({ queryKey: ['assessments', jobId] });

            const previousAssessment = queryClient.getQueryData(['assessments', jobId]);

            queryClient.setQueryData(['assessments', jobId], assessment);

            return { previousAssessment, jobId };
        },

        onSuccess : onSuccess,

        onError: ( context : any) => {
            if (context?.previousAssessment) {
                queryClient.setQueryData(['assessments', context.jobId], context.previousAssessment);
            }
        },

        onSettled: ( variables : any) => {
            queryClient.invalidateQueries({ queryKey: ['assessments', variables.jobId] });
        },
    });
};



const submitAssessment = async ({ 
  jobId, 
  candidateId, 
  answers 
}: SubmitAssessmentVariables): Promise<IAssessmentSubmission> => {
  const response = await axios.post(`/api/assessments/${jobId}/submit`, { candidateId, answers }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation<IAssessmentSubmission, Error, SubmitAssessmentVariables>({
    mutationFn: submitAssessment,

    onSuccess: (data) => {
      console.log('Assessment submitted successfully:', data);

      queryClient.invalidateQueries({ queryKey: ['submissions', data.candidateId] });

    },

    onError: (error) => {
      console.error('An error occurred during submission:', error.message);
    },
  });
};