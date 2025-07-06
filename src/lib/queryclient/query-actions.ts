import { queryOptions } from "@tanstack/react-query";

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


