'use client'
import { getPatientPaymentsTable } from "@/lib/actions/getActions";
import { useQuery} from "@tanstack/react-query"

const useGetPatientPaymentsTable = (patientId: string) => {
    return useQuery({
      queryKey: ["patient-payments", patientId],
      queryFn: async () => await getPatientPaymentsTable(patientId),
    });
}

export default useGetPatientPaymentsTable;