'use client'
import { getPatientAppointmentTable } from "@/lib/actions/getActions";
import { checkDateTimeDifferenceFromNow } from "@/utils/utilsFn";
//import { getPatientAppointmentTable } from "@/lib/actions/getActions";
import { useQuery} from "@tanstack/react-query"

const useGetPatientAppointmentTable = (patientId: string) => {
    return useQuery({
        queryKey: ["patient-appointments", patientId],
            queryFn: async () => await getPatientAppointmentTable(patientId),
            select: (data) => {
              const result = data?.project?.filter((item) => (checkDateTimeDifferenceFromNow(item?.createdAt as string) == 0 || item.paymentStatus != "pending"));
              return { project: result, total: result?.length };
            },
    });
}

export default useGetPatientAppointmentTable