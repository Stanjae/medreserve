"use client";
import React from "react";
import CustomInput from "../inputs/CustomInput";

type Props = {
  id: string;
  data: { label: string; value: string }[];
  placeholder?: string;
};

const TableFilters = ({ id, data, placeholder }: Props) => {
  return (
    <CustomInput
      type="select"
      placeholder={placeholder}
      data={data}
      data-column-id={id}
    />
  );
};

export default TableFilters;
