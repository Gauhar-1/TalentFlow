import { KanbanBoard } from "@/features/candidates/components/KanbanBoard"
import { VirtualizedList } from "@/features/candidates/components/VirtualizedList";
import { useCandidates } from "@/features/candidates/hooks/useCandidates"
import { Kanban, List } from "lucide-react";
import { useState } from "react";

export const CandidateListPages = ()=>{
    const { data, isLoading, isError } = useCandidates();
    const [ listView , setListView ] = useState<'kanban' | 'list'>('list');

    if(isLoading ){
        return "loading......";
    }

    if(isError) {
        return (
            <div>
                <p>Failed tp load candidates. Please try again later.</p>
                <p>Error {isError} </p>
            </div>
        );
    }

    if(data) {
        return (
            <div className="relative">
                <div className="absolute top-6 right-16  flex bg-gray-400   border-5 border-gray-500 rounded  shadow-lg ">
                    <div onClick={() => setListView('list')} className={`${listView == 'list' ? "bg-amber-200" : ""} p-2`}>
                    <List></List>
                    </div>
                    <div onClick={() => setListView('kanban')} className={`${listView == 'kanban' ? "bg-amber-200" : ""} p-2`}>
                    <Kanban></Kanban>
                    </div>
                </div>
                {listView == 'kanban' &&<KanbanBoard candidatesData={data.candidates}></KanbanBoard>}
                {listView == 'list' && <VirtualizedList candidatesData= {data.candidates}></VirtualizedList>}
            </div>
        )
    }

    return null

}