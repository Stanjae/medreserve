/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { getAppointmentsSearchAndFilterAction } from "@/lib/actions/adminGetActions";
import { searchAppointmentsResponse } from "@/types";

const useSearchForAppointments = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const bookingDate = searchParams.get("date")
    ? searchParams.get("date")
    : null;
  const newAppointmentId = searchParams.get("appointmentId")
    ? searchParams.get("appointmentId")?.toString()
    : null;
  const appointmentType = searchParams.get("type")
    ? searchParams.get("type")?.toString()
    : null;

  const { data, isLoading, error, isSuccess, isPlaceholderData, isFetching } =
      useQuery({
          queryKey: [
              QUERY_KEYS.APPOINTMENTS.searchForAppointments,
              searchParams.get("date"),
              searchParams.get("appointmentId"),
              searchParams.get("type"),
              searchParams.get("page"),
          ],
          queryFn: async (): Promise<{
              project: searchAppointmentsResponse[];
              hasMore: boolean;
              total: number;
          }> =>
              await getAppointmentsSearchAndFilterAction(
                  newAppointmentId,
                  bookingDate as string,
                  appointmentType as string,
                  Number(searchParams.get("page") || 1)
              ),
          placeholderData: keepPreviousData
    });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [
          QUERY_KEYS.APPOINTMENTS.searchForAppointments,
          Number(searchParams.get("page") || 1) + 1,
        ],
        queryFn: () =>
          getAppointmentsSearchAndFilterAction(
            newAppointmentId,
            bookingDate as string,
            appointmentType as string,
            Number(searchParams.get("page") || 1) + 1
          ),
      });
    }
  }, [
    data,
    isPlaceholderData,
    searchParams.get("page"),
    queryClient,
    searchParams.get("appointmentId"),
  ]);

  return { data, isLoading, error, isSuccess, isPlaceholderData, isFetching };
};

export default useSearchForAppointments;
