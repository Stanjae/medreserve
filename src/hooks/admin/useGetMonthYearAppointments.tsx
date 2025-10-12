'use client';
import { getAllAppointmentsActionWithinYearAndMonth } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetMonthYearAppointments = (month: number, year: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.APPOINTMENTS.getMonthYearAppointments, month, year],
      queryFn: async () => await getAllAppointmentsActionWithinYearAndMonth(month, year),
    });
}

export default useGetMonthYearAppointments
