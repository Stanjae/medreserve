"use client";
import { newSignupsTabCountAction } from "@/lib/actions/adminActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetSignUpsTabsCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNUPS.signupsTabsCount],
    queryFn: async () => await newSignupsTabCountAction()
  });
};

export default useGetSignUpsTabsCount;
