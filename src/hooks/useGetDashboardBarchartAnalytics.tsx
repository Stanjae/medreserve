'use client'
import { getDashboardBarchartAnalytics } from "@/lib/actions/patientGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs";

const useGetDashboardBarchartAnalytics = (patientId:string, filter: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getPatientBarchartAnalytics, patientId, filter],
    queryFn: async () =>
      await getDashboardBarchartAnalytics(
        dayjs().year(),
        filter,
        patientId
      ),
  });
}

export default useGetDashboardBarchartAnalytics