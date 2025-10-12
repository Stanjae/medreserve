/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getAllRolesAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetAllRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES.getAllRoles],
      queryFn: () => getAllRolesAction(),
    select: (data) => data?.map((item:any) =>( {...item, permissions: JSON.parse(item.permissions) })),
  })
}

export default useGetAllRoles
