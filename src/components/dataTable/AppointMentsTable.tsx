/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CustomDataTable } from "../tables/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columnsAppointment } from "../tables/ColumnsDef";
import { AppointmentColumnsType } from "@/types/table";
import { useMedStore } from "@/providers/med-provider";
import useGetPatientAppointmentTable from "@/hooks/tables/useGetPatientAppointmentTable";
import { getQueryClient } from "@/lib/queryclient/query-config";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AppointMentsTable = () => {
  const { credentials } = useMedStore((state) => state);
  const queryClient = getQueryClient();
  
  const { refetch, data } = useGetPatientAppointmentTable(credentials?.databaseId as string);

  const columns = React.useMemo<ColumnDef<AppointmentColumnsType, any>[]>(
    () => columnsAppointment,
    []
  );

  console.log('data', data.project)
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomDataTable
        data={data?.project as [] || []}
        columns={columns}
        placeHolder="Search for appointments..."
          refetchData={refetch}
          total={data?.total as number}
          limit={10}
      />
      </HydrationBoundary>
      
    </div>
  );
};

export default AppointMentsTable;
