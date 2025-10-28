"use client";
import { loginClientAction } from "@/lib/actions/authActions";
import { useMedStore } from "@/providers/med-provider";
import { PatientLoginParams } from "@/types/actions.types";
import { parseResponse } from "@/utils/utilsFn";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePatientLogin = () => {
  const router = useRouter();
  const { setAuthCredentials } = useMedStore((state) => state);
  const loginPatient = async (data: PatientLoginParams) => {
    const response = await loginClientAction(data);
    if (response?.code !== 200) {
      toast.error(parseResponse(response?.status));
    } else {
      toast.success(response?.message);
      setAuthCredentials(response?.credentials);
      if (!response?.credentials?.emailVerified) {
        router.push(
          `/${response?.credentials?.role}/${response?.credentials?.userId}/create-profile`
        );
        return;
      }
      window.location.replace(
        `/${response?.credentials?.role}/${response?.credentials?.userId}/dashboard`
      );
    }
  };
  return {
    loginPatient,
  };
};

export default usePatientLogin;
