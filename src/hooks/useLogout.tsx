"use client";
import { signOut } from "@/lib/actions/authActions";
import { useMedStore } from "@/providers/med-provider";
import { parseResponse } from "@/utils/utilsFn";
import { toast } from "sonner";

const useLogout = () => {
  const { clearAuthCredentials } = useMedStore((state) => state);
  const logoutPatient = async () => {
    const response = await signOut();
    if (response.code !== 200) {
      toast.error(parseResponse(response?.message));
    } else {
      toast.success(response?.message);
      clearAuthCredentials();
      window.location.replace(`/auth/login`);
    }
  };
  return { logoutPatient };
};

export default useLogout;
