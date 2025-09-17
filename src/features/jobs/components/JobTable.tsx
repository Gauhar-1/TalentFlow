
import type { Job, Status } from '../types';
import { useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, } from '@dnd-kit/core';
import { DraggableJobRow, JobListDnD } from './JobsListDnD';
import { Table } from '@/components/shared/Table';
import { PaginationControls } from './PaginationControls';
import { useJobs } from '../hooks/useJobs';

const jobHeaders = ['Title', 'Status', 'Tags', 'Actions' ];
const jobStatus = ['all', 'active', 'archived' ];

export const JobTable = ()=>{
    const [ jobsData , setJobsData ] = useState<Job[]>([]);
  const [ activeJob , setActiveJob ] = useState<Job | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ title: '', status: '' });
  const [searchTerm, setSearchTerm] =useState('');
   const { data, isLoading, isError, isFetching } = useJobs({
    page,
    filters
  });
  
   useEffect(() => {
        if (data?.jobs) {
            setJobsData(data.jobs);
        }
    }, [data]);

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setFilters(prev => {
              const filter = {...prev, title: searchTerm}
  
              return filter;
            }) 
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
          if(jobsData) {
              const job = jobsData.find(j => j.id === active.id);
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
          
        let reorderedJobs = arrayMove(jobsData, oldIndex, newIndex);

        console.log("OverId", over.id);
        console.log("active", active.id);

        const updatedJobsWithOrder = reorderedJobs.map((job, index) => ({
    ...job,
    order: index + 1, 
}));

          setJobsData(updatedJobsWithOrder);
          console.log("Updated: ", updatedJobsWithOrder);
      }



  const handleStatus = (status : Status ) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(1); 
  };


  const renderContent = () => {
    if (isLoading || isFetching) {
      // Show skeleton loaders on initial load
    //   return <TableSkeleton />;
      return "Loading........";
    }

    if (isError) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>Failed to load jobs. Please try again later.</p>
        </div>
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
              <JobListDnD jobs={jobsData}/>
               <DragOverlay>
                  { activeJob ? (
                <DraggableJobRow job={activeJob} />                              ) : null}
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

