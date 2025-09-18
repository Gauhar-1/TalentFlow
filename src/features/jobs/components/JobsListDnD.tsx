import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import type { BadgeVariant, JobProp, JobsProps } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const badgeVariant : BadgeVariant[] = [ 'outline', 'default' , 'destructive'];


export const DraggableJobRow = ({ job } : JobProp)=>{
    const navigate = useNavigate();
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: job.id,
        data: {
            job,
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`flex justify-around mx-6 border-2  rounded-x shadow-lg transition-shadow cursor-grab active:cursor-grabbing font-semibold `}>
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1 rounded-l-xl'>{job.title}</div>
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1 '>{job.status}</div>
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1 gap-2 '>{job.tags.map((t, index) => {
                    const variant = badgeVariant[index];
                   return <Badge variant={variant} className="shadow-lg">
                       {t}
                    </Badge>
                })}
                    </div>
                <div className='bg-white  mx-0.5 flex justify-center items-center flex-1'><Button className="h-7 bg-white text-gray-500 border-2 border-dashed border-gray-400 hover:bg-gray-400 hover:text-white hover:font-bold" onClick={()=> navigate(`/jobs/${job.id}`)}>View</Button></div>
              </div>
    )
}

export const JobListDnD = ({ jobs } : JobsProps)=>{
     return (
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            <SortableContext items={jobs.map(j => j.id)}>
            {jobs.map(job => (
                <DraggableJobRow key={job.id} job={job} />
            ))}
            </SortableContext>
        </div>
     )
}