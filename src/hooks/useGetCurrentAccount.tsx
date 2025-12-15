'use client';
import { getCurrentAccountAction } from "@/lib/actions/authActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetCurrentAccount = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ACCOUNT.getCurrentAccount],
        queryFn: async () =>await getCurrentAccountAction(),
  })
}

export default useGetCurrentAccount
