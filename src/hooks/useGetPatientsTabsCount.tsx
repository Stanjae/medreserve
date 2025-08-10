'use client';
import { getPatientsTabsCountAction } from '@/lib/actions/getActions';
import { useQuery } from '@tanstack/react-query';


const useGetPatientsTabsCount = (patientDatabaseId: string) => {
    return useQuery({
      queryKey: ["patientsTabsCount"],
      queryFn: async () => await getPatientsTabsCountAction(patientDatabaseId),
    });
}

export default useGetPatientsTabsCount