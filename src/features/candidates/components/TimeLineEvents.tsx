import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import type { TimeLine } from "../types";
import { useGetCandidateTimeline } from "../hooks/useCandidates";
import { LoadingScreeen } from "@/components/shared/LoadinScreen";
import { ErrorPage } from "@/components/shared/ErrorPage";
import getCaretCoordinates from "textarea-caret";

interface TimeLineProps  {
    candidateId : string;
}

type Suggestions = {
  id : number,
  name: string,
  username: string
}

const localUsers = [
  { id: 1, name: 'Alice Johnson', username: 'alicej' },
  { id: 2, name: 'Bob Williams', username: 'bobw' },
  { id: 3, name: 'Charlie Brown', username: 'charlieb' },
  { id: 4, name: 'David Miller', username: 'davidm' },
  { id: 5, name: 'Eva Davis', username: 'evad' },
];


export const TimeLineEvents =({ candidateId }: TimeLineProps)=>{
    const [timeline, setTimeline] = useState<TimeLine[]>([]);
  const [note, setNote] = useState('');
  const [ title ,  setTitle ] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestions[]>([]);
  const { data, isLoading, isError, error }= useGetCandidateTimeline(candidateId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [caretPosition, setCaretPosition] = useState<{ top: number, left: number, height: number } | null>(null);

  const handleChange = (e : any) => {
    const newText = e.target.value;
    const textarea = e.target;
    setNote(newText);

    const cursorPosition = e.target.selectionStart;

    const textBeforeCursor = newText.substring(0, cursorPosition);
    const lastAtPosition = textBeforeCursor.lastIndexOf('@');

    if (lastAtPosition !== -1 && !textBeforeCursor.substring(lastAtPosition).includes(' ')) {
      const query = textBeforeCursor.substring(lastAtPosition + 1);
      
      const filteredUsers = localUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredUsers.length > 0) {
                const coords = getCaretCoordinates(textarea, lastAtPosition);
                setCaretPosition(coords);
                setSuggestions(filteredUsers);
            } else {
                setSuggestions([]);
                setCaretPosition(null);
            }
    } else {
      setSuggestions([]); 
      setCaretPosition(null);
    }
  };

  const handleSuggestionClick = (user : Suggestions) => {
    if(!textareaRef.current) return console.log("No text Ref");

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = note.substring(0, cursorPosition);
    const lastAtPosition = textBeforeCursor.lastIndexOf('@');
    
    const textBeforeMention = note.substring(0, lastAtPosition);
    const textAfterMention = note.substring(cursorPosition);
    const newText = `${textBeforeMention}@${user.username} ${textAfterMention}`;

    setNote(newText);
    setSuggestions([]); 
    setCaretPosition(null);

    setTimeout(() => textareaRef.current?.focus(), 0)
  };


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
      actor: 'You', 
    };

    setTimeline([newEvent, ...timeline]); 
    setNote(''); 
  };

  if(isLoading) return <LoadingScreeen />
  if(isError) return <ErrorPage>Error.....{error.message}</ErrorPage>
    
    return (
        <div className="relative border-l-2 border-gray-200">
              <div className="mb-8 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full -left-3">
                  <Plus size={16} className="text-white" />
                </span>
                <div className="bg-gray-50 p-4 rounded-lg">

                  <textarea placeholder="Add a Title" className="w-full border rounded-md p-2 text-sm" rows={1} value={title}
                    onChange={(e) => setTitle(e.target.value)}></textarea>
                  <div className="relative"> 
    <textarea 
        ref={textareaRef} 
        placeholder="Add notes and @mention a colleague..." 
        className="w-full border rounded-md p-2 text-sm" 
        rows={2} 
        value={note}
        onChange={handleChange}
    />

    {suggestions.length > 0 && caretPosition && (
        <ul className="bg-blue-100 absolute border rounded-lg shadow-lg py-1 text-xs flex flex-col gap-1 w-fit z-10"
        style={{
                        top: caretPosition.top + caretPosition.height,
                        left: caretPosition.left,
                    }}>
            {suggestions.map((user) => (
                <li key={user.id} onClick={() => handleSuggestionClick(user)}>
                    <span className="hover:bg-blue-200 p-1 hover:cursor-pointer">{user.name}</span>
                </li>
            ))}
        </ul>
    )}
</div>
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