"use client";
import {
  EmailMethodTypes,
  TEmailServiceBodyPayload,
} from "@/types/apiServices.types";
import { toast } from "sonner";

type Props = {
  method: EmailMethodTypes;
  endpoint: string;
  showToast?: boolean;
  data: Partial<TEmailServiceBodyPayload>;
};

const useHandleEmails = () => {
  async function sendEmailAction({
    method,
    endpoint,
    showToast = true,
    data,
  }: Props) {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok && showToast) {
        toast.success("Email sent successfully! Please check your inbox.");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  return {
    sendEmailAction,
  };
};

export default useHandleEmails;
