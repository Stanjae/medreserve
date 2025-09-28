/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { newUsersTabData, usersStatusFilter } from "@/constants";
import { ActionIcon, Button, Menu, Paper } from "@mantine/core";
import { useMemo, useState } from "react";
import MedReverseTabs from "../tabs/MedReverseTabs";
import useGetUsersCountTabs from "@/hooks/admin/useGetUsersCountTabs";
import useGetAllUsers from "@/hooks/admin/useGetAllUsers";
import { ROLES } from "@/types/store";
import { CustomDataTable } from "../tables/CustomTableWrapper";
import { ModifiedUser } from "../../../types/appwrite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnsUsersFn } from "../tables/ColumnsDef";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { CDropdown } from "../dropdown/CDropdown";
import useHandleEditProfile from "@/hooks/form/useHandleEditProfile";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../modals/ConfirmationModal";

const AUsersTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultActiveTab = newUsersTabData[0].value as ROLES;
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, string | null>>({});
  const { data: usersCount } = useGetUsersCountTabs();
  const { data, isLoading, refetch } = useGetAllUsers(
    (searchParams.get("activeTab") as ROLES) ?? defaultActiveTab,
    dateRange
  );

  const { deleteProfile: { mutateAsync },
  } = useHandleEditProfile();

  const handleRowClick = (row: ModifiedUser) => {
    router.push(`${pathname}/edit?userId=${row.$id}#${row.labels}`);
  };

  const handleDelete = async () => {
    const { accountId, profileId, scheduleId } = selectedRowIds;
    if (!accountId || !profileId) return;
    await mutateAsync({
         accountId,
         profileId,
         scheduleId,
         role: (searchParams.get("activeTab") as ROLES) ?? defaultActiveTab,
       });
  };

  const newTabs = useMemo(() => {
    return newUsersTabData.map((item) => ({
      ...item,
      status: item.status as "unread" | "read",
      count: usersCount?.[item.value as keyof typeof usersCount] as number,
    }));
  }, [usersCount]);

  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    accountId: string,
    profileId: string,
    scheduleId: string | null
  ) => {
    e.stopPropagation();
    open();
    setSelectedRowIds({ accountId, profileId, scheduleId });
  };
   

  const newActionsColumns = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: { original: ModifiedUser } }) => {
      const item = row.original;
      return (
        <CDropdown
          props={{
            styles: { item: { fontSize: 13 } },
            width: 150,
            position: "bottom-end",
          }}
          trigger={
            <ActionIcon
              onClick={(event) => event.stopPropagation()}
              variant="transparent"
              aria-label="more options"
            >
              <IconDots size={15} />
            </ActionIcon>
          }
        >
          <Menu.Dropdown>
            <Button size="sm" leftSection={< IconTrash size={ 13} />}  color="red" onClick={(event) => handleOpen(event, item.$id, item.profile.$id, item.profile.doctorAvailability?.$id)}  variant= "subtle">Delete User</Button>
          </Menu.Dropdown>
        </CDropdown>
      );
    },
  };

  const columns = useMemo<ColumnDef<ModifiedUser, any>[]>(() => {
    return [...ColumnsUsersFn(
        (searchParams.get("activeTab") as ROLES) ?? defaultActiveTab
      ), newActionsColumns];
  }, []);

  return (
    <Paper p={20} radius="lg" shadow="md">
      <MedReverseTabs
        tabsGrow
        tabs={newTabs}
        justify="center"
        tabJustify="justify-center"
        defaultActiveTab={defaultActiveTab}
      />

      <CustomDataTable
        data={data?.project}
        //onTableInstanceChange={setTableInstance}
        columns={columns}
        placeHolder="Search for users..."
        refetchData={refetch}
        handleRowClick={handleRowClick}
        total={data?.total as number}
        limit={10}
        setNewDateRange={setDateRange}
        isLoading={isLoading}
        filterList={[
          {
            name: "status",
            items: usersStatusFilter,
            placeholder: "Filter by status",
          },
        ]}
      />

      <ConfirmationModal
        modalHeader="Remove User"
        modalContent="Are you sure you want to delete this user? This action cannot be undone."
        btnText="Confirm"
        opened={opened}
        close={close}
        fn={handleDelete}
      />

      {/*} <BulkActionWidget
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
      /> */}
    </Paper>
  );
};

export default AUsersTable;
