"use client";
import {
  updateCurrentAccountEmailAction,
  updateCurrentAccountNameAction,
  updateCurrentAccountPasswordAction,
  updateCurrentAccountPhoneAction,
  updateCurrentAccountPrefsAction,
} from "@/lib/actions/authActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useHandleCurrentAccount = () => {
  const queryClient = useQueryClient();
  const updateCurrentName = useMutation({
    mutationFn: async (payload: { name: string }) =>
      await updateCurrentAccountNameAction(payload),
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while updating the name."
      );
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        });
      }
    },
  });

  const updateCurrentEmail = useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      await updateCurrentAccountEmailAction(payload),
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while updating the email."
      );
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        });
      }
    },
  });

  const updateCurrentPhone = useMutation({
    mutationFn: async (payload: { phone: string }) =>
      await updateCurrentAccountPhoneAction(payload),
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while updating the phone number."
      );
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        });
      }
    },
  });

  const updateCurrentPassword = useMutation({
    mutationFn: async (payload: { password: string; oldPassword: string }) =>
      await updateCurrentAccountPasswordAction(payload),
    onError: (error) => {
      toast.error(
        error?.message || "An error occurred while updating the password."
      );
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        });
      }
    },
  });

  const updateCurrentPrefs = useMutation({
    mutationFn: async (payload: {
      [key: string]: string | undefined | null | boolean;
    }) => await updateCurrentAccountPrefsAction(payload),
    onError: (error) => {
      toast.error(
        error?.message ||
          "An error occurred while updating account preferences."
      );
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        });
      }
    },
  });

  return {
    updateCurrentName,
    updateCurrentEmail,
    updateCurrentPhone,
    updateCurrentPassword,
    updateCurrentPrefs,
  };
};

export default useHandleCurrentAccount;
