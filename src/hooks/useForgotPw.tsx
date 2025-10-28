"use client";
import { getUserByEmail } from "@/lib/actions/authActions";
import { toast } from "sonner";
import useHandleEmails from "./useHandleEmails";
import { serviceEndpoints } from "@/lib/queryclient/serviceEndpoints";

const useForgotPw = () => {
  const { sendEmailAction } = useHandleEmails();

  const forgotPasswordPatient = async (data: { email: string }) => {
    const response = await getUserByEmail(data.email);
    if (!response) {
      toast.error("User does not exist. Please check your email address.");
      return;
    }
   await sendEmailAction({
     method: "POST",
     endpoint: serviceEndpoints.AUTH.forgotPassword,
     data: {
       redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${response?.userId}?token=${response?.argon}`,
       email: response?.email,
        username: response?.username,
     },
   });
  };
  return {
    forgotPasswordPatient,
  };
};

export default useForgotPw;
