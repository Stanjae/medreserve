"use client";
import { resetPasswordAction } from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useResetPw = () => {
  const router = useRouter();

  const resetPasswordPatient = async (data: {
    password: string;
    userId: string;
    token: string;
  }) => {
    const response = await resetPasswordAction(data?.userId, data?.password, data?.token);
    if (response?.code != 200) {
      toast.error(response?.message);
      return;
    }
    toast.success(response?.message);
    setTimeout(() => {
      router.push(`/auth/login`);
    }, 1500);
  };
  return {
    resetPasswordPatient,
  };
};

export default useResetPw;
