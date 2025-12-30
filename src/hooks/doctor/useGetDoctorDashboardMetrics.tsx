"use client";
import { getDoctorDashboardMetricsAction } from "@/lib/actions/doctorGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetDoctorDashboardMetrics = (doctorId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getDoctorDashboardMetrics, doctorId],
    queryFn: async () => await getDoctorDashboardMetricsAction(doctorId),
  });
};

export default useGetDoctorDashboardMetrics;
