
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
import { useState } from "react";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateJob } from "../hooks/useMutations";
import type { Job } from "../types";
import { LoadingScreeen } from "@/components/shared/LoadinScreen";


export const CreateJob = ({ children }: { children: React.ReactNode }) => {

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<'active' | 'archived' | undefined>(undefined);
    const [tags, setTags] = useState('');

    const { mutate: create, isPending } = useCreateJob();

    const handleCreateJob = (closeDialog : any) => {
        const payload : Partial<Job> = {
            title,
            status,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        };
        create(payload, {
            onSuccess: () => {
                closeDialog(); // Close the dialog after success
                // Reset form
                setTitle('');
                setStatus(undefined);
                setTags('');
            }
        });
    };

    if(isPending) return <LoadingScreeen />

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-blue-600 py-2 px-4 text-white shadow-lg text-sm rounded">
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a new job posting for</AlertDialogTitle>
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
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-green-800 hover:bg-green-700" onClick={handleCreateJob} disabled={isPending || !title.trim()}>{isPending ?"Creating....":"Create Job"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};