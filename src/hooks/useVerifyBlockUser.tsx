"use client";
import {
    updateUserBulkStatusAction,
    updateUserBulkVerificationAction,
  updateUserStatusAction,
  updateUserVerificationAction,
} from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useVerifyBlockUser = () => {
  const queryClient = useQueryClient();
  const handleBlock = useMutation({
    mutationFn: async ({
      paramsId,
      status,
    }: {
      paramsId: string;
      status: boolean;
    }) => await updateUserStatusAction(paramsId, status),
    onSuccess: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SIGNUPS.getAllSignups],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
        }),
      ]);
    },
  });

  const handleVerify = useMutation({
    mutationFn: async ({
      paramsId,
      status,
    }: {
      paramsId: string;
      status: boolean;
    }) => await updateUserVerificationAction(paramsId, status),
    onSuccess: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SIGNUPS.getAllSignups],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
        }),
      ]);
    },
  });
    
      const handleBulkVerify = useMutation({
        mutationFn: async ({
          paramsId,
          status,
        }: {
          paramsId: string[];
          status: boolean;
        }) => await updateUserBulkVerificationAction(paramsId, status),
        onSuccess: (data) => {
          if (data?.code == 200) {
            toast.success(data?.message);
          } else {
            toast.error(data?.message);
          }
          return Promise.all([
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SIGNUPS.getAllSignups],
            }),
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
            }),
          ]);
        },
      });
    
      const handleBulkBlock = useMutation({
        mutationFn: async ({
          paramsId,
          status,
        }: {
          paramsId: string[];
          status: boolean;
        }) => await updateUserBulkStatusAction(paramsId, status),
        onSuccess: (data) => {
          if (data?.code == 200) {
            toast.success(data?.message);
          } else {
            toast.error(data?.message);
          }
          return Promise.all([
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SIGNUPS.getAllSignups],
            }),
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
            }),
          ]);
        },
      });
  return { handleBlock, handleVerify, handleBulkVerify, handleBulkBlock };
};

export default useVerifyBlockUser;
