"use client";
import {
  createAppointmentAction,
  deleteAppointmentAction,
} from "@/lib/actions/authActions";
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

  const createAppointment = useMutation({
    mutationFn: async (params: CreateAppointmentParams2) =>
      await createAppointmentAction(params),
    onMutate: async (newTodo) => {
      open();
      await queryClient.cancelQueries({ queryKey: ["check"] });
      const previousTodos = queryClient.getQueryData(["check"]);
      queryClient.setQueryData(["check"], () => [newTodo]);
      return { previousTodos };
    },
    onError: (err) => {
      queryClient.setQueryData(["check"], () => null);
      toast.error(`${err?.message}`);
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["check"] });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (uniqueId: string) =>
      await deleteAppointmentAction(uniqueId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["check"] });
      const previousTodos = queryClient.getQueryData(["check"]);
      queryClient.setQueryData(["check"], () => null);
      return { previousTodos };
    },
    onError: (err, _, context) => {
      const con = context?.previousTodos as CreateAppointmentParams2;
      queryClient.setQueryData(["check"], () => [con]);
      toast.error(`${err?.message}`);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["check"] });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
    },
  });

  return {
    createAppointment,
    response,
    opened,
    close,
    cancelAppointment,
  };
};

export default useReserveAppointment;
