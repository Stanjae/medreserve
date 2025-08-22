"use client";
import { handleOTPVerifyAction, loginAdminAction } from "@/lib/actions/actions";
import { useMedStore } from "@/providers/med-provider";
import { PatientLoginParams } from "@/types/actions.types";
import { customPromise, parseResponse } from "@/utils/utilsFn";
import { useState } from "react";
import { toast } from "sonner";

const useAdminLogin = () => {
  const { setAuthCredentials } = useMedStore((state) => state);
  const [isOtpActive, setOtpActive] = useState(false);
  const loginAdmin = async (data: PatientLoginParams) => {
    const response = await loginAdminAction(data);
    if (response?.code !== 201) {
      toast.error(parseResponse(response?.status));
    } else {
      if (!response?.credentials?.emailVerification) {
        toast.error("Email not verified. Please check your email.");
        return;
      }

      const sendOtpVerificationAdmin = await fetch(
        "/api/medreserve/send-otp-mail",
        {
          method: "POST",
          body: JSON.stringify({
            email: data?.email,
            username: response?.credentials?.username,
            otpCode: response?.credentials?.otpCode,
          }),
        }
      );
      const emailResponse = await sendOtpVerificationAdmin.json();
      if (emailResponse?.code !== 200) {
        toast.error(emailResponse?.message);
        return;
      }
      toast.success(response?.message);
      localStorage.setItem(
        "adminToken",
        JSON.stringify({ ...data, username: response?.credentials?.username })
      );
      window.location.hash = "awaiting-otp-verification";
      setOtpActive(true);
    }
  };

  const handleOtpVerificationAdmin = async (
    data: PatientLoginParams,
    otpCode: string
  ) => {
    const response = await handleOTPVerifyAction(data, otpCode);
    if (response?.code !== 201) {
      toast.error(parseResponse(response?.status));
    } else {
      toast.promise(customPromise, {
        loading: "Loading...",
        success: () => `${response?.message}`,
        error: "Error",
      });
        setAuthCredentials(response?.credentials);
        localStorage.removeItem("adminToken");
      window.location.replace(
        `/${response?.credentials?.role}/${response?.credentials?.userId}/dashboard`
      );
    }
  };
  return {
    loginAdmin,
    handleOtpVerificationAdmin,
    isOtpActive,
  };
};

export default useAdminLogin;
