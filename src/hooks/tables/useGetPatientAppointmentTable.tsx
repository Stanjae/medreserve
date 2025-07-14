'use client'
import { getUserAppointments } from "@/lib/queryclient/query-actions";
//import { getPatientAppointmentTable } from "@/lib/actions/getActions";
import { useSuspenseQuery } from "@tanstack/react-query"

const useGetPatientAppointmentTable = (patientId: string) => {
    const response = getUserAppointments(patientId);
    return useSuspenseQuery(response);
}

export default useGetPatientAppointmentTable