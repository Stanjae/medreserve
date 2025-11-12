"use client";
import { getPatientAppointmentTable } from "@/lib/actions/getActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetPatientAppointmentTable = (patientId: string) => {
  const searchParams = useSearchParams();
  return useQuery({
    queryKey: [
      QUERY_KEYS.APPOINTMENTS.getPatientAppointments,
      patientId,
      searchParams.get("activeTab"),
    ],
    queryFn: async () =>
      await getPatientAppointmentTable(
        patientId,
        searchParams.get("activeTab") as string
      ),
  });
};

export default useGetPatientAppointmentTable;
