/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CustomDataTable } from "../tables/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columnsPayment } from "../tables/ColumnsDef";
import { PaymentColumnsType } from "@/types/table.types";
import { useMedStore } from "@/providers/med-provider";
import CustomInput from "../inputs/CustomInput";
import { paymentStatusFilter } from "@/constants";
import { Paper } from "@mantine/core";
import useGetPatientPaymentsTable from "@/hooks/tables/useGetPatientPaymentsTable";
import MedReverseDrawer from "../drawers/MedReverseDrawer";
import { useDisclosure } from "@mantine/hooks";
import DetailDrawerCard from "../cards/DetailDrawerCard";
import { IconCurrencyNaira } from "@tabler/icons-react";
import { convertToCurrency, parseResponse } from "@/utils/utilsFn";
import DetailTimelineCard from "../cards/DetailTimelineCard";

const PaymentsTable = () => {
  const { credentials } = useMedStore((state) => state);

  const [opened, { open, close }] = useDisclosure(false);
  const [rowData, setRowData] = React.useState<
    {
      key:
        | "amount"
        | "appointmentId"
        | "currency"
        | "doctorName"
        | "reference"
      | "specialization"
      | "status"
      |"type";
      value: string | number;
      index: number;
      type: "text";
      cols?: number;
      icon?: React.ReactNode;
    }[]
  >([]);

  const [timelineData, setTimelineData] = React.useState<PaymentColumnsType[] | undefined>();
  const [activeNo, setActiveNo] = React.useState<number>(0);

  const { refetch, data, isLoading } = useGetPatientPaymentsTable(
    credentials?.databaseId as string
  );

  const columns = React.useMemo<ColumnDef<PaymentColumnsType, any>[]>(
    () => columnsPayment,
    []
  );

      const newKeys = [
        "appointmentId",
        "amount",
        "doctorName",
        "reference",
        "specialization",
        "type",
        "status",
      ] as const;

  const handeRowClick = (row: PaymentColumnsType) => {

    const arrayOfObjects = newKeys.map((key, index) => ({
      key,
      value:
        key == "amount"
          ? convertToCurrency(Number(row[key]))
          : key == "reference"
            ? `#${row[key]}`
            : parseResponse(row[key]) ,
      index,
      type: "text" as const,
      cols: key == "appointmentId" ? 12 : 6,
      icon: key == "amount" ? <IconCurrencyNaira /> : undefined,
    }));

    const timelineArray = data?.project
      .filter((item) => item.appointmentId == row.appointmentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    const index = timelineArray?.findIndex((obj) => obj.reference === row.reference) ?? 0;
    
    setRowData(arrayOfObjects);
    setTimelineData(timelineArray);
    setActiveNo(index);
    open();
  };
  return (
    <div>
      <MedReverseDrawer
        position="right"
        title="Payment Details"
        opened={opened}
        onClose={close}
      >
        <div className="space-y-5">
          <DetailDrawerCard rowData={rowData} />
          <DetailTimelineCard active={activeNo} timelineData={timelineData} />
        </div>
      </MedReverseDrawer>
      <Paper p={20} radius="lg" shadow="md">
        <CustomDataTable
          data={data?.project}
          handleRowClick={handeRowClick}
          columns={columns}
          placeHolder="Search  by reference Id..."
          refetchData={refetch}
          total={data?.total as number}
          limit={10}
          isLoading={isLoading}
          filterComponent={
            <div className="flex gap-2 justify-end">
              <CustomInput
                type="select"
                placeholder="Filter Status"
                size="md"
                radius="xl"
                data={paymentStatusFilter}
                data-column-id="status"
              />
            </div>
          }
        />
      </Paper>
    </div>
  );
};

export default PaymentsTable;
