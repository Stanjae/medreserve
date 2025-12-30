'use client'
import { getPatientDashboardMetricsAction } from "@/lib/actions/patientGetActions"
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys"
import { useQuery } from "@tanstack/react-query"

const useGetPatientDashboardMetrics = (patientId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getPatientDashboardMetrics, patientId],
    queryFn: async () => await getPatientDashboardMetricsAction(patientId),
  })
}

export default useGetPatientDashboardMetrics