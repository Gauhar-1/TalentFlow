
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "../../../components/ui/alert-dialog";
import { Input } from "../../../components/ui/input"; 
import { useState } from "react";
import { LoadingScreeen } from "@/components/shared/LoadinScreen";
import { useCreateCandidate } from "../hooks/useMutations";
import type { Candidate } from "../types";


export const CreateCandidate = ({ children }: { children: React.ReactNode }) => {

    const [ name, setName] = useState('');
    const [ email, setEmail] = useState('');
    const [ jobId, setJobId ] = useState('');

    const { mutate: create, isPending } = useCreateCandidate();

    const handleCreateCandidate = () => {
        const payload : Partial<Candidate> = {
            name,
            email,
            jobId
        };
        create(payload, {
            onSuccess: () => {
                setName('');
                setEmail('');
            }
        });
    };

    if(isPending) return <LoadingScreeen />

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-gray-600 hover:bg-gray-700 hover:font-semibold my-2 px-4 text-white shadow-lg text-sm rounded">
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a new job posting for</AlertDialogTitle>
                </AlertDialogHeader>
                 <>
                                    <div>
                                        <label htmlFor="job-title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                        <Input className="shadow border-2" id="job-title" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label htmlFor="job-status" className="block text-sm font-medium text-slate-700 mb-1">Email</label>

                                       <Input className="shadow border-2" id="job-title" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label htmlFor="job-tags" className="block text-sm font-medium text-slate-700 mb-1">Job ID</label>
                                        <Input className="shadow border-2" value={jobId} onChange={(e) => setJobId(e.target.value)} />
                                    </div>
                                </>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-green-800 hover:bg-green-700" onClick={handleCreateCandidate} disabled={isPending || !name.trim() || !email.trim()}>{isPending ?"Creating....":"Create Candidate"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};