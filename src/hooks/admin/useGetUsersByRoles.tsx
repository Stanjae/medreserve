"use client";
import { getUsersByRoleAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { ROLES } from "@/types/store.types";
import { useQuery } from "@tanstack/react-query";

const useGetUsersByRoles = (role: ROLES) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES.getUsersByRole, role],
    queryFn: async () => await getUsersByRoleAction(role),
  });
};

export default useGetUsersByRoles;
