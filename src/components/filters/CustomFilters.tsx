"use client";
import { Box, Text } from "@mantine/core";
import React from "react";

const CustomFilters = ({
  label,
  fullWidth,
  children,
}: {
  label: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Box
      bg="m-cyan.0"
      className={`${fullWidth && "flex-1"} gap-x-3 pl-[30px] items-center flex  rounded-3xl py-0 text-[18px] leading-[22.5px]`}
    >
      <Text c="m-gray" className="text-[16px]">
        {label}
      </Text>
      <div className=" flex-1">{children}</div>
    </Box>
  );
};

export default CustomFilters;
