"use client";
import { getSpecificRoleUsersAndProfilesAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { ROLES } from "@/types/store.types";
import { useQuery } from "@tanstack/react-query";

const useGetAllUsers = (
  role: ROLES,
  dateRange: [string | null, string | null]
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS.getAllUsers, role, dateRange],
    queryFn: async () =>
      await getSpecificRoleUsersAndProfilesAction(role, dateRange),
  });
};

export default useGetAllUsers;
