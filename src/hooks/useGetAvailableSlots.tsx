'use client'

import { checkIfSlotIsBooked } from '@/lib/actions/getActions'
import { useQuery } from '@tanstack/react-query'

const useGetAvailableSlots = (date:string, doctorId:string) => {
    return useQuery({
      queryKey: ["available-slots", date, doctorId],
        queryFn: async () => await checkIfSlotIsBooked(doctorId, date),
      select: (data) => data.map((item) => item.startTime),
    });

}

export default useGetAvailableSlots
