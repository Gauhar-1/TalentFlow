import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Job, JobsProps } from '../types';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors,  type CollisionDetection, type DragEndEvent, type DragStartEvent, type DroppableContainer, } from '@dnd-kit/core';
import { DraggableJobRow, JobListDnD } from './JobsListDnD';

export const JobTable = ({ jobs} : JobsProps)=>{
    const [ jobsData , setJobsData ] = useState<Job[]>(jobs || []);
  const [ activeJob , setActiveJob ] = useState<Job | null>(null);

    const sensors = useSensors(
          useSensor(PointerSensor, {
              activationConstraint : {
                  distance: 8,
              },
          })
      );
  
      const handleStart = (event: DragStartEvent) =>{
          const { active } = event;
          if(jobs) {
              const job = jobs.find(j => j.id === active.id);
              if(job){
                  setActiveJob(job);
              }
          }
      }
  
      const handleDragEnd = async (event: DragEndEvent) =>{
           setActiveJob(null)
  
          const { active, over } = event;
  
          if(!over || active.id === over.id) return ;
  
          const oldIndex = jobsData.findIndex((job) => job.id === active.id);
          const newIndex = jobsData.findIndex((job) => job.id === over.id);

          if(oldIndex === -1 || newIndex === -1) return;
          
        let reorderedJobs = arrayMove(jobs, oldIndex, newIndex);

        console.log("OverId", over.id);
        console.log("active", active.id);

        const updatedJobsWithOrder = reorderedJobs.map((job, index) => ({
    ...job,
    order: index + 1, 
}));

          setJobsData(updatedJobsWithOrder);
          console.log("Updated: ", updatedJobsWithOrder);
      }


    return (
         <Card className='bg-gray-300 flex flex-col gap-6 h-[70vh]'>
            
            <div className='flex gap-2 w-xl px-7' >
              <Input  className='h-10 bg-white'/>
              <Button className='text-lg h-10 bg-gray-700 shadow-xl test-shadow-lg'>Search</Button>
            </div>

            <Card className='flex-1 mx-3'>
              <CardContent className='flex justify-around w-full text-xl font-bold'>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 rounded-tl-xl text-shadow-lg'>Title</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 text-shadow-lg'>Slug</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 text-shadow-lg'>Status</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 rounded-tr-xl text-shadow-lg '>Tags</div>
              </CardContent>
              <DndContext 
       sensors={sensors}
       onDragStart={handleStart}
       onDragEnd={handleDragEnd}
       collisionDetection={closestCenter}
       >
              <JobListDnD jobs={jobsData}/>

               <DragOverlay>
                              { activeJob ? (
                                  <DraggableJobRow job={activeJob} />
                              ) : null}
                          </DragOverlay>
       </DndContext>
            </Card>
        </Card>
    )
}