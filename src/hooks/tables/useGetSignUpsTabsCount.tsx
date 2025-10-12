"use client";
import { getNewSignupsTabCountAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetSignUpsTabsCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
    queryFn: async () => await getNewSignupsTabCountAction()
  });
};

export default useGetSignUpsTabsCount;
