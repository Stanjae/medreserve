/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CustomDataTable } from "../tables/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columnsAppointment } from "../tables/ColumnsDef";
import { AppointmentColumnsType } from "@/types/table.types";
import { useMedStore } from "@/providers/med-provider";
import useGetPatientAppointmentTable from "@/hooks/tables/useGetPatientAppointmentTable";
import {
  appointmentStatusData,
  appointmentTabsData,
  appointmentTypeData,
  cancel_refundStatusFilter,
} from "@/constants";
import { ActionIcon, Menu, MenuItem, Paper } from "@mantine/core";
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
  isTodayBeforeOrSameWithDateTime,
} from "@/utils/utilsFn";
import AppointmentReceipt from "../organisms/pdfTemplates/AppointmentReceipt";
import { useDisclosure } from "@mantine/hooks";
import MedReverseTabs from "../tabs/MedReverseTabs";
import useGetPatientsTabsCount from "@/hooks/useGetPatientsTabsCount";
import MedReverseDrawer from "../drawers/MedReverseDrawer";
import AppointmentDetails from "../boxes/AppointmentDetails";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useReserveAppointment from "@/hooks/useReserveAppointment";
import { usePathname, useRouter } from "next/navigation";
import useHandlePdfs from "@/hooks/useHandlePdfs";
import { serviceEndpoints } from "@/lib/queryclient/serviceEndpoints";

const AppointMentsTable = () => {
  const { credentials } = useMedStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();

  const approved_reschedule = [
    appointmentStatusData[1],
    appointmentStatusData[2],
  ];

  const { refetch, data, isLoading } = useGetPatientAppointmentTable(
    credentials?.databaseId as string
  );

  const { generatePdf } = useHandlePdfs();

  const { data: tabsCount } = useGetPatientsTabsCount(
    credentials?.databaseId as string
  );

  const { cancelReservation } = useReserveAppointment();

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);

  const [row, setRow] = React.useState<AppointmentColumnsType>();

  const handleNavigateToAction = (
    payload: AppointmentColumnsType,
    type: "reschedule" | "cancel"
  ) => {
    let url;
    switch (type) {
      case "reschedule":
        url = `${pathname}/reschedule?slotId=${payload?.id}`;
        break;
      case "cancel":
        url = `${pathname}/cancel-appointment?slotId=${payload?.id}`;
        break;
      default:
        url = `${pathname}/reschedule?slotId=${payload?.id}`;
    }
    router.push(url);
  };

  const cancelReservationAction = async (slotId: string) => {
    const response = await cancelReservation.mutateAsync(slotId);
    refetch();
    return response;
  };

  const newTabs = React.useMemo(() => {
    const safeTabsCount = tabsCount ?? {
      upcoming: 0,
      past: 0,
      today: 0,
      cancelled: 0,
    };
    return appointmentTabsData.map((item) => ({
      ...item,
      count: safeTabsCount[item.value as keyof typeof safeTabsCount],
      status: "unread" as "unread" | "read",
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

        const pdfData = {
          appointmentDate: payment?.bookingDate as string,
          appointmentTime: getAMPWAT(
            `${payment?.bookingDate}T${payment?.startTime}`
          ),
          email:
            getPaymentId?.metaData && JSON.parse(getPaymentId?.metaData)?.email,
          doctorName: payment.doctorName as string,
          patientName:
            getPaymentId?.metaData &&
            JSON.parse(getPaymentId?.metaData)?.fullname,
          PdfElement: (
            <AppointmentReceipt
              altTime={getAMPWAT(
                `${payment?.bookingDate}T${payment?.startTime}Z`
              )}
              altDate={payment?.bookingDate}
              response={getPaymentId}
              type="appointment"
            />
          ),
          endpoint: serviceEndpoints.EMAILS.confirmAppointment,
        };
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
                    modalHeader="Cancel Reservation"
                    fn={async () => await cancelReservationAction(payment.id)}
                    modalContent="Are you sure you want to cancel this reservation?"
                  />
                </>
              ) : cancel_refundStatusFilter[0] == payment.appointmentStatus ? (
                <>
                  <Menu.Item
                    color="green.9"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToAction(payment, "cancel");
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
                      <MenuItem
                        color="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          generatePdf(
                            pdfData,
                            "pdf",
                            "Appointment Receipt",
                            true
                          );
                        }}
                        leftSection={<IconDownload size={13} />}
                      >
                        Download Receipt
                      </MenuItem>
                    )}
                  {/* reschedule */}
                  {approved_reschedule.includes(payment.appointmentStatus) &&
                    !payment.didPatientSeeDoctor && (
                      <MenuItem
                        color="m-blue"
                        variant="subtle"
                        leftSection={<IconClockPlay size={13} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToAction(payment, "reschedule");
                        }}
                      >
                        Reschedule
                      </MenuItem>
                    )}
                  {approved_reschedule.includes(payment.appointmentStatus) &&
                    !payment.didPatientSeeDoctor && (
                      <Menu.Item
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToAction(payment, "cancel");
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

  const filters = [
    {
      name: "appointmentType",
      placeholder: "Filter by type",
      items: [{ label: "All", value: "all" }, ...appointmentTypeData],
    },
  ];
  return (
    <Paper p={20} radius="lg" shadow="md">
      <MedReverseTabs tabs={newTabs} defaultActiveTab="upcoming" />
      <MedReverseDrawer
        position="right"
        title="Appointment Details"
        opened={drawerOpened}
        onClose={drawerClose}
      >
        <AppointmentDetails row={row} />
      </MedReverseDrawer>
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
