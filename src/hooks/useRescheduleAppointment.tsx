"use client";
import RescheduleReceipt, {
  ExtendedParams,
} from "@/components/pdfTemplates/RescheduleReceipt";
import { reschedulePaymentAction } from "@/lib/actions/authActions";
import { useMedStore } from "@/providers/med-provider";
import { RescheduleAppointmentParams } from "@/types/actions.types";
import PaystackPop from "@paystack/inline-js";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import useHandleEmails from "./useHandleEmails";
import { serviceEndpoints } from "@/lib/queryclient/serviceEndpoints";
import { convertPdfBlobToBase64 } from "@/utils/utilsFn";

const useRescheduleAppointment = (
  setActive: React.Dispatch<React.SetStateAction<number>>
) => {
  const queryClient = useQueryClient();
  const { credentials } = useMedStore((state) => state);
  const [message, setMessage] = useState<string>("");

  const { sendEmailAction } = useHandleEmails();
  const setPDF = (params: RescheduleAppointmentParams & ExtendedParams) => (
    <RescheduleReceipt response={params} />
  );

  const handleTransaction = async (
    params: RescheduleAppointmentParams,
    type: "reschedule-fees" | "initial-fees"
  ) => {
    const popup = new PaystackPop();
    const response = await fetch(
      serviceEndpoints.PAYSTACK.initializeTransaction,
      {
        method: "POST",
        body: JSON.stringify({ email: params?.email, amount: params?.amount }),
      }
    );
    const data = await response.json();
    popup.resumeTransaction(data?.data?.access_code, {
      onSuccess: async (transaction) => {
        const queryString = new URLSearchParams({
          ref: transaction.reference,
        }).toString();
        const url = `/api/paystack/verify-status?${queryString}`;
        const responseData = await fetch(url, {
          method: "GET",
        });
        const res = await responseData.json();
        const meta = {
          amount: params?.amount,
          email: params?.email,
          fullname: params?.fullname,
          phone: params?.phone,
          capacity: params?.capacity,
          address: params?.address,
          patientId: params?.patientId,
          doctorId: params?.doctorId,
          slotId: params?.slotId,
        };
        const newData = {
          ...params,
          type,
          reference: res?.data?.reference,
          status: res?.data?.status,
          authorization: JSON.stringify(res?.data?.authorization),
          paidOn: res?.data?.paidAt,
          metaData: JSON.stringify(meta),
        };
        const pdfComponent = setPDF(newData);
        const pdfBase64 = await convertPdfBlobToBase64(pdfComponent);
        const response2 = await reschedulePaymentAction(newData);
        if (response2?.code != 201) {
          toast.error(response2?.message);
          return;
        }
        sendEmailAction({ method: "POST", endpoint: serviceEndpoints.EMAILS.rescheduleEmail, data: { pdfBase64, email: params?.email, appointmentDate: params?.bookingDate, appointmentTime: `${params?.startTime} - ${params?.endTime}`, doctorName: params?.doctorName, patientName: params?.fullname } })
        
        queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
        setMessage(
          response2?.message.replace("user", credentials?.username as string)
        );
        setActive((prev) => prev + 1);
      },
    });
  };
  return { handleTransaction, message };
};

export default useRescheduleAppointment;
