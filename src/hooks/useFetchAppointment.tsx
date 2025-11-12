'use client';
import { fetchAppointmentByIdForReschedule } from "@/lib/actions/patientGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useFetchAppointment = (slotId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS.fetchAppointmentForReschedule, slotId],
    queryFn: async () => await fetchAppointmentByIdForReschedule(slotId),
  });
};

export default useFetchAppointment;