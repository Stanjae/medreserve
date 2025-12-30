'use cient';
import { getPatientAgeDemographicsAction } from '@/lib/actions/doctorGetActions';
import { QUERY_KEYS } from '@/lib/queryclient/querk-keys';
import { useQuery } from '@tanstack/react-query';


const useGetPatientsAgeDemograph = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getPatientsAgeDemograph],
      queryFn: async () => await getPatientAgeDemographicsAction()
    })
}

export default useGetPatientsAgeDemograph
