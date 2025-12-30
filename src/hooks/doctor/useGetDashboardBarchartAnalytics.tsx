'use client'
import { getDoctorDashboardBarchartAnalytics } from "@/lib/actions/doctorGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs";

const useGetDashboardBarchartAnalytics = (doctorId:string, filter: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getDoctorBarchartAnalytics, doctorId, filter],
    queryFn: async () =>
      await getDoctorDashboardBarchartAnalytics(
        dayjs().year(),
        filter,
        doctorId
      ),
  });
}

export default useGetDashboardBarchartAnalytics