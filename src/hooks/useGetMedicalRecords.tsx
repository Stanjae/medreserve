"use client";
import { fetchMedicalRecords } from "@/lib/actions/patientGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useGetMedicalRecords = (patientId: string) => {
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.MEDICAL_RECORDS, patientId, dateRange],
    queryFn: async () => await fetchMedicalRecords(patientId, dateRange),
  });
  return { data, isLoading, refetch, dateRange, setDateRange };
};

export default useGetMedicalRecords;
