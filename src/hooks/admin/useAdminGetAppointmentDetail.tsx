"use client";

import { getAppointmentDetailsAction } from "@/lib/actions/adminGetActions";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { useQuery } from "@tanstack/react-query";

const useAdminGetAppointmentDetail = (slotId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS.getAdminAppointmentDetail, slotId],
    queryFn: async () => await getAppointmentDetailsAction(slotId),
  });
};

export default useAdminGetAppointmentDetail;
