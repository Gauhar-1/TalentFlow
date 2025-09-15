import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface TableProps extends PropsWithChildren {
    headers: string[];
}

export const Table = ( { children , headers }: TableProps )=>{
    return (
         <Card className='bg-gray-300 flex flex-col gap-6 h-[80vh]'>
            
            <div className='flex gap-2 w-xl px-7' >
              <Input  className='h-10 bg-white'/>
              <Button className='text-lg h-10 bg-gray-700 shadow-xl test-shadow-lg'>Search</Button>
            </div>

            <Card className='flex-1 mx-3'>
              <CardContent className='flex justify-around w-full text-xl font-bold'>
                {headers.map((header, index ) =>(
                    <div key={header} className={cn('bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1',
                        index === 0 && 'rounded-tl-xl',
                        index === headers.length - 1 && 'rounded-tr-xl'
                    )}> {header}</div>
                ))}
                {/* <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 rounded-tl-xl text-shadow-lg'>Title</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 text-shadow-lg'>Slug</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 text-shadow-lg'>Status</div>
                <div className='bg-gray-600 text-white mx-0.5 flex justify-center p-2 flex-1 rounded-tr-xl text-shadow-lg '>Tags</div> */}
              </CardContent>
              {children}
            </Card>
        </Card>
    )
}