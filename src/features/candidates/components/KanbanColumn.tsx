import { ScrollArea } from "@/components/ui/scroll-area"
import { CandidateCard } from "./CandidateCard"
import type { Candidate, Columns } from "../types"
import { SortableContext } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core";

interface CandidateListPops {
    candidates: Candidate[];
    column: Columns;
}

export const KanbanColumns = ( { candidates, column } : CandidateListPops)=>{
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });
    return (
        <div ref={setNodeRef} className=" min-w-[300px] flex flex-col gap-2 ">
            <div className={`${isOver ? "bg-gray-600" : "bg-gray-400"} bg-gray-400 rounded text-lg shadow-lg flex justify-center text-white font-semibold text-shadow-lg p-2`}>{column.title}</div>
            <SortableContext items={ candidates.map(c => c.id)}>
            <ScrollArea className=" h-[500px] rounded-md border  bg-gray-200">
                { candidates.map( c => (
                    <CandidateCard key={c.id} candidate={c}></CandidateCard>
                ))}
            </ScrollArea>
            </SortableContext>
        </div>
    )
}