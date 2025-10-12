'use client'
import { getSpecificRoleUsersAndProfilesCountAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useGetUsersCountTabs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS.getUsersTabsCount],
    queryFn: async () => await getSpecificRoleUsersAndProfilesCountAction()
  });
}

export default useGetUsersCountTabs
