"use client";
import { getAllUsers } from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { SignupTabsType } from "@/types/actions.types";
import { useQuery } from "@tanstack/react-query";

const useGetAllSignUps = (searchParams:string |null, dateRange: [string | null, string | null]) => {

  return useQuery({
    queryKey: [QUERY_KEYS.SIGNUPS.getAllSignups, searchParams, dateRange],
    queryFn: async () =>
      await getAllUsers(
        (searchParams as SignupTabsType) ?? "pending-doctors",
        dateRange
      ),
  });
};

export default useGetAllSignUps;
