// src/pages/CandidateProfilePage.tsx

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { TimeLineEvents } from '@/features/candidates/components/TimeLineEvents';
import { useCandidatesById } from '@/features/candidates/hooks/useCandidates';
import { Phone, Mail, Linkedin, FileText, Plus } from 'lucide-react';
import  { useState } from 'react';
import { useParams } from 'react-router-dom';

const candidate = {
  id: 'c1',
  currentRole: 'Senior Frontend Developer at TechCorp',
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

  const { id } = useParams();
  const { data , isLoading, isError, error } = useCandidatesById(id || '');
  
  
    if (isLoading ) return <div className="text-center p-10">Loading Profile Page...</div>;
    if (isError) return <div className="text-center p-10 text-red-600">Error loading candidates.: {error.message}</div>;

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
              <h1 className="text-2xl font-bold text-gray-900">{data[0].name}</h1>
              <p className="text-gray-600">{candidate.currentRole}</p>
                </div>
            </div>
            <div className="border-t-2 border-gray-500 my-6"></div>
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold text-lg text-gray-800">Contact Information</h3>
              <a href={`mailto:${data[0].email}`} className="flex items-center gap-3 text-gray-600 font-mono hover:text-blue-600">
                <Mail size={16} /> <span>{data[0].email}</span>
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
          <CardContent className="bg-white h-full overflow-y-auto p-6 rounded-lg shadow-sm">
            <TimeLineEvents candidateId={id || ''}></TimeLineEvents>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfilePage;