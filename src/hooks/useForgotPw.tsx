"use client";
import { getUserByEmail } from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useForgotPw = () => {
  const router = useRouter();
  /*  const forgotPasswordPatient = async(data:{email:string}) => {
        const response = await getUserByEmail(data.email);
        if(!response) {
            toast.error("User does not exist. Please check your email address.");
            return;
        }
        const apiCall = await fetch(`/api/send`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(response)});
        const polp = await apiCall.json();
        if(polp?.error){
            toast.error(polp?.error?.error);
            return
        }
        toast.success("Password reset link has been sent to your email.");
    } */

  const forgotPasswordPatient = async (data: { email: string }) => {
    const response = await getUserByEmail(data.email);
    if (!response) {
      toast.error("User does not exist. Please check your email address.");
      return;
    }
    toast.success("Successful! Redirecting to password reset...");
    setTimeout(() => {
      router.push(
        `/auth/reset-password/${response?.userId}?token=${response?.argon}`
      );
    }, 1500);
  };
  return {
    forgotPasswordPatient,
  };
};

export default useForgotPw;
