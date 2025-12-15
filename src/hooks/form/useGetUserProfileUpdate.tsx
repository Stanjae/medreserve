import { getUserProfileForUpdateAction } from "@/lib/actions/getActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { ROLES } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetUserProfileForUpdate = (role: ROLES, userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILES.getUserProfileForUpdate, role, userId],
    queryFn: async () => await getUserProfileForUpdateAction(role, userId),
    enabled: !!userId,
  });
};