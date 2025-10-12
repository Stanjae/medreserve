"use client";
import {
  getAllUserRolesAction,
  getUserForEditAction,
} from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { ROLES } from "@/types/store.types";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserForEdit = (role: ROLES, userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS.fetchUserForEdit, role, userId],
    queryFn: async () => await getUserForEditAction(role, userId),
    enabled: !!userId,
  });
};

export const useFetchRolesrForEdit = (role: ROLES) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES.getAllRoles],
    queryFn: async () => await getAllUserRolesAction(),
    enabled: role === "admin",
  });
};
