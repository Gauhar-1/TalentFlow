// src/pages/CandidateProfilePage.tsx

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Linkedin, FileText, Plus } from 'lucide-react';
import  { useState } from 'react';

// --- Mock Data for the Example ---
const candidate = {
  id: 'c1',
  name: 'Alice Johnson',
  avatarUrl: 'https://i.pravatar.cc/150?u=alice',
  currentRole: 'Senior Frontend Developer at TechCorp',
  email: 'alice.j@example.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'https://linkedin.com/in/alicejohnson',
  appliedFor: 'Lead Frontend Engineer',
};

const timelineEvents = [
  { 
    id: 4, 
    status: 'Interview Scheduled', 
    date: '2025-09-17', 
    notes: 'Scheduled for a technical interview with John Smith on Sep 19.', 
    actor: 'Jane Doe' 
  },
  { 
    id: 3, 
    status: 'Assessment Completed', 
    date: '2025-09-16', 
    notes: 'Score: 88/100. Strong results in React and TypeScript sections.', 
    actor: 'System' 
  },
  { 
    id: 2, 
    status: 'Moved to Assessment', 
    date: '2025-09-15', 
    notes: 'Candidate passed initial screening. Assessment link sent.', 
    actor: 'Jane Doe' 
  },
  { 
    id: 1, 
    status: 'Applied', 
    date: '2025-09-15', 
    notes: 'Applied via company website.', 
    actor: 'Alice Johnson' 
  },
];

const CandidateProfilePage = () => {

     const [timeline, setTimeline] = useState(timelineEvents);
  const [note, setNote] = useState('');
  const [ title ,  setTitle ] = useState('');

  // --- Handler Functions ---
  const handleSaveNote = () => {
    if (note.trim() === '') return; // Don't save empty notes

    const newEvent = {
      id: Date.now(),
      status: title,
      date: new Date().toISOString().split('T')[0],
      notes: note,
      actor: 'You', //  this would be the logged-in user
    };

    setTimeline([newEvent, ...timeline]); 
    setNote(''); 
  };
  


  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Sidebar (Left) --- */}
        <aside className="lg:col-span-1">
          <Card className="bg-gray-500 p-2 rounded-lg shadow-sm sticky top-8">
            <CardContent className='bg-white p-6 rounded'>
            <div className="flex flex-col gap-2 items-center text-center">
                <Avatar className='border-2 border-gray-600 p-10'>
                    <AvatarFallback className='font-semibold'>AN</AvatarFallback>
                </Avatar>
                <div className=''>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600">{candidate.currentRole}</p>
                </div>
            </div>
            <div className="border-t-2 border-gray-500 my-6"></div>
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold text-lg text-gray-800">Contact Information</h3>
              <a href={`mailto:${candidate.email}`} className="flex items-center gap-3 text-gray-600 font-mono hover:text-blue-600">
                <Mail size={16} /> <span>{candidate.email}</span>
              </a>
              <div className="flex items-center gap-3 font-mono text-gray-600">
                <Phone size={16} /> <span>{candidate.phone}</span>
              </div>
              <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex font-mono items-center gap-3 text-gray-600 hover:text-blue-600">
                <Linkedin size={16} /> <span>LinkedIn Profile</span>
              </a>
            </div>
            <div className="border-t-2 border-gray-500 my-6"></div>
            <div className="space-y-3">
               <h3 className="font-semibold text-gray-800">Documents</h3>
               <a href="#" className="flex items-center gap-3 text-blue-600 font-semibold hover:underline">
                 <FileText size={16} /> <span>View Resume</span>
               </a>
            </div>
            </CardContent>
          </Card>
        </aside>
        
        {/* --- Main Content (Right) --- */}
        <Card className="lg:col-span-2 max-h-[80vh] bg-gray-500 p-2">
          
            <h3 className="text-2xl font-semibold text-white my-3 mx-2 text-shadow-lg ">Hiring Pipeline</h3>
          {/* Timeline of Status Changes */}
          <CardContent className="bg-white h-full overflow-y-auto p-6 rounded-lg shadow-sm">
            <div className="relative border-l-2 border-gray-200">
              {/* Add a new note/status update */}
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

              {/* Timeline History */}
              {timeline.map((event) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfilePage;