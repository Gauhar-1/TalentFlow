// src/pages/JobsPage.tsx

import { useState } from 'react';
import { useJobs } from '../features/jobs/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { JobTable } from '@/features/jobs/components/JobTable';

import type { Job } from '@/features/jobs/types';



export function JobsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'active' | 'archived' | 'all'>('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // 2. Call the Data Hook
  const { data, isLoading, isError, isFetching } = useJobs({
    search,
    status,
    page,
    pageSize: 1,
  });

  // 3. Render Based on Fetching State
  const renderContent = () => {
    if (isLoading) {
      // Show skeleton loaders on initial load
    //   return <TableSkeleton />;
      return "Loading........";
    }

    if (isError) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>Failed to load jobs. Please try again later.</p>
          <p> Error { isError}</p>
        </div>
      );
    }

    if (data) {
        console.log("Data ", data)
      return (
        <JobTable
          jobs={data.jobs as Job[]}
          // page={page}
          // setPage={setPage}
          // totalPages={data.totalPages}
        />
      );
    }

    return null;
  };

   

  return (
    <div className="mx-auto  p-8 w-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Board</h1>
          <p className="text-muted-foreground">Manage your company's job openings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Job</Button>
      </header>

       
      <div>{renderContent()}</div>

    </div>
  );
}