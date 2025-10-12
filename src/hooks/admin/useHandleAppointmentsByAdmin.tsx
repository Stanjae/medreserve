"use client";
import {
  deleteAdminAppointmentAction,
  updateAdminAppointmentAction,
} from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { updateAppointmentAdminParams } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useHandleAppointmentsByAdmin = () => {
  const queryClient = useQueryClient();

  const updateAppointment = useMutation({
    mutationFn: async ({
      userId,
      appointmentId,
      data,
    }: {
      userId: string;
      appointmentId: string;
      data: updateAppointmentAdminParams;
    }) => await updateAdminAppointmentAction(appointmentId, userId, data),
    onSuccess: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.getMonthYearAppointments],
      });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async ({
      userId,
      appointmentId,
    }: {
      userId: string;
      appointmentId: string;
    }) => await deleteAdminAppointmentAction(appointmentId, userId),
    onSuccess: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPOINTMENTS.getMonthYearAppointments],
      });
    },
  });

  return { deleteAppointment, updateAppointment };
};

export default useHandleAppointmentsByAdmin;
