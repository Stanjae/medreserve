'use client'
import { checkIfUserBookedASlot } from "@/lib/actions/getActions";
import { checkDateTimeDifferenceFromNow } from "@/utils/utilsFn";
import { useQuery } from "@tanstack/react-query"

const useCheckIfUserBookedASlot = (
  doctorId: string,
  bookingDate: string,
  patientId: string
) => {
  return useQuery({
    queryKey: ["check", doctorId, bookingDate, patientId],
    queryFn: async () =>
      await checkIfUserBookedASlot(doctorId, bookingDate, patientId),
      //refetchIntervalInBackground: true,
    select: (data) => data?.filter((item) => checkDateTimeDifferenceFromNow(item.createdAt) == 0)
  });
};

export default useCheckIfUserBookedASlot
