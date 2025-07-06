"use client";
import { lgaOptions, stateOptions } from "@/lib/queryclient/query-actions";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

const useNgaStates = () => {
  const [option, setOption] = useState<string>();
  const { data: ngaStates, isError } = useSuspenseQuery(stateOptions);

  const {data:lgas} = useQuery({
    queryKey: ["nga-lga"],
      queryFn: async () => await lgaOptions(option),
      enabled: !!option
  });

  return { ngaStates, lgas, setOption, option, isError };
};

export default useNgaStates;
