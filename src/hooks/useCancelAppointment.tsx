"use client";
import { createCancellationAction } from "@/lib/actions/patientActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { RefundAppointmentParams } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCancelAppointment = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const handleCancelAction = useMutation({
    mutationFn: async (params: RefundAppointmentParams) => await createCancellationAction(params),
    onError: (error) => {
      toast.error(error?.message)
    },
    onSuccess: () => {
      open();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.getPatientAppointments],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.fetchAppointmentForReschedule],
      });
    }
  });

  return {
    handleCancelAction,
    opened,
    close,
  };
};

export default useCancelAppointment;
