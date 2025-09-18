
import { Select } from "@radix-ui/react-select";
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
import { useEffect, useState } from "react";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Job } from "../types";
import { useUpdateJob } from "../hooks/useMutations";
import { Edit } from "lucide-react";


export const EditJob = ({ children , job }: { children: React.ReactNode, job: Job }) => {

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<'active' | 'archived' | undefined>(undefined);
    const [tags, setTags] = useState('');

    const { mutate: update } = useUpdateJob();

    useEffect(() => {
        if (job) {
            setTitle(job.title);
            setStatus(job.status);
            setTags(job.tags.join(', '));
        }
    }, [job]);

    const handleUpdateJob = () => {
        if(!job) return console.log("No job");
        const jobId = job.id;
        const payload = { title, status, tags: tags.split(',').map(t => t.trim()).filter(Boolean) };
        update({ jobId, updates: payload });
    };
    

    return (
        <AlertDialog>
            <AlertDialogTrigger className="flex items-center gap-2 bg-white border rounded-md px-4 py-2 text-sm font-semibold hover:bg-gray-50">
                <Edit size={16} />{children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit the Job details</AlertDialogTitle>
                </AlertDialogHeader>
                 <>
                                    <div>
                                        <label htmlFor="job-title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                        <Input className="shadow border-2" id="job-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label htmlFor="job-status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>

                                        <Select   onValueChange={(value) => setStatus(value as 'active' | 'archived')}>
                                            <SelectTrigger>
                                                <SelectValue >{status == 'active' ? 'Active' : 'Archived'}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent >
                                                <SelectGroup >
                                                        <SelectItem value='active'>Active</SelectItem>
                                                        <SelectItem value='archived'>Archived</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label htmlFor="job-tags" className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                                        <Input className="shadow border-2" value={tags} onChange={(e) => setTags(e.target.value)} />
                                    </div>
                                </>

                <AlertDialogFooter>
                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-green-800 hover:bg-green-700" onClick={handleUpdateJob} >Edit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};