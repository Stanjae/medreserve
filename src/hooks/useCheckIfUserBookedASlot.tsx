"use client";
import { checkIfUserBookedASlot } from "@/lib/actions/patientGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { checkDateTimeDifferenceFromNow } from "@/utils/utilsFn";
import { useQuery } from "@tanstack/react-query";

const useCheckIfUserBookedASlot = (
  doctorId: string,
  bookingDate: string,
  patientId: string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS.checkIfUserBookedASlot, doctorId, bookingDate, patientId],
    queryFn: async () =>
      await checkIfUserBookedASlot(doctorId, bookingDate, patientId),
    select: (data) =>
      data?.filter(
        (item) => checkDateTimeDifferenceFromNow(item.createdAt, "hour") == 0
      ),
  });
};

export default useCheckIfUserBookedASlot;
