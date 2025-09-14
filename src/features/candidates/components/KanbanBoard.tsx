
import { useMemo, useState } from "react"
import { KanbanColumns } from "./KanbanColumn"
import type { Candidate, CandidateStages } from "../types"
import {  DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core"
import { CandidateCard } from "./CandidateCard"

const mockCandidates : Candidate[] = [
   { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', stage: 'applied', jobId: '1' },
    { id: 'c2', name: 'Bob Williams', email: 'bob@example.com', stage: 'applied', jobId: '1' },
    { id: 'c3', name: 'Charlie Brown', email: 'charlie@example.com', stage: 'screen', jobId: '1' },
    { id: 'c4', name: 'Diana Miller', email: 'diana@example.com', stage: 'tech', jobId: '1' },
    { id: 'c5', name: 'Ethan Davis', email: 'ethan@example.com', stage: 'offer', jobId: '1' },
    { id: 'c6', name: 'Fiona Garcia', email: 'fiona@example.com', stage: 'hired', jobId: '1' },
    { id: 'c7', name: 'George Rodriguez', email: 'george@example.com', stage: 'rejected', jobId: '1' },
    { id: 'c8', name: 'Hannah Martinez', email: 'hannah@example.com', stage: 'screen', jobId: '1' },
]

const candidatesStages = [
  'applied',
  'screen',
  'tech',
  'offer',
  'hired',
  'rejected',
]



export const KanbanBoard = () =>{

    const [ candidates , setCandidates ] = useState<Candidate[] | null>(mockCandidates);
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
        const filteredCandidates = candidates.filter(c => c.jobId === '1');

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
        <div>
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
        </div>
    )
}