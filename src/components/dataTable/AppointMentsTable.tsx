/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CustomDataTable } from "../tables/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columnsAppointment } from "../tables/ColumnsDef";
import { AppointmentColumnsType } from "@/types/table.types";
import { useMedStore } from "@/providers/med-provider";
import useGetPatientAppointmentTable from "@/hooks/tables/useGetPatientAppointmentTable";
import { appointmentTabsData, appointmentType, cancel_refundStatusFilter } from "@/constants";
import { ActionIcon, Button, Menu, Paper } from "@mantine/core";
import { CDropdown } from "../dropdown/CDropdown";
import {
  IconCancel,
  IconClockPlay,
  IconCreditCardPay,
  IconCreditCardRefund,
  IconDots,
  IconDownload,
  IconReceiptRefund,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  getAMPWAT,
  getLatestObjectByCreatedAt,
  isTodayAfterDateTime,
  isTodayBeforeDateTime,
  isTodayBeforeOrSameWithDateTime,
} from "@/utils/utilsFn";
import GeneratePdfButton from "../boxes/NewPdf";
import PdfLayout from "../layout/PdfLayout";
import AppointmentReceipt from "../pdfTemplates/AppointmentReceipt";
import RescheduleAppointment from "../forms/RescheduleAppointment";
import { useDisclosure } from "@mantine/hooks";
import CustomModal from "../modals/CustomModal";
import MedReverseTabs from "../tabs/MedReverseTabs";
import useGetPatientsTabsCount from "@/hooks/useGetPatientsTabsCount";
import MedReverseDrawer from "../drawers/MedReverseDrawer";
import AppointmentDetails from "../boxes/AppointmentDetails";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useReserveAppointment from "@/hooks/useReserveAppointment";
import { useRouter } from "next/navigation";

const AppointMentsTable = () => {
  const { credentials } = useMedStore((state) => state);
  const router = useRouter();

  const { refetch, data, isLoading } = useGetPatientAppointmentTable(
    credentials?.databaseId as string
  );

  const { data: tabsCount } = useGetPatientsTabsCount(
    credentials?.databaseId as string
  );

  const { cancelAppointment } = useReserveAppointment();

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);

  const [opened, { open, close }] = useDisclosure(false);

  const [row, setRow] = React.useState<AppointmentColumnsType>();

  const handleRescheduleOption = (payload: AppointmentColumnsType) => {
    setRow(payload);
    open();
  };

  const cancelAppointmentFn = async (slotId: string) => {
    const response = await cancelAppointment.mutateAsync(slotId);
    refetch();
    refetch();
    return response;
  };

  const newTabs = React.useMemo(() => {
    const safeTabsCount = tabsCount ?? { upcoming: 0, past: 0, today: 0, cancelled: 0 };
    return appointmentTabsData.map((item) => ({
      ...item,
      count: safeTabsCount[item.value as keyof typeof safeTabsCount],
      status: 'unread' as "unread" | "read"
    }));
  }, [tabsCount]);

  const newColumnsAppointment = [
    ...columnsAppointment,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: { original: AppointmentColumnsType } }) => {
        const payment = row.original;
        const getPaymentId =
          payment?.paymentId.length > 1
            ? getLatestObjectByCreatedAt(payment?.paymentId)
            : payment?.paymentId.find((item) => item.type == "initial-fees");
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
                <IconDots size={16} />
              </ActionIcon>
            }
          >
            <Menu.Dropdown>
              {payment.appointmentStatus == "pending" ? (
                <>
                  <Menu.Item
                    component={Link}
                    href={`/patient/${payment.patientUserId}/dashboard/appointments/book-appointment/${payment.doctorUserId}/step-2?slotId=${payment.id}`}
                    leftSection={<IconCreditCardPay size={13} />}
                  >
                    Make Payment
                  </Menu.Item>
                  <CustomCancelBtn
                    btnProps={{
                      size: "md",
                      color: "red",
                      variant: "subtle",
                      leftSection: <IconCancel size={13} />,
                    }}
                    btnText="Cancel Booking"
                    modalHeader="Cancel Booking"
                    fn={async () => await cancelAppointmentFn(payment.id)}
                    modalContent="Are you sure you want to cancel this booking?"
                  />
                </>
              ) : cancel_refundStatusFilter.includes(payment.appointmentStatus) ? (
                <>
                  <Menu.Item
                    color="green.9"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/patient/${credentials?.userId}/dashboard/appointments/cancel-appointment?slotId=${payment.id}`
                      );
                    }}
                    leftSection={<IconReceiptRefund size={13} />}
                  >
                    Check Status
                  </Menu.Item>
                </>
              ) : (
                <>
                  {payment.bookingDate &&
                    isTodayBeforeOrSameWithDateTime(
                      payment.bookingDate,
                      "day"
                    ) && (
                      <>
                        <GeneratePdfButton
                          appointmentDate={payment?.bookingDate}
                          appointmentTime={getAMPWAT(
                            `${payment?.bookingDate}T${payment?.startTime}`
                          )}
                          doctorName={payment.doctorName}
                          patientName={
                            getPaymentId?.metaData &&
                            JSON.parse(getPaymentId?.metaData)?.fullname
                          }
                          email={
                            getPaymentId?.metaData &&
                            JSON.parse(getPaymentId?.metaData)?.email
                          }
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
                                response={getPaymentId}
                                type="appointment"
                              />
                            </PdfLayout>
                          }
                        />
                      </>
                    )}
                  {/* reschedule */}
                  {payment.bookingDate &&
                    isTodayBeforeDateTime(payment.bookingDate, "day") && (
                      <Button
                        size="md"
                        color="m-blue"
                        variant="subtle"
                        leftSection={<IconClockPlay size={13} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRescheduleOption(payment);
                        }}
                      >
                        Reschedule
                      </Button>
                    )}
                  {payment.bookingDate &&
                    isTodayAfterDateTime(payment.bookingDate, "day") &&
                    payment.didPatientSeeDoctor == false && (
                      <Menu.Item
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/patient/${credentials?.userId}/dashboard/appointments/refund?slotId=${payment.id}`
                          );
                        }}
                        leftSection={<IconCreditCardRefund size={13} />}
                      >
                        Refund
                      </Menu.Item>
                    )}
                  {payment.bookingDate &&
                    isTodayBeforeDateTime(payment.bookingDate, "day") &&
                    payment.didPatientSeeDoctor == false && (
                      <Menu.Item
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/patient/${credentials?.userId}/dashboard/appointments/cancel-appointment?slotId=${payment.id}`
                          );
                        }}
                        leftSection={<IconCreditCardRefund size={13} />}
                      >
                        Cancel Appointment
                      </Menu.Item>
                    )}
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

  const handleRowClick = (row: AppointmentColumnsType) => {
    setRow(row);
    drawerOpen();
  };

  const filters = [{name:"appointmentType", placeholder:"Filter by type", items:[{ label: "All", value: "all" }, ...appointmentType]}];
  return (
    <Paper p={20} radius="lg" shadow="md">
      <MedReverseTabs tabs={newTabs} />
      <MedReverseDrawer
        position="right"
        title="Appointment Details"
        opened={drawerOpened}
        onClose={drawerClose}
      >
        <AppointmentDetails row={row} />
      </MedReverseDrawer>
      <CustomModal
        centered
        closeOnClickOutside={false}
        size={"xl"}
        opened={opened}
        onClose={close}
      >
        {row && (
          <RescheduleAppointment
            handleClose={close}
            row={row as AppointmentColumnsType}
          />
        )}
      </CustomModal>
      <CustomDataTable
        data={data?.project}
        columns={columns}
        placeHolder="Search for appointments..."
        refetchData={refetch}
        handleRowClick={handleRowClick}
        total={data?.total as number}
        limit={10}
        isLoading={isLoading}
        filterList={filters}
      />
    </Paper>
  );
};

export default AppointMentsTable;
