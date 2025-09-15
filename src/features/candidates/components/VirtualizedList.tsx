import { Row } from "@/components/shared/Row"
import { Table } from "@/components/shared/Table"
import type { CandidatesProps } from "../types";
import { useMemo, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJobs } from "@/features/jobs/hooks/useJobs";

const candidateHeaders = ['Name', 'Email', 'Stage', 'Applied For'];

export const VirtualizedList = ({ candidatesData } : CandidatesProps) =>{
    const parentRef = useRef<HTMLDivElement>(null);
    const { data } = useJobs();

    const rowVirtualizer = useVirtualizer({
       count: candidatesData.length,
       getScrollElement: ()=> parentRef.current,
       estimateSize: () => 50,
    });

    const jobTitleMap = useMemo(()=>{
        if(!data || !data.jobs) return;

       const map = new Map<string, string>();
       for(const job of data.jobs) {
          map.set(job.id, job.title);   
       }

       return map;
    },[data?.jobs])

    return (
        <div className="px-16 py-8">
            <div className=" text-3xl font-bold text-gray-600 flex justify-center mb-5 text-shadow-lg">Candidate Virtualized list</div>
        <Table headers={candidateHeaders}>
            <div ref={parentRef} className="h-[500px] overflow-y-auto">
                <div style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}>
                    { rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const candidate = candidatesData[virtualItem.index];
                        const jobTitle = jobTitleMap?.get(candidate.jobId || 'N/A');
                        return (
                          <Row key={candidate.id} candidate={candidate} jobTitle={jobTitle || ''} 
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                          }}></Row>
                        )
                    })}
                </div>
            </div>
        </Table>
        </div>
    )
}