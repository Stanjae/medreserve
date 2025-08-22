"use client";
import { getAllUsers } from "@/lib/actions/adminActions";
import { ROLES } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetAllSignUps = () => {
  const searchParams = useSearchParams();
  return useQuery({
    queryKey: ["all-signups", searchParams.get("signupTab")],
    queryFn: async () =>
      await getAllUsers((searchParams.get("signupTab") as ROLES) ?? "doctor"),
  });
};

export default useGetAllSignUps;
