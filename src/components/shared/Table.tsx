import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Status } from '@/features/jobs/types';

interface TableProps extends PropsWithChildren {
    headers: string[];
    handleStatus: (status : Status) => void;
    Status: string[];
    setSearch : (search : string ) => void;
    search: string
}

export const Table = ( { children ,setSearch,search, headers, handleStatus, Status }: TableProps )=>{
    const [ status, setStatus ] = useState<Status>('all');
    return (
         <Card className='bg-gray-300 flex flex-col gap-6 h-[80vh]'>
            
            <div className='flex justify-between'>
            <div className='flex gap-2 w-xl px-7' >
              <Input  className='h-10 bg-white' value={search} onChange={(e)=> setSearch(e.target.value)}/>
            </div>

            <div className='pr-6'>
            <Select value={status} onValueChange={(newValue: Status) => {
              setStatus(newValue);
              handleStatus(newValue);
               }}>
    <SelectTrigger>
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      {Status.map(s => 
      <SelectItem className='hover:bg-gray-200' value={s} >{s}</SelectItem>
      )}
    </SelectContent>
  </Select>
            </div>
            </div>

            <Card className='flex-1 mx-3 h-[60vh]'>
              <CardContent className='flex justify-around w-full  text-xl font-bold'>
                {headers.map((header, index ) =>(
                    <div key={header} className={cn('bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1',
                        index === 0 && 'rounded-tl-xl',
                        index === headers.length - 1 && 'rounded-tr-xl'
                    )}> {header}</div>
                ))}
              </CardContent>
              {children}
            </Card>
        </Card>
    )
}