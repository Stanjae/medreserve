'use client'
import { useQuery } from "@tanstack/react-query";

const useGetAllBanks = () => {
  return useQuery({
    queryKey: ["all-banks"],
    queryFn: async () => {
      const response = await fetch("/api/paystack/get-banks", {
        method: "GET",
      });
      return await response.json();
    },
    select: (data) =>
      data.data
        ?.map((item: { name: string; code: string }) => ({
          label: item.name,
          value: item.code,
        }))
            .filter((item: { value: string }) => {
                if (item.value != "50739" && item.value != "057") {
                    return item
            }
        }),
  });
}

export default useGetAllBanks