'use client'
import { Doctor, simulateFetchNin } from "@/utils/utilsFn"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';


const useGetMedInfo = (searchTerm?:string) => {
  
    const [medInfo, setMedInfo] = useState<Doctor | null | undefined >();
    const [loading, setLoading] = useState(false);

    async function getMedId(search:string){ 
        setLoading(true);
        const medInfo = await simulateFetchNin(search, 2000)
        if(!medInfo?.data) {
            setMedInfo(null);
             setLoading(false);
            return
        }
        setMedInfo(medInfo?.data);
        setLoading(false);
    }
 
    const handleMedIdSearch = useDebouncedCallback(async(term) => {
        await getMedId(term);
    }, 300);

    useEffect(() => {
        if (searchTerm) {
           getMedId(searchTerm);
        }
      }, [searchTerm]);
    
    return {medInfo, handleMedIdSearch, loading}
}

export default useGetMedInfo