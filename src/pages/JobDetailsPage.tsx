import { useCandidates } from '@/features/candidates/hooks/useCandidates';
import type { Candidate } from '@/features/candidates/types';
import { useJobs } from '@/features/jobs/hooks/useJobs';
import type { Job } from '@/features/jobs/types';
import {  Edit, Share2 } from 'lucide-react'; 
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';



const jobDetails = {
    id: '101',
    title: 'Senior Frontend Developer',
    status: 'Open',
    postedOn: '2025-08-20',
    hiringManager: 'Jane Doe',
};


const findJobInList = (jobs: Job[], id: string): Job | undefined => {
  return jobs?.find(j => j.id === id);
};


const JobDetailHRView = () => {
  const { jobid } = useParams<{ jobid: string }>();
  const { data: allJobs, isLoading: isLoadingJobs, isError } = useJobs({ fetchAll : true });
  const { data: allApplicants } = useCandidates();
  const navigate = useNavigate();
  
  
  const [activeTab, setActiveTab] = useState<'assessment' | "Applicants">('Applicants');
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  const [ applicants, setApplicants ] = useState<Candidate[] | null >(null);

  useEffect(() => {
    if (allJobs && allApplicants && jobid) {
      const foundJob = findJobInList(allJobs.jobs, jobid);
      setJob(foundJob);
      const candidatesForJob = allApplicants.candidates.filter((a : Candidate )=> a.jobId === jobid);
      setApplicants(candidatesForJob);
    }
  }, [jobid, allJobs, , allApplicants]); 


  // Handle loading state from your useJobs hook
  if (isLoadingJobs) {
    return <div>Loading job data...</div>;
  }

  if (isError) {
    return <div>Error fetching jobs.</div>;
  }

  // Handle case where job is not found after loading
  if (!job) {
    return <div>Job not found.</div>;
  }

  const statusColor = jobDetails.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header & Status --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className={`px-3 py-1 rounded-full font-medium ${statusColor}`}>{jobDetails.status}</span>
              <span>Hiring Manager: <strong>{jobDetails.hiringManager}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-white border rounded-md px-4 py-2 text-sm font-semibold hover:bg-gray-50"><Edit size={16} /> Edit Job</button>
            <button className="flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700"><Share2 size={16} /> Share</button>
          </div>
        </div>

        {/* --- Key Metrics --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700">Total Applicants</p>
            <p className="text-2xl font-bold">{applicants?.length}</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700">New This Week</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700">In Assessment</p>
            <p className="text-2xl font-bold">{applicants?.filter(a => a.stage === 'screen').length}</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700">Days Open</p>
            <p className="text-2xl font-bold">28</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
         
            <div className="p-6">
               <h3 className="text-xl font-semibold text-gray-800 mb-1 border-b-3 pb-3 border-gray-300 text-shadow-lg ">Job Description</h3>
              <p className="text-gray-600 text-xs font-mono">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores, assumenda? Veritatis excepturi quidem architecto possimus et repudiandae deleniti, a, impedit iusto ab quisquam atque minus recusandae labore id molestiae repellat officia culpa debitis obcaecati laborum incidunt saepe esse magnam. Corporis, distinctio aliquam quas esse ex dolore perferendis illo consectetur, est tempora dignissimos? Similique magnam aliquam numquam enim fugiat in rem perferendis, tenetur temporibus qui, iusto officiis voluptate facere, dolore aperiam! Dolor est praesentium architecto voluptatem tenetur quo eveniet aperiam repellat perferendis labore maiores ipsum et enim soluta saepe, odio corrupti voluptate delectus nam. Deserunt laborum expedita nemo veniam illum repellendus.</p>
              <p className="text-gray-600 text-xs font-mono my-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti nam optio, neque ipsa et excepturi. Esse ipsa dignissimos aliquam veniam qui harum iusto enim ratione dolor est iste et cum corporis numquam itaque quasi doloremque quaerat ea, quod molestias cumque voluptate voluptatum? Repellat, in soluta! Aliquid, maiores, voluptates quisquam labore, repudiandae temporibus deserunt excepturi cupiditate adipisci non quidem eos ut? Quos doloribus ut ipsam, iure magnam, distinctio assumenda doloremque similique corporis excepturi labore magni atque perferendis! Beatae perferendis officia tenetur enim quae inventore mollitia esse dolores, asperiores distinctio minima laudantium quia aperiam dignissimos iste culpa sunt nisi eius consequuntur? Blanditiis sunt veniam minima ex cumque nam accusamus nesciunt adipisci optio facere. Dolorem qui modi repellendus fugit maxime asperiores! Necessitatibus soluta corrupti provident, rerum eveniet molestiae sunt aliquam, laborum illo nesciunt labore illum dolorem eaque magni dolor doloremque. Fugiat alias autem rerum, ut incidunt inventore! Dicta maiores nam aspernatur minus. Labore odio exercitationem, velit excepturi veniam fugit placeat aspernatur modi sunt magnam eaque illo beatae ipsum ipsa enim consequuntur facilis vitae quia cupiditate, odit, possimus at atque unde. Debitis quaerat vel nulla a, porro hic doloremque culpa accusamus, voluptatibus aliquid unde numquam asperiores, ex architecto ut quae! Facilis inventore vel sunt?</p>
              <h3 className="text-xl font-semibold text-gray-800 my-3 border-b-3 pb-3 border-gray-300 text-shadow-lg">Skills & Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <div className="border-b">
            <nav className="flex gap-6 px-6">
              <button onClick={() => setActiveTab('Applicants')} className={`py-4 font-semibold ${activeTab === 'Applicants' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                Applicants
              </button>
              <button onClick={() => setActiveTab('assessment')} className={`py-4 font-semibold ${activeTab === 'assessment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}}`}>
  Assessment
</button>
            </nav>
          </div>

            {activeTab === 'Applicants' &&<div className="p-4">
  <div className="flex p-4 justify-center gap-16 items-center mb-4">
    <Link to={`/candidates`} className="text font-semibold text-gray-900 border-2 py-4 px-8 rounded shadow-lg" aria-disabled>
      Candidate List  
    </Link>
  </div>
  
</div>}

{activeTab === 'assessment' && (
  <div className="p-4">
  <div className="flex p-4 justify-center gap-16 items-center mb-4">
    <Link to={`/assessment/${job.id}/applicant`} className="text font-semibold text-gray-900 border-2 py-4 px-8 rounded shadow-lg" aria-disabled>
      Take Assessment 
    </Link>
    <div onClick={()=> navigate(`/assessment/${job.id}`, {state: job.title})} className="font-semibold text-gray-900 border-2 py-4 px-8 rounded shadow-lg">
      Build Assesment
    </div>
 </div>
  
</div>
)}


        </div>
      </div>
    </div>
  );
};

export default JobDetailHRView;