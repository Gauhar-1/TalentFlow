import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DraggableJobRow, JobListDnD } from './jobsListDnD';
import type { Job, JobsProps } from '../types';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';

export const JobTable = ({ jobs} : JobsProps)=>{
    const [ jobsData , setJobsData ] = useState<Job[] | null>(jobs);
  const [ activeJob , setActiveJob ] = useState<Job | null>(null);

    const sensors = useSensors(
          useSensor(PointerSensor, {
              activationConstraint : {
                  distance: 1,
              },
          })
      );
  
      const handleStart = (event: DragStartEvent) =>{
          setActiveJob(null);
          const { active } = event;
          if(jobs) {
              const job = jobs.find(j => j.id === active.id);
              if(job){
                  setActiveJob(job);
              }
          }
      }
  
      const handleDragEnd = async (event: DragEndEvent) =>{
  
          const { active, over } = event;
  
          if(!over || !jobs || active.id === over.id) return ;
  
          const oldIndex = jobs?.findIndex((job) => job.order === active.id);
          const newIndex = jobs?.findIndex((job) => job.order === over.id);

          if(oldIndex === -1 || newIndex === -1) return;
          
        let reorderedJobs = arrayMove(jobs, oldIndex, newIndex);
        const overId  = over.id as number;
        const activeId = active.id as number;
        console.log("OverId", overId);
        console.log("active", active.id);

        const updatedJobsWithOrder : Job[] = reorderedJobs.map((job, index) => ( job.order < overId  && job.order > activeId ? { ...job, order: index - 1} : job) )

          setJobsData(updatedJobsWithOrder);
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
       collisionDetection={rectIntersection}
       >
              <JobListDnD jobs={jobsData || []}/>

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