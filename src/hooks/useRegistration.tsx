"use client";
import { registerClientAction } from "@/lib/actions/actions";
import { ClientRegistrationParams } from "@/types/actions.types";
import { parseResponse } from "@/utils/utilsFn";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMedStore } from "@/providers/med-provider";
import { ROLES } from "@/types/store.types";

const useRegistration = () => {
  const router = useRouter();
  const { setAuthCredentials } = useMedStore((state) => state);

  const registerClient = async (
    data: ClientRegistrationParams,
    role: ROLES
  ) => {
    const response = await registerClientAction(data, role);
    if (response.code !== 200) {
      toast.error(parseResponse(response?.status));
    } else {
      toast.success(response?.message);
      setAuthCredentials(response?.credentials);
      setTimeout(() => {
        router.push(`/${role}/${response?.credentials?.userId}/create-profile`);
      }, 1000);
    }
  };
  return { registerClient };
};

export default useRegistration;
