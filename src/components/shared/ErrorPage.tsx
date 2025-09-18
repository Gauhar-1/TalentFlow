import type { ReactNode } from "react"

export const ErrorPage = ({children}:{children : ReactNode}) =>{
    return (
        <div className="h-screen w-screen flex justify-center items-center text-red-600">
        <div className="bg-gray-300 py-5 font-semibold px-6 rounded-lg shadow-lg">{children}</div>
        </div>
    )
}