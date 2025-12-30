'use client';
import { getPatientAppointmentsDistributionAction } from "@/lib/actions/doctorGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetPatientAppointmentTypeDistribution = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getPatientAppointmentTypeDistribution],
    queryFn: async () =>
      await getPatientAppointmentsDistributionAction(),
    refetchOnWindowFocus: true
  });
}

export default useGetPatientAppointmentTypeDistribution
