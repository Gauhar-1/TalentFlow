
import type { Job, Status } from '../types';
import { useEffect, useState } from 'react';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, } from '@dnd-kit/core';
import { DraggableJobRow, JobListDnD } from './JobsListDnD';
import { Table } from '@/components/shared/Table';
import { PaginationControls } from './PaginationControls';
import { useJobs } from '../hooks/useJobs';
import { useReorderJobs } from '../hooks/useMutations';
import { LoadingScreeen } from '@/components/shared/LoadinScreen';
import { ErrorPage } from '@/components/shared/ErrorPage';

const jobHeaders = ['Title', 'Status', 'Tags', 'Actions' ];
const jobStatus = ['all', 'active', 'archived' ];

export const JobTable = ()=>{
  const [ activeJob , setActiveJob ] = useState<Job | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ title: '', status: '' });
  const [searchTerm, setSearchTerm] =useState('');
   const { data, isLoading, isError, isFetching } = useJobs({
    page,
    filters
  });
  const { mutate: reorderJobs, isPending } = useReorderJobs();

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setFilters(prev => ({...prev, title: searchTerm})) 
        },500)

        return () => clearTimeout(timer);
    },[searchTerm]);

    const sensors = useSensors(
          useSensor(PointerSensor, {
              activationConstraint : {
                  distance: 8,
              },
          })
      );
  
      const handleStart = (event: DragStartEvent) =>{
          const { active } = event;
          if(data) {
              const job = data.jobs.find(j => j.id === active.id);
              if(job){
                  setActiveJob(job);
              }
          }
      }
  
      const handleDragEnd = async (event: DragEndEvent) =>{
           setActiveJob(null)
           if(!data) return;
  
          const { active, over } = event;
  
          if(!over || active.id === over.id) return ;
  
          const oldIndex = data.jobs.findIndex((job) => job.id === active.id);
          const newIndex = data.jobs.findIndex((job) => job.id === over.id);

          if(oldIndex === -1 || newIndex === -1) return;

          const fromOrder = data.jobs[oldIndex].order;
          const toOrder = data.jobs[newIndex].order;
          
        reorderJobs({
            jobId: active.id as string,
            fromOrder,
            toOrder,
        });
      }



  const handleStatus = (status : Status ) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(1); 
  };


  const renderContent = () => {
    if (isLoading || isFetching || isPending) {
      return <LoadingScreeen />
    }

    if (isError) {
      return (
        <ErrorPage>Failed to load jobs. Please try again later.</ErrorPage>
      );
    }

      return (
        <div className={`${isFetching ? 'opacity-50' : ''}`}>
          <DndContext 
       sensors={sensors}
       onDragStart={handleStart}
       onDragEnd={handleDragEnd}
       collisionDetection={closestCenter}
       >
              <JobListDnD jobs={data?.jobs || []}/>
               <DragOverlay>
                  { activeJob ? (
                <DraggableJobRow job={activeJob} /> ) : null}
               </DragOverlay>
       </DndContext>

       {data && <PaginationControls
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />}
        </div>
      );

  };



    return (
         <Table headers={jobHeaders} Status={jobStatus} setSearch={setSearchTerm} search={searchTerm} handleStatus={handleStatus}>
         {renderContent()}
         </Table>
    )
}

