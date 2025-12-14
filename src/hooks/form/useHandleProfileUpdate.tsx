import { updateUserProfileAction } from "@/lib/actions/actions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { UpdateProfileParamsType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useHandleAccountProfileUpdate = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (params: UpdateProfileParamsType) =>
      await updateUserProfileAction(params),
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message || error}`);
    },
    onSuccess: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROFILES.getUserProfileForUpdate],
      });
    },
  });

  return { updateProfile };
};

export default useHandleAccountProfileUpdate;
