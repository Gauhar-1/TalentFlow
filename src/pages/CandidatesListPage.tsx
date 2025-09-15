import { KanbanBoard } from "@/features/candidates/components/KanbanBoard"
import { useCandidates } from "@/features/candidates/hooks/useCandidates"

export const CandidateListPages = ()=>{
    const { data, isLoading, isError } = useCandidates();

    if(isLoading ){
        return "loading......";
    }

    if(isError) {
        return (
            <div>
                <p>Failed tp load candidates. Please try again later.</p>
                <p>Error {isError} </p>
            </div>
        );
    }

    if(data) {
        return (
            <div>
                <KanbanBoard candidatesData={data.candidates}></KanbanBoard>
            </div>
        )
    }

    return null

}