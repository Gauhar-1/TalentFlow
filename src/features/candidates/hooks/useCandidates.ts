import { useQuery } from "@tanstack/react-query";
import axios from "axios"



const fetchCandidates = async() =>{
    try{
        const response = await axios.get(`/api/candidates`);

        if(!response.data){
            throw new Error('An error occurred while fetching the jobs');
        }

        return response.data;
    }
    catch(error){
        console.error("Error occurred while fetching the candidates", error)
    }
}

export const useCandidates = ()=>{
    return useQuery ({
        queryKey: ['candidates', {}],
        queryFn: () => fetchCandidates(),
    })
}