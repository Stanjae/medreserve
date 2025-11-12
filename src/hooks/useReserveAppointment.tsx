"use client";
import { createReservationAction, deleteReservationAction } from "@/lib/actions/patientActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { CreateAppointmentParams2 } from "@/types/actions.types";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const useReserveAppointment = () => {
  const queryClient = useQueryClient();
  const [response, setResponse] = useState<{
    code: number;
    message: string;
    status: string;
  }>();
  const [opened, { close, open }] = useDisclosure(false);

  const createReservation = useMutation({
    mutationFn: async (params: CreateAppointmentParams2) =>
      await createReservationAction(params),
    onMutate: async (newTodo) => {
      open();
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot] });
      const previousTodos = queryClient.getQueryData([
        QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot,
      ]);
      queryClient.setQueryData(
        [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot],
        () => [newTodo]
      );
      return { previousTodos };
    },
    onError: () => {
      queryClient.setQueryData(
        [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot],
        () => null
      );
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS.getAvailableSlots] });
    },
  });

  const cancelReservation = useMutation({
    mutationFn: async (uniqueId: string) =>
      await deleteReservationAction(uniqueId),
  
    onError: (err) => {
      toast.error(`${err?.message}`);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS.getAvailableSlots] });
    },
  });

  return {
    createReservation,
    response,
    opened,
    close,
    cancelReservation,
  };
};

export default useReserveAppointment;
