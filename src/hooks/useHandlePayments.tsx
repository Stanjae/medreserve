"use client";
import { createPaymentAction } from "@/lib/actions/authActions";
import { useMedStore } from "@/providers/med-provider";
import { PaymentFormParams } from "@/types/actions.types";
import PaystackPop from "@paystack/inline-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useHandlePayments = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { credentials } = useMedStore((state) => state);
  const handleTransaction = async (params: PaymentFormParams) => {
    const popup = new PaystackPop();
    const response = await fetch("/api/paystack/initialize-transaction", {
      method: "POST",
      body: JSON.stringify({ email: params?.email, amount: params?.amount }),
    });
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
        const newData = {
          ...params,
          reference: res?.data?.reference,
          status: res?.data?.status,
          authorization: JSON.stringify(res?.data?.authorization),
          paidOn: res?.data?.paidAt,
          metaData: JSON.stringify(params),
        };
        const response2 = await createPaymentAction(newData);
        if (response2?.code != 201) {
          toast.error(response2?.message);
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["check"] });
        toast.success(response2?.message);
        router.push(
          `/patient/${credentials?.userId}/dashboard/appointments/book-appointment/${params.doctorId}/step-3?paymentreferenceId=${response2?.refId}`
        );
      },
    });
  };
  return { handleTransaction };
};

export default useHandlePayments;
