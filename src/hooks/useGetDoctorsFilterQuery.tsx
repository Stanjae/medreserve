/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getAvailableDoctorsFilterAction } from "@/lib/actions/getActions";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { Doctor } from "../../types/appwrite";
import { useEffect } from "react";

const useGetDoctorsFilterQuery = () => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const newDate = searchParams.get("date") ? dayjs(searchParams.get("date")).get("day") : dayjs().get("day");
    const newSpecialty = searchParams.get("specialty") ? searchParams.get("specialty")?.toString() : null;
    const now = dayjs().format("YYYY-MM-DD");
    const isPast = dayjs(searchParams.get("date") || dayjs()).isBefore(now, "day");

    const { data, isLoading, error, isSuccess, isPlaceholderData } = useQuery({
      queryKey: [
        "doctors-filter",
        searchParams.get("date"),
            searchParams.get("specialty"),
            isPast,
        searchParams.get('page')
      ],
      queryFn: async (): Promise<{project:Doctor[], hasMore: boolean, total: number}> =>
        await getAvailableDoctorsFilterAction(newSpecialty, newDate.toString(), isPast, Number(searchParams.get("page") || 1)),
      placeholderData: keepPreviousData,
    });

    useEffect(() => {
      if (!isPlaceholderData && data?.hasMore) {
        queryClient.prefetchQuery({
          queryKey: [
            "doctors-filter",
            Number(searchParams.get("page") || 1) + 1,
          ],
          queryFn: () =>
            getAvailableDoctorsFilterAction(
              newSpecialty,
              newDate.toString(),
              isPast,
              Number(searchParams.get("page") || 1) + 1
            ),
        });
      }
    }, [
      data,
      isPlaceholderData,
      searchParams.get("page"),
      queryClient,
    ]);

    return { data, isLoading, error, isSuccess, isPlaceholderData };
}

export default useGetDoctorsFilterQuery