import { KanbanBoard } from "@/features/candidates/components/KanbanBoard"
import { VirtualizedList } from "@/features/candidates/components/VirtualizedList";
import { Kanban, List } from "lucide-react";
import { useState } from "react";

export const CandidateListPages = ()=>{
    const [ listView , setListView ] = useState<'kanban' | 'list'>('list');

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
                {listView == 'kanban' &&<KanbanBoard></KanbanBoard>}
                {listView == 'list' && <VirtualizedList />}
            </div>
        )
}