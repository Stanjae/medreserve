import { queryOptions } from "@tanstack/react-query";
//import { getPatientAppointmentTable } from "../actions/getActions";
//import { checkDateTimeDifferenceFromNow } from "@/utils/utilsFn";

export const stateOptions = queryOptions({
  queryKey: ["nga-states"],
  queryFn: async () => {
    const response = await fetch("https://nga-states-lga.onrender.com/fetch");
    const json = await response.json();
    return json || [];
  },
});

export const lgaOptions = async (state: string | undefined) => {
  const response = await fetch(
    `https://nga-states-lga.onrender.com/?state=${state}`
  );
  const json = await response.json();
  return json || [];
};

/* export const getUserAppointments = (patientId: string) =>
  queryOptions({
    queryKey: ["patient-appointments", patientId],
    queryFn: async () => await getPatientAppointmentTable(patientId),
    select: (data) => {
      const result = data ?.project?.filter((item) => (checkDateTimeDifferenceFromNow(item.createdAt) == 0 || item.paymentStatus != "pending"));
      return { project: result, total: result?.length };
    },
  }); */

