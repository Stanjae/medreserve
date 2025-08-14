'use client'
import { getDoctorReviews } from "@/lib/actions/getActions"
import { useQuery } from "@tanstack/react-query"


const useGetDoctorsReviews = (doctorId:string) => {
  return useQuery({
    queryKey: ['doctor-reviews', doctorId],
    queryFn: async () => await getDoctorReviews(doctorId)
  })
}

export default useGetDoctorsReviews