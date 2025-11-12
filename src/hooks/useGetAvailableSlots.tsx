"use client";
import { checkIfSlotIsBooked } from "@/lib/actions/patientGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetAvailableSlots = (date: string, doctorId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS.getAvailableSlots, date, doctorId],
    queryFn: async () => await checkIfSlotIsBooked(doctorId, date),
    select: (data) => data.map((item) => item.startTime),
  });
};

export default useGetAvailableSlots;
