import type { Candidate } from "@/features/candidates/types"
import type { CSSProperties } from "react";

interface RowProps {
    candidate: Candidate;
    style : CSSProperties,
    jobTitle: string,
}

export const Row = ({ candidate, style, jobTitle }: RowProps)=>{
    return (
         <div style={style} className={`flex justify-around mx-6 border-2 shadow-lg font-semibold`}>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1'>{candidate.name}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1 '>{candidate.email}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1 '>{candidate.stage}</div>
                <div className='bg-white  mx-0.5 flex items-center justify-center p-2 flex-1  '>{jobTitle}</div>
              </div>
    )
}