
import {  useMemo, useState } from "react"
import { KanbanColumns } from "./KanbanColumn"
import type { Candidate,  CandidateStages } from "../types"
import {  DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core"
import { CandidateCard } from "./CandidateCard"
import { Card, CardContent } from "@/components/ui/card"
import { useUpdateCandidateStage } from "../hooks/useMutations"
import { useParams } from "react-router-dom"
import {  useCandidatesByJob } from "../hooks/useCandidates"
import { LoadingScreeen } from "@/components/shared/LoadinScreen"
import { ErrorPage } from "@/components/shared/ErrorPage"



const candidatesStages = [
  'applied',
  'screen',
  'tech',
  'offer',
  'hired',
  'rejected',
]

export const KanbanBoard = () =>{
    const { jobId } = useParams();
    const { data , isLoading, isError } = useCandidatesByJob(jobId || '');
    const [ activeCandidate, setActiveCandidate ] = useState<Candidate | null>(null);
    const { mutate: changeCandidateStage, isPending } = useUpdateCandidateStage(jobId || '');

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

        if(!data) return grouped;
 

        data.forEach((candidate : Candidate) => {
            if(candidate.stage in grouped){
                grouped[candidate.stage as CandidateStages].push(candidate);
            }
        });

        return grouped;
    },[data]);

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
        if(data) {
            const candidate = data.find((c : Candidate) => c.id === active.id);
            if(candidate){
                setActiveCandidate(candidate);
            }
        }
    }

    const handleDragEnd = async (event: DragEndEvent) =>{

        const { active, over } = event;
        console.log("Event", event);

        if(!over || !data) return ;

        let overId = over.id;
        const overIsColumn = candidatesStages.includes(overId as CandidateStages);

        if(!overIsColumn) {
            overId = over.data.current?.sortable.containerId;
        } 
            

        const activeContainer = active.data.current?.sortable.containerId;
        const overContainer = overId as CandidateStages;

        if(activeContainer && overContainer && activeContainer !== overContainer){
            const candidateId = active.id as string;
            console.log("CandidateId", candidateId)
            console.log("Satge", overId);

            changeCandidateStage({ candidateId, stage: overContainer })
        }
    }


    if (isLoading || isPending) return <LoadingScreeen />
    if (isError) return <ErrorPage>Error loading candidates. Try Again Later</ErrorPage>

    

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