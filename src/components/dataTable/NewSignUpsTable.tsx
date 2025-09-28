/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CustomDataTable } from "../tables/CustomTableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import { columnsSignups } from "../tables/ColumnsDef";
import { newSignupsTabData } from "@/constants";
import { Checkbox, Paper, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MedReverseTabs from "../tabs/MedReverseTabs";
import useGetAllSignUps from "@/hooks/tables/useGetAllSignUps";
import React, { useEffect } from "react";
import { ModifiedUser } from "../../../types/appwrite";
import useGetSignUpsTabsCount from "@/hooks/tables/useGetSignUpsTabsCount";
import NewSignUpDetails from "../boxes/NewSignUpDetails";
import { capitalizeFirst } from "@/utils/utilsFn";
import MedReserveModals from "../modals/MedReserveModals";
import BulkActionWidget from "../CButton/BulkActionWidget";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useVerifyBlockUser from "@/hooks/useVerifyBlockUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const NewSignUpsTable = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("activeTab")) {
      const params = new URLSearchParams();
      params.set("activeTab", "pending-doctors");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  const {
    handleBulkVerify: { mutateAsync: mutateBulkVerifyAsync },
    handleBulkBlock: { mutateAsync: mutateBulkBlockAsync },
  } = useVerifyBlockUser();

  const [dateRange, setDateRange] = React.useState<
    [string | null, string | null]
  >([null, null]);

  const { refetch, data, isLoading } = useGetAllSignUps(
    searchParams.get("activeTab"),
    dateRange
  );

  const { data: tabsCount } = useGetSignUpsTabsCount();

  const [opened, { open, close }] = useDisclosure(false);

  const [row, setRow] = React.useState<ModifiedUser>();

  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const [tableInstance, setTableInstance] = React.useState<any>(null);

  const newTabs = React.useMemo(() => {
    return newSignupsTabData.map((item) => ({
      ...item,
      count: tabsCount?.[item.value as keyof typeof tabsCount] as number,
      status: item.status as "unread" | "read",
    }));
  }, [tabsCount]);

  const newColumns: ColumnDef<ModifiedUser, any>[] = [
    {
      id: "$id",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onChange={(event) => {
            table.toggleAllPageRowsSelected(event.currentTarget.checked);
            setSelectedRows(
              event.currentTarget.checked
                ? table.getRowModel().rows.map((row) => row.original.$id)
                : []
            );
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected() && !row.getIsSelected()}
          onChange={(event) => {
            event.stopPropagation();
            const isChecked = event.currentTarget.checked;
            const rowId = row.original.$id;

            row.toggleSelected(event.currentTarget.checked);
            setSelectedRows((prev) => {
              if (isChecked) {
                // Add to selected rows
                return [...prev, rowId];
              } else {
                // Remove from selected rows
                return prev.filter((id) => id !== rowId);
              }
            });
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...columnsSignups,
  ];

  const columns = React.useMemo<ColumnDef<ModifiedUser, any>[]>(
    () => newColumns,
    []
  );

  const handleRowClick = (row: ModifiedUser) => {
    setRow(row);
    open();
  };

  const handleCloseWidget = () => {
    if (tableInstance) {
      console.log("tableInstanceRef.current", tableInstance);
      tableInstance.toggleAllRowsSelected(false);
    }
    setSelectedRows([]);
  };

  const handleBulkVerifyAction = () => {
    const activeTab = searchParams.get("activeTab");
    if (selectedRows.length > 0) {
      mutateBulkVerifyAsync({
        paramsId: selectedRows,
        status: activeTab === "pending-doctors",
      });
    }
    handleCloseWidget();
  };

  const handleBulkSuspendAction = () => {
    const activeTab = searchParams.get("activeTab");
    if (selectedRows.length > 0) {
      mutateBulkBlockAsync({
        paramsId: selectedRows,
        status: activeTab === "suspended",
      });
    }
    handleCloseWidget();
  };

  return (
    <Paper p={20} radius="lg" shadow="md">
      <MedReverseTabs tabs={newTabs} />
      <MedReserveModals
        centered
        title={row && capitalizeFirst(row?.labels as string) + " Details"}
        closeOnClickOutside={false}
        size={"xl"}
        opened={opened}
        onClose={close}
        scrollAreaComponent={ScrollArea.Autosize}
        styles={{
          body: { padding: "0px" },
        }}
      >
        {row && <NewSignUpDetails onClose={close} row={row} />}
      </MedReserveModals>

      <CustomDataTable
        data={data?.project}
        onTableInstanceChange={setTableInstance}
        columns={columns}
        placeHolder="Search for signups..."
        refetchData={refetch}
        handleRowClick={handleRowClick}
        total={data?.total as number}
        limit={10}
        setNewDateRange={setDateRange}
        isLoading={isLoading}
      />

      <BulkActionWidget
        opened={selectedRows.length > 0}
        onClose={handleCloseWidget}
        docsCount={selectedRows.length}
        confirmBtn1={
          searchParams.get("activeTab") !== "suspended" && (
            <CustomCancelBtn
              modalHeader="Are you sure?"
              modalContent={` You are about to ${searchParams.get("activeTab") === "pending-doctors" ? "verify" : "unverify"} ${selectedRows.length} items. This action is irreversible!`}
              btnText={
                searchParams.get("activeTab") === "pending-doctors"
                  ? "Verify"
                  : "Unverify"
              }
              btnProps={{
                variant: "light",
                color:
                  searchParams.get("activeTab") === "pending-doctors"
                    ? "green"
                    : "red",
              }}
              fn={handleBulkVerifyAction}
            />
          )
        }
        confirmBtn2={
          <CustomCancelBtn
            modalHeader="Are you sure?"
            modalContent={` You are about to ${searchParams.get("activeTab") === "suspended" ? "unblock" : "block"} ${selectedRows.length} items. This action is irreversible!`}
            btnText={
              searchParams.get("activeTab") === "suspended"
                ? "Unblock"
                : "Block"
            }
            btnProps={{ variant: "outline", color: "m-blue" }}
            fn={handleBulkSuspendAction}
          />
        }
      />
    </Paper>
  );
};

export default NewSignUpsTable;
