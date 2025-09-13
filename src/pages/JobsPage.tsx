// src/pages/JobsPage.tsx

import { useState } from 'react';
import { useJobs } from '../features/hooks/useJobs';
// import { JobsTable } from '../features/jobs/components/JobsTable';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { CreateEditJobModal } from '../features/jobs/components/CreateEditJobModal';
// import { TableSkeleton } from '@/components/shared/TableSkeleton'; // A custom skeleton component

export function JobsPage() {
  // 1. Manage UI State
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
    //   return (
        // <JobsTable
        //   jobs={data.jobs}
        //   page={page}
        //   setPage={setPage}
        //   totalPages={data.totalPages}
        // />
    //   );
    return null;
    }

    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Board</h1>
          <p className="text-muted-foreground">Manage your company's job openings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Job</Button>
      </header>

      <div className="flex items-center gap-4 mb-4">
        {/* <Input
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 when searching
          }}
          className="max-w-sm"
        /> */}
        {/* <Select value={status} onValueChange={(value) => {
          setStatus(value as any);
          setPage(1); // Reset to page 1 when filter changes
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select> */}
        {/* Optional: Show a subtle indicator when refetching in the background */}
        {isFetching && !isLoading && (
          <span className="text-sm text-muted-foreground">Updating...</span>
        )}
      </div>

      <main>{renderContent()}</main>

      {/* <CreateEditJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
}