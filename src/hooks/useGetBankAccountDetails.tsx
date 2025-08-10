"use client";
import { useQuery } from "@tanstack/react-query";

const useGetBankAccountDetails = (bankCode: string, accountNumber: string) => {
  return useQuery({
    queryKey: ["bank-account-details", accountNumber],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        bankCode,
        accountNumber,
      }).toString();
        console.log("Fetching bank account details...");
      const response = await fetch(`/api/banking/get-bank-account-details?${queryString}`, {
          method: "GET",
      });
        return await response.json();
      },
    enabled: accountNumber?.length == 10
  });
};

export default useGetBankAccountDetails;
