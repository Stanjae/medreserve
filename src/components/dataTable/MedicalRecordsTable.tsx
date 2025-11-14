/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, SetStateAction } from "react";
import { CustomDataTable } from "../tables/CustomTableWrapper";
import { ActionIcon, Menu, Paper } from "@mantine/core";
import { MedicalRecord } from "../../../types/appwrite";
import { ColumnDef } from "@tanstack/react-table";
import { CDropdown } from "../dropdown/CDropdown";
import { IconDots } from "@tabler/icons-react";
import { columnsMedicalRecords } from "../tables/ColumnsDef";
import MedicalRecordsDetail from "../molecules/modals/MedicalRecordsDetail";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  data: MedicalRecord[] | undefined;
  isLoading: boolean;
  refetch: () => void;
  setNewDateRange?: Dispatch<SetStateAction<[string | null, string | null]>>;
};

const MedicalRecordsTable = ({
  data,
  isLoading,
  refetch,
  setNewDateRange,
}: Props) => {
  const [row, setRow] = React.useState<MedicalRecord>();
  const [opened, { open, close }] = useDisclosure(false);

    const handleRowClick = (row: MedicalRecord) => {
      setRow(row);
      open();
    };

  const newColumnsMedicalRecords = [
    ...columnsMedicalRecords,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: { original: MedicalRecord } }) => {
        //const singleRecord = row.original;
        return (
          <CDropdown
            props={{
              styles: { item: { fontSize: 13 } },
              width: 200,
              position: "bottom-end",
            }}
            trigger={
              <ActionIcon
                onClick={(event) => {
                  event.stopPropagation();
                }}
                variant="transparent"
                aria-label="more options"
              >
                <IconDots size={16} />
              </ActionIcon>
            }
          >
            <Menu.Dropdown>
              <Menu.Item onClick={() => handleRowClick(row.original)}>View Details</Menu.Item>
            </Menu.Dropdown>
          </CDropdown>
        );
      },
    },
  ];

  const columns = React.useMemo<ColumnDef<MedicalRecord, any>[]>(
    () => newColumnsMedicalRecords,
    []
  );

  return (
    <div>
      <Paper p={20} radius="lg" shadow="md">
        <CustomDataTable
          data={data}
          columns={columns}
          placeHolder="Search for medical records..."
          refetchData={refetch}
          handleRowClick={handleRowClick}
          setNewDateRange={setNewDateRange}
          total={data?.length as number}
          limit={10}
          isLoading={isLoading}
        />
      </Paper>
      <MedicalRecordsDetail onClose={close} opened={opened } record={row} />
    </div>
  );
};

export default MedicalRecordsTable;
