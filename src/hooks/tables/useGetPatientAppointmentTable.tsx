'use client'
import { getPatientAppointmentTable } from "@/lib/actions/getActions";
import { useQuery} from "@tanstack/react-query"
import { useSearchParams } from "next/navigation";

const useGetPatientAppointmentTable = (patientId: string) => {
  const searchParams = useSearchParams();
    return useQuery({
        queryKey: ["patient-appointments", patientId, searchParams.get("activeTab")],
            queryFn: async () => await getPatientAppointmentTable(patientId, searchParams.get("activeTab") as string),
    });
}

export default useGetPatientAppointmentTable