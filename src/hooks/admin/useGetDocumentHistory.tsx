'use client'
import { getAppointmentDocumentHistory } from "@/lib/actions/adminGetActions"
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys"
import { useQuery } from "@tanstack/react-query"

const useGetAppointmentDocumentsHistory = (documentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HISTORY.getAllHistory, documentId],
    queryFn: async () => await getAppointmentDocumentHistory(documentId),
  });
};

export default useGetAppointmentDocumentsHistory;
