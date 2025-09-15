import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import type { JobProp, JobsProps } from "../types";


export const DraggableJobRow = ({ job } : JobProp)=>{
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
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1 '>{job.slug}</div>
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1 '>{job.status}</div>
                <div className='bg-white  mx-0.5 flex justify-center p-2 flex-1  '>{job.tags}</div>
              </div>
    )
}

export const JobListDnD = ({ jobs } : JobsProps)=>{
     return (
        <div className="flex flex-col gap-2">
            <SortableContext items={jobs.map(j => j.id)}>
            {jobs.map(job => (
                <DraggableJobRow key={job.id} job={job} />
            ))}
            </SortableContext>
        </div>
     )
}