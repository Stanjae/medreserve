/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CustomDataTable } from "../tables/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columnsAppointment } from "../tables/ColumnsDef";
import { AppointmentColumnsType } from "@/types/table.types";
import { useMedStore } from "@/providers/med-provider";
import useGetPatientAppointmentTable from "@/hooks/tables/useGetPatientAppointmentTable";
import CustomInput from "../inputs/CustomInput";
import { statusData } from "@/constants";
import { ActionIcon, Button, Menu, Paper } from "@mantine/core";
import { CDropdown } from "../dropdown/CDropdown";
import {
  IconCancel,
  IconClockPlay,
  IconCreditCardPay,
  IconCreditCardRefund,
  IconDots,
  IconDownload,
} from "@tabler/icons-react";
import Link from "next/link";
import { getAMPWAT, isbBeforeDateTime } from "@/utils/utilsFn";
import GeneratePdfButton from "../boxes/NewPdf";
import PdfLayout from "../layout/PdfLayout";
import AppointmentReceipt from "../pdfTemplates/AppointmentReceipt";
import RescheduleAppointment from "../forms/RescheduleAppointment";
import { useDisclosure } from "@mantine/hooks";
import CustomModal from "../modals/CustomModal";

const AppointMentsTable = () => {
  const { credentials } = useMedStore((state) => state);

  const { refetch, data, isLoading } = useGetPatientAppointmentTable(
    credentials?.databaseId as string
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [row, setRow] = React.useState<AppointmentColumnsType>();

  const handleRescheduleOption =(payload: AppointmentColumnsType)=> {
    setRow(payload);
    open();
  }

  const newColumnsAppointment = [
    ...columnsAppointment,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: { original: AppointmentColumnsType } }) => {
        const payment = row.original;
        return (
          <CDropdown
            props={{
              styles: { item: { fontSize: 13 } },
              width: 150,
              position: "bottom-end",
            }}
            trigger={
              <ActionIcon variant="transparent" aria-label="more options">
                <IconDots size={16} />
              </ActionIcon>
            }
          >
            <Menu.Dropdown>
              {payment.paymentStatus == "pending" ? (
                <>
                  <Menu.Item
                    component={Link}
                    href={`/patient/${payment.patientUserId}/dashboard/appointments/book-appointment/${payment.doctorUserId}/step-2?slotId=${payment.id}`}
                    leftSection={<IconCreditCardPay size={13} />}
                  >
                    Make Payment
                  </Menu.Item>
                  <Menu.Item color="red" leftSection={<IconCancel size={13} />}>
                    Cancel Booking
                  </Menu.Item>
                </>
              ) : (
                <>
                  {payment.bookingDate &&
                    !isbBeforeDateTime(payment.bookingDate) && (
                      <>
                        <GeneratePdfButton
                          appointmentDate={payment?.bookingDate}
                          appointmentTime={getAMPWAT(
                            `${payment?.bookingDate}T${payment?.startTime}`
                          )}
                          doctorName={payment.doctorName}
                          patientName={
                            JSON.parse(payment.paymentId?.metaData)?.fullname
                          }
                          email={JSON.parse(payment.paymentId?.metaData)?.email}
                          trigger={
                            <Menu.Item
                              color="green"
                              leftSection={<IconDownload size={13} />}
                            >
                              Get Receipt
                            </Menu.Item>
                          }
                          PdfElement={
                            <PdfLayout>
                              <AppointmentReceipt
                                altTime={getAMPWAT(
                                  `${payment?.bookingDate}T${payment?.startTime}Z`
                                )}
                                altDate={payment?.bookingDate}
                                response={payment.paymentId}
                              />
                            </PdfLayout>
                          }
                        />
                        {/* reschedule */}
                        <Button size="md" color="m-blue" variant="subtle" leftSection={<IconClockPlay size={13} />} onClick={()=> handleRescheduleOption(payment)}>Reschedule</Button>
                      </>
                    )}
                  <Menu.Item
                    color="red"
                    leftSection={<IconCreditCardRefund size={13} />}
                  >
                    Refund
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </CDropdown>
        );
      },
    },
  ];

  const columns = React.useMemo<ColumnDef<AppointmentColumnsType, any>[]>(
    () => newColumnsAppointment,
    []
  );

  console.log("data", data);
  return (
    <Paper p={20} radius="lg" shadow="md">
      <CustomModal centered closeOnClickOutside={false} size={'xl'} opened={opened} onClose={close}>
        {row && <RescheduleAppointment row={row as AppointmentColumnsType} />}
      </CustomModal>
        <CustomDataTable
          data={data?.project}
          columns={columns}
          placeHolder="Search for appointments..."
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
                data={statusData}
                data-column-id="timeFrameStatus"
              />
            </div>
          }
        />
    </Paper>
  );
};

export default AppointMentsTable;
