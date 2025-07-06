'use client'
import { simulateFetchUniversities } from '@/utils/utilsFn'
import { useQuery } from '@tanstack/react-query'

const useGetUniversities = () => {
    const { data:universities, isLoading } = useQuery({
        queryKey: ['universities'],
        queryFn: async () => await simulateFetchUniversities(2000)
    })
  return {universities, isLoading}
}

export default useGetUniversities