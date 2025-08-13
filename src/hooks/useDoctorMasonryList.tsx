'use client'
import { getAllDoctors } from '@/lib/actions/getActions'
import { GetDoctorsMasonryResponse } from '@/types/actions.types'
import { useQuery } from '@tanstack/react-query'

const useDoctorMasonryList = (filter:string) => {
  return useQuery({
    queryKey: ['doctor-masonry-list', filter],
    queryFn: async (): Promise<GetDoctorsMasonryResponse[]> => await getAllDoctors(filter)
  })
}

export default useDoctorMasonryList