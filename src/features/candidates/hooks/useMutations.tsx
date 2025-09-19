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

                return { ...oldData, candidates: updatedCandidates };
            });

            return { previousData };
        },
        onError: ( context : any) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

const createCandidate = async (newCandidate: Partial<Candidate>): Promise<Candidate> => {
    console.log("New Candidate", newCandidate);
  const response = await axios.post('/api/candidates',newCandidate, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCandidate,
    
    onSuccess: (data) => {
      console.log('Candidate created successfully:', data);
      
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },

    onError: (error) => {
      console.error('An error occurred:', error.message);
    },
  });
};