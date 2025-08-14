'use client'

import { getDoctorReviewByPatient } from "@/lib/actions/getActions";
import { useQuery } from "@tanstack/react-query"

const useCheckPatientHasReviewed = (patientId:string, doctorId:string) => {
    return useQuery({
      queryKey: ["patient-review-of-doctor", patientId, doctorId],
      queryFn: async () => await getDoctorReviewByPatient(doctorId, patientId)
    });
}

export default useCheckPatientHasReviewed