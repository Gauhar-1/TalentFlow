
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JobTable } from '@/features/jobs/components/JobTable';

export function JobsPage() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="mx-auto  p-8 w-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs Board</h1>
          <p className="text-muted-foreground">Manage your company's job openings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Job</Button>
      </header>
      <div><JobTable
        /></div>

    </div>
  );
}