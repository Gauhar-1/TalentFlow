
import { JobTable } from '@/features/jobs/components/JobTable';
import { CreateJob } from '@/features/jobs/components/CreateJobs';

export function JobsPage() {
  
  return (
    <div className="mx-auto  px-8 py-4 w-screen">
      <header className="flex justify-between  items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Board</h1>
          <p className="text-muted-foreground">Manage your company's job openings.</p>
        </div>
        <CreateJob>Create Job</CreateJob>
      </header>
      <div><JobTable
        /></div>

    </div>
  );
}