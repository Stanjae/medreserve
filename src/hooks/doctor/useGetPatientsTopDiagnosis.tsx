'use cient';
import { getPatientTopDiagnosisAction } from '@/lib/actions/doctorGetActions';
import { QUERY_KEYS } from '@/lib/queryclient/querk-keys';
import { useQuery } from '@tanstack/react-query';


const useGetPatientsTopDiagnosis = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.getPatientsTopDiagnosis],
    queryFn: async () => await getPatientTopDiagnosisAction(),
  });
}

export default useGetPatientsTopDiagnosis;
