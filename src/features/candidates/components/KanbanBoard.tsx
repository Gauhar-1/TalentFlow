
import { useMemo, useState } from "react"
import { KanbanColumns } from "./KanbanColumn"
import type { Candidate, CandidatesProps, CandidateStages } from "../types"
import {  DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core"
import { CandidateCard } from "./CandidateCard"
import { Card, CardContent } from "@/components/ui/card"


const candidatesStages = [
  'applied',
  'screen',
  'tech',
  'offer',
  'hired',
  'rejected',
]



export const KanbanBoard = ({ candidatesData } : CandidatesProps) =>{

    const [ candidates , setCandidates ] = useState<Candidate[]>(candidatesData || []);
    const [ activeCandidate, setActiveCandidate ] = useState<Candidate | null>(null);

    const columns = useMemo(()=>{
        return candidatesStages.map( stage => ({
             id: stage,
             title: stage.charAt(0).toUpperCase() + stage.slice(1)
        }))
    },[]);

    const candidatesByStage = useMemo(()=> {
        const grouped: Record<CandidateStages, Candidate[]> = {
          applied: [],
          screen: [],
          tech: [],
          offer: [],
          hired: [],
          rejected: [],
        };

        if(!candidates) return grouped;
 
        // Change the "1" to job id 
        const filteredCandidates = candidates.slice(0, 20);

        filteredCandidates.forEach((candidate) => {
            if(candidate.stage in grouped){
                grouped[candidate.stage as CandidateStages].push(candidate);
            }
        });

        return grouped;
    },[candidates]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint : {
                distance: 1,
            },
        })
    );

    const handleStart = (event: DragStartEvent) =>{
        setActiveCandidate(null);
        const { active } = event;
        if(candidates) {
            const candidate = candidates.find(c => c.id === active.id);
            if(candidate){
                setActiveCandidate(candidate);
            }
        }
    }

    const handleDragEnd = async (event: DragEndEvent) =>{

        const { active, over } = event;

        if(!over || !candidates) return ;

        let overId = over.id;
        const overIsColumn = candidatesStages.includes(overId as CandidateStages);

        if(!overIsColumn) {
            overId = over.data.current?.sortable.containerId;
        } 
            

        const activeContainer = active.data.current?.sortable.containerId;
        const overContainer = overId as CandidateStages;

        if(activeContainer && overContainer && activeContainer !== overContainer){
            const candidateId = active.id as string;
            const candidate = candidates.find(c => c.id === candidateId);

            if(candidate) {
                const newCandidates = candidates.map(c => c.id === candidateId ? { ...c, stage: overContainer }: c);

                setCandidates(newCandidates);
            }
        }
    }



    return (
        <div className="px-16 py-8">
            <div className=" text-3xl font-bold text-gray-600 flex justify-center mb-5 text-shadow-lg">Kanban Board</div>
            <Card className="border-3 border-gray-400 shadow-lg p-0">
                <CardContent>
                    <DndContext
               sensors={sensors}
               onDragStart={handleStart}
               onDragEnd= {handleDragEnd}
               collisionDetection={rectIntersection}
            >
            <div className="flex gap-2 p-8 overflow-auto">
                { columns.map(column => (
                   <KanbanColumns key={column.id} column={column} candidates={candidatesByStage[column.id as CandidateStages] || []} />
))}
            </div>

            <DragOverlay>
                { activeCandidate ? (
                    <CandidateCard candidate={activeCandidate} />
                ) : null}
            </DragOverlay>
            </DndContext>
                </CardContent>
            </Card>
        </div>
    )
}