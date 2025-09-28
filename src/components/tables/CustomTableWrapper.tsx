/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import dynamic from "next/dynamic";
import { GenericTableProps } from "./CustomDataTable";
import React from "react";
import MedReserveLoader from "../loaders/MedReserveLoader";

const CustomDataTableComponent = dynamic(() => import("./CustomDataTable"), {
  loading: () => (
    <div className=" flex justify-center items-center">
      <MedReserveLoader />
    </div>
  ),
  ssr: false,
}) as <T>(props: GenericTableProps<T> & { ref?: any }) => React.JSX.Element;

export function CustomDataTable<T>(props: GenericTableProps<T>) {
  return <CustomDataTableComponent {...props} />;
}
