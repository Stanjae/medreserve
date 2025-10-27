"use client";
import {
  cancelAdminAppointmentAction,
  deleteAdminAppointmentAction,
  markAsCompletedAppointmentAction,
  patientCheckinForAppointmentAction,
  updateAdminAppointmentAction,
} from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { cancellationActionParams, TpatientCheckinActionData, updateAppointmentAdminParams } from "@/types";
import { AppointmentStatus } from "@/types/actions.types";
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


    const cancelAppointment = useMutation({
      mutationFn: async ({
        userId,
        appointmentId,
        data,
      }: cancellationActionParams) =>
        await cancelAdminAppointmentAction(appointmentId, userId, data),
      onSuccess: (data) => {
        if (data?.code == 200) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.APPOINTMENTS.getAdminAppointmentDetail],
        });
      },
    });
  
     const patientCheckinForAppointment = useMutation({
       mutationFn: async ({
         userId,
         appointmentId,
         data,
       }: {userId: string; appointmentId: string; data: TpatientCheckinActionData}) =>
         await patientCheckinForAppointmentAction(appointmentId, userId, data),
       onSuccess: (data) => {
         if (data?.code == 200) {
           if (data?.didPatientSeeDoctor) {
             toast.success(data?.message);
           } else {
             toast.info(data?.message);
           }
           
         } else {
           toast.error(data?.message);
         }
         queryClient.invalidateQueries({
           queryKey: [QUERY_KEYS.APPOINTMENTS.getAdminAppointmentDetail],
         });
       },
     });
  
       const markAsCompletedAppointment = useMutation({
         mutationFn: async ({
           userId,
           appointmentId,
           status,
         }: {
           userId: string;
           appointmentId: string;
           status:AppointmentStatus;
         }) =>
           await markAsCompletedAppointmentAction(
             appointmentId,
             userId,
             status
           ),
         onSuccess: (data) => {
           if (data?.code == 200) {
               toast.success(data?.message);
           } else {
             toast.error(data?.message);
           }
           queryClient.invalidateQueries({
             queryKey: [QUERY_KEYS.APPOINTMENTS.getAdminAppointmentDetail],
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

  return { deleteAppointment, updateAppointment, cancelAppointment, patientCheckinForAppointment, markAsCompletedAppointment  };
};

export default useHandleAppointmentsByAdmin;
