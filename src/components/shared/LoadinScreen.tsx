import { Skeleton } from "../ui/skeleton";

export const LoadingScreeen = ()=>{
    return (
        <div className="p-8">
        <Skeleton className="h-[70vh] bg-gray-400 "></Skeleton>
        </div>
    )
}