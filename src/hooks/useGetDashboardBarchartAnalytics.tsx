'use client'
import { getDashboardBarchartAnalytics } from "@/lib/actions/getActions";
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs";

const useGetDashboardBarchartAnalytics = (patientId:string, filter: string) => {
  return useQuery({
    queryKey: ["dashboard-barchart", patientId, filter],
    queryFn: async () =>
      await getDashboardBarchartAnalytics(
        dayjs().year(),
        filter,
        patientId
      ),
  });
}

export default useGetDashboardBarchartAnalytics