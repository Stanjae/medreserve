"use client";
import { markPrescriptionAsCompleted } from "@/lib/actions/patientActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useMarkMedicalPrescription = () => {
  const queryClient = useQueryClient();
  const markAsCompleted = useMutation({
    mutationFn: async (id: string) => await markPrescriptionAsCompleted(id),
    onError: (error) => {
      toast.error(error?.message);
    },
    onSuccess: (data) => {
      if (data.code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEDICAL_RECORDS],
        });
        toast.success(data?.message);
      }
    },
  });

  return { markAsCompleted };
};

export default useMarkMedicalPrescription;
