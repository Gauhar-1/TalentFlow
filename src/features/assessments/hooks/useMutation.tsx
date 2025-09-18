import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { updateAssessmentProps } from "../types";
import axios from "axios";


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




export const useUpdateAssessment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAssessment,
        onMutate: async ({ jobId, assessment }) => {
            await queryClient.cancelQueries({ queryKey: ['assessments', jobId] });

            const previousAssessment = queryClient.getQueryData(['assessments', jobId]);

            queryClient.setQueryData(['assessments', jobId], assessment);

            return { previousAssessment, jobId };
        },

        onError: (err, variables, context) => {
            if (context?.previousAssessment) {
                queryClient.setQueryData(['assessments', context.jobId], context.previousAssessment);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assessments', variables.jobId] });
        },
    });
};

// export const submitAssessment = async ({ jobId, submission }) => {
//     const response = await fetch(`/assessments/${jobId}/submit`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submission),
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to submit assessment.');
//     }
//     return response.json();
// };

/**
 * Hook to submit assessment responses.
 */
// export const useSubmitAssessment = () => {
//     return useMutation({
//         mutationFn: submitAssessment,
//         onSuccess: (data) => {
//             console.log('Submission successful:', data);
//             // You could invalidate related queries here if needed, e.g., a candidate's timeline.
//             // queryClient.invalidateQueries({ queryKey: ['timeline', candidateId] });
//         },
//         onError: (error) => {
//             console.error('Submission failed:', error);
//         },
//     });
// };
