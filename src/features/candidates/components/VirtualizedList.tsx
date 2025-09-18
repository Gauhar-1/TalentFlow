import { Row } from "@/components/shared/Row"
import { Table } from "@/components/shared/Table"
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteCandidates } from "../hooks/useCandidates";
import { LoadingScreeen } from "@/components/shared/LoadinScreen";
import { ErrorPage } from "@/components/shared/ErrorPage";

const candidateHeaders = ['Name', 'Email', 'Stage', 'Action'];
const candidateStatus = [ 'all', 'applied' , 'screen' , 'tech' , 'offer' , 'hired' , 'rejected'];

export const VirtualizedList = () =>{
    const parentRef = useRef<HTMLDivElement>(null);
    const [ stageFilter, setStageFilter ] = useState('all');
    const [ searchTerm, setSearchTerm ] = useState('');

    const { data: infiniteData, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCandidates(stageFilter);

    const allFetchedCandidates = useMemo(()=>{
       return infiniteData ? infiniteData.pages.flatMap(page => page.items) : []
    },[infiniteData]);

    const filteredCandidates = useMemo(() =>{

        if(!searchTerm) return allFetchedCandidates;

        return allFetchedCandidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

    }, [allFetchedCandidates, searchTerm]);

    const rowVirtualizer = useVirtualizer({
       count: hasNextPage? filteredCandidates.length + 1 : filteredCandidates.length,
       getScrollElement: ()=> parentRef.current,
       estimateSize: () => 50,
       overscan: 5,
    });

    useEffect(() => {
        const lastItem = rowVirtualizer.getVirtualItems().at(-1);

        if(!lastItem) return;

        if(lastItem.index >= filteredCandidates.length - 1 && hasNextPage && !isFetchingNextPage){
            fetchNextPage();
        }
    },[rowVirtualizer.getVirtualItems(), filteredCandidates.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    

     if (isLoading) return <LoadingScreeen />
    if (isError) return <ErrorPage>Error loading candidates.</ErrorPage>

    return (
        <div className="px-16 py-8">
            <div className=" text-3xl font-bold text-gray-600 flex justify-center mb-5 text-shadow-lg">Candidate Virtualized list</div>
        <Table search={searchTerm} headers={candidateHeaders} setSearch={setSearchTerm} Status={candidateStatus} handleStatus={setStageFilter}>
            <div ref={parentRef} className="h-[500px] overflow-y-auto">
                <div style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}>
                    { rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const candidate = filteredCandidates[virtualItem.index];
                        if(!candidate) return null;
                        
                        return (
                          <Row key={candidate.id} candidate={candidate}
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