
import type { Job, PaginatedJobsResponse } from '../types';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, } from '@dnd-kit/core';
import { DraggableJobRow, JobListDnD } from './JobsListDnD';
import { Table } from '@/components/shared/Table';
import { PaginationControls } from './PaginationControls';

const jobHeaders = ['Title', 'Slug', 'Status', 'Tags' ];

export const JobTable = ({ jobs, currentPage, totalPages, setPage } : PaginatedJobsResponse)=>{
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
         <Table headers={jobHeaders}>
        <DndContext 
       sensors={sensors}
       onDragStart={handleStart}
       onDragEnd={handleDragEnd}
       collisionDetection={closestCenter}
       >
              <JobListDnD jobs={jobsData}/>
               <DragOverlay>
                  { activeJob ? (
                <DraggableJobRow job={activeJob} />                              ) : null}
               </DragOverlay>
       </DndContext>
       <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
         </Table>
    )
}

