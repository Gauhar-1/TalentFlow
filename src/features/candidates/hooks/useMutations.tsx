import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Candidate, CandidateStages } from "../types";
import axios from "axios";

interface updateCandidateProps{
    candidateId : string,
    stage: CandidateStages
}

type CachedData = { candidates: Candidate[] };

const updateCandidateStage = async ({ candidateId, stage }: updateCandidateProps) => {
    const response = await axios.patch(`/api/candidates/${candidateId}`,{ stage}, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.data) {
        const errorData = await response.data;
        throw new Error(errorData.error || 'Failed to update stage.');
    }
    return response.data;
};

export const useUpdateCandidateStage = (jobId: string) => {
    if(!jobId) console.log("No jobId", jobId);
    const queryClient = useQueryClient();
    const queryKey = ['candidates', jobId];

    return useMutation({
        mutationFn: updateCandidateStage,
        onMutate: async ({ candidateId, stage }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousData = queryClient.getQueryData<CachedData>(queryKey);

             queryClient.setQueryData<CachedData>(queryKey, (oldData) => {
                if (!oldData || !oldData.candidates) {
                    return { candidates: [] };
                }
                console.log("Old data", oldData);

                const updatedCandidates = oldData.candidates.map(c =>
                    c.id === candidateId ? { ...c, stage } : c
                );

                // 2. Return the ENTIRE object with the updated array
                return { ...oldData, candidates: updatedCandidates };
            });

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};