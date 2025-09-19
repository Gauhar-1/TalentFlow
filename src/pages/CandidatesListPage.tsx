import { CreateCandidate } from "@/features/candidates/components/CreateCandidate";
import { VirtualizedList } from "@/features/candidates/components/VirtualizedList";

export const CandidateListPages = ()=>{

        return (
            <div className="px-16 py-3">
                <div className="flex justify-between">
                        <div className=" text-3xl font-bold text-gray-600 flex justify-center  mb-5 text-shadow-lg">Candidate Virtualized list</div>
                        <CreateCandidate>Create Candidate</CreateCandidate>
                </div>
                        <VirtualizedList />
                    </div>
        )
}