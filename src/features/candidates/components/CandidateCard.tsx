import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Candidate } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

interface CandidateProps{
   candidate : Candidate   
}

export const CandidateCard = ( {candidate} : CandidateProps)=>{

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: candidate.id,
        data: {
            type: 'Candidate',
            candidate,
            sortable: {
                containerId: candidate.stage,
            }
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    }

    const initials = candidate.name.split(' ').map( (n : string) => n[0]).join('');

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="my-3 mx-auto w-fit  shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
    <CardContent>
       <div className="flex gap-2">
         <Avatar className="w-10 h-10 border-1  border-gray-500">
            <AvatarFallback className="bg-gray-200 text-xs font-semibold ">{initials}</AvatarFallback>
         </Avatar>

       <div className="flex-1 mt-1 flex flex-col items-center">
           <div className="font-semibold text-sm">{candidate.name}</div>
           <p className="text-xs text-gray-500">{candidate.email}</p>
       </div>
    </div>
  </CardContent>
</Card>
    )
}