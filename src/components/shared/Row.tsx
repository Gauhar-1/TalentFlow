import type { Candidate } from "@/features/candidates/types"
import type { CSSProperties } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface RowProps {
    candidate: Candidate;
    style : CSSProperties,
}

export const Row = ({ candidate, style }: RowProps)=>{
    const navigate = useNavigate();
    return (
         <div style={style} className={`flex justify-around mx-6 border-2 shadow-lg font-semibold`}>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1'>{candidate.name}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1 '>{candidate.email}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1 '>{candidate.stage}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1 '>
                    <Button onClick={()=> navigate(`/candidates/${candidate.id}`)} className="bg-white text-black border-2 shadow-lg border-gray-300 hover:font-bold hover:bg-gray-200">View</Button>
                </div>
              </div>
    )
}