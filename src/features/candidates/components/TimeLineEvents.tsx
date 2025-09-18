import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import type { TimeLine } from "../types";
import { useGetCandidateTimeline } from "../hooks/useCandidates";

interface TimeLineProps  {
    candidateId : string;
}

export const TimeLineEvents =({ candidateId }: TimeLineProps)=>{
    const [timeline, setTimeline] = useState<TimeLine[]>([]);
  const [note, setNote] = useState('');
  const [ title ,  setTitle ] = useState('');
  const { data, isLoading, isError, error }= useGetCandidateTimeline(candidateId);


  useEffect(()=>{
    if(data)
    setTimeline(data)
  },[data]);

  const handleSaveNote = () => {
    if (note.trim() === '') return; 

    const newEvent = {
      id: `time-${Date.now()}`,
      status: title,
      date: `${new Date().toLocaleString()}`,
      notes: note,
      actor: 'John Doe', 
    };

    setTimeline([newEvent, ...timeline]); 
    setNote(''); 
  };

  if(isLoading) return <div>Loading .....</div>
  if(isError) return <div> Error.....{error.message}</div>
    
    return (
        <div className="relative border-l-2 border-gray-200">
              <div className="mb-8 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full -left-3">
                  <Plus size={16} className="text-white" />
                </span>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <textarea placeholder="Add a Title" className="w-full border rounded-md p-2 text-sm" rows={1} value={title}
                    onChange={(e) => setTitle(e.target.value)}></textarea>
                  <textarea placeholder="Add a note or update status..." className="w-full border rounded-md p-2 text-sm" rows={2} value={note}
                    onChange={(e) => setNote(e.target.value)}></textarea>
                  <button onClick={handleSaveNote} className="mt-2 bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md text-xs hover:bg-blue-200">Save Note</button>
                </div>
              </div>

              {timeline?.map((event) => (
                <div key={event.id} className="mb-8 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full -left-3">
                  </span>
                  <div className="p-4 bg-white border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800">{event.status}</p>
                      <time className="text-sm font-normal text-gray-500">{event.date}</time>
                    </div>
                    <p className="text-sm text-gray-600">"{event.notes}" - <span className="italic">by {event.actor}</span></p>
                  </div>
                </div>
              ))}
            </div>
    )
}