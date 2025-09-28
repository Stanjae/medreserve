'use client'
import { createUserProfileAction, deleteUserProfileAction, updateUserProfileAction } from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { EditUserModified, EditUserParams } from "@/types/actions.types";
import { ROLES } from "@/types/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type newTypes = EditUserModified & EditUserParams

type createParamsType = EditUserModified & {role:ROLES}

const useHandleEditProfile = () => {
  const queryClient = useQueryClient();

const updateProfile = useMutation({
  mutationFn: async (params: newTypes) =>
    await updateUserProfileAction(params),
  onSettled: (data) => {
    if (data?.code == 200) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message);
    }
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.USERS.fetchUserForEdit],
    });
  },
});
  
  const createProfile = useMutation({
    mutationFn: async (params: createParamsType) =>
      await createUserProfileAction(params),
    onSettled: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS.getAllUsers],
      });
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (params: EditUserParams) =>
      await deleteUserProfileAction(params),
    onSettled: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS.getAllUsers],
      });
    },
  });
    
    return {updateProfile, createProfile, deleteProfile}
}

export default useHandleEditProfile
