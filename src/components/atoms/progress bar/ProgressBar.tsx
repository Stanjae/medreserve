import { Progress } from "@mantine/core";
import React from "react";

type Props = {
  item: {
    name: string;
    value: number;
    color: string;
  };
  percentage: number;
};

const ProgressBar = ({ item, percentage }: Props) => {
  return (
    <section>
      <div className=" flex justify-between mb-1 items-center text-sm text-m-gray">
        <span>{item.name}</span>
        <div>
          {/* <span>{item.value}</span> */}
          <span>{percentage}%</span>
        </div>
      </div>
      <Progress value={percentage} color={item.color} size="xl" radius="xl" />
    </section>
  );
};

export default ProgressBar;
