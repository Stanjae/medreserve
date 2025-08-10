'use client'

import { getPatientDashboardMetricsAction } from "@/lib/actions/getActions"
import { useQuery } from "@tanstack/react-query"

const useGetPatientDashboardMetrics = (patientId: string) => {
  return useQuery({
    queryKey: ['patient-dashboard-metrics', patientId],
    queryFn: async () => await getPatientDashboardMetricsAction(patientId),
  })
}

export default useGetPatientDashboardMetrics