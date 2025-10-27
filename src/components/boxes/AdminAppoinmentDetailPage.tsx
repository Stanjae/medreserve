"use client";
import { durationOfVisit, statusConfig } from "@/constants";
import useHandlePdfs from "@/hooks/useHandlePdfs";
import {
  formatCurrency,
  getAMPM,
  getAppointmentLocation,
  getTimeFromNow,
  isTodayAfterDateTime,
  isTodayBeforeDateTime,
  isTodaySameWithOrAfterDateTime,
} from "@/utils/utilsFn";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  MenuDropdown,
  MenuItem,
  Tabs,
} from "@mantine/core";
import {
  Icon,
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCancel,
  IconCheck,
  IconClipboard,
  IconClock,
  IconClock24,
  IconCurrencyDollar,
  IconDownload,
  IconEdit,
  IconFileText,
  IconHistory,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPrinter,
  IconProps,
  IconSend,
  IconStethoscope,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import AppointmentDetailPagePdf from "../pdfTemplates/AppointmentDetailPagePdf";
import { CopyButton } from "../atoms/Buttons/CopyButton";
import CustomModal from "../modals/CustomModal";
import CancelAppointmentCard from "../cards/CancelAppointmentCard";
import { useDisclosure } from "@mantine/hooks";
import useHandleAppointmentsByAdmin from "@/hooks/admin/useHandleAppointmentsByAdmin";
import { useMedStore } from "@/providers/med-provider";
import useAdminGetAppointmentDetail from "@/hooks/admin/useAdminGetAppointmentDetail";
import MedReserveLoader from "../loaders/MedReserveLoader";
import MedReserveSwitch from "../atoms/Buttons/MedReserveSwitch";
import { CDropdown } from "../dropdown/CDropdown";
import MedReserveButton from "../atoms/Buttons/MedReserveButton";
import ConfirmationModal from "../modals/ConfirmationModal";

type Props = {
  slotId: string;
};
const AppoinmentDetailPage = ({ slotId }: Props) => {
  const { data, isLoading } = useAdminGetAppointmentDetail(slotId);

  const [showCancelModal, { close, open }] = useDisclosure(false);

  const [
    openedMarkAsCompletedModal,
    { close: closeMarkAsCompleted, open: openMarkAsCompleted },
  ] = useDisclosure(false);

  const { credentials } = useMedStore((store) => store);

  const router = useRouter();
  const pathName = usePathname();

  const { generatePdf } = useHandlePdfs({
    appointmentDate: data?.bookingDate as string,
    appointmentTime: data?.startTime as string,
    email: data?.patientId.email as string,
    patientName: data?.patientId.fullname as string,
    doctorName: data?.doctorId.fullname as string,
    PdfElement: <AppointmentDetailPagePdf data={data} />,
  });

  const {
    cancelAppointment,
    patientCheckinForAppointment,
    markAsCompletedAppointment,
  } = useHandleAppointmentsByAdmin();

  const handlePrint = () => {
    window.print();
  };

  const statusKey = data?.status as keyof typeof statusConfig;
  const status = statusConfig[statusKey];
  const StatusIcon = data ? status.icon : IconMail;

  const tabsHeaders = [
    { id: "overview", label: "Overview", icon: IconFileText },
    { id: "patientId", label: "Patient Info", icon: IconUser },
    { id: "billing", label: "Billing", icon: IconCurrencyDollar },
    { id: "history", label: "History", icon: IconHistory },
  ];

  const approvedStatus = ["approved", "rescheduled"];

  const InfoCard = ({
    title,
    children,
    icon: Icon,
  }: {
    title: string | undefined;
    children: React.ReactNode;
    icon?: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<Icon>
    >;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={18} className="text-gray-600" />}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string | undefined;
    icon?: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<Icon>
    >;
  }) => (
    <div className="flex items-start gap-3 py-2">
      {Icon && (
        <Icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  const handleCancelAppt = async (text: string) => {
    await cancelAppointment.mutateAsync({
      userId: credentials?.userId as string,
      appointmentId: data?.$id as string,
      data: { reasonForCancellationByAdmin: text, status: "cancelled" },
    });
    close();
  };

  const handleDidPatientSeeDoctor = async (e: boolean) => {
    await patientCheckinForAppointment.mutateAsync({
      userId: credentials?.userId as string,
      appointmentId: data?.$id as string,
      data: { didPatientSeeDoctor: e },
    });
  };

  const handleMarkAsCompleted = async () => {
    await markAsCompletedAppointment.mutateAsync({
      userId: credentials?.userId as string,
      appointmentId: data?.$id as string,
      status: "completed",
    });
  };

  if (isLoading)
    return (
      <div className=" flex justify-center items-center">
        <MedReserveLoader />
      </div>
    );

  const getAppointmentActions = () => {
    const actions = [];
    if (approvedStatus.includes(data?.status as string)) {
      if (
        isTodayBeforeDateTime(
          `${data?.bookingDate} ${data?.startTime}`,
          "minute"
        )
      ) {
        actions.push({
          label: "Reschedule Appointment",
          color: "m-blue",
          icon: IconEdit,
          action: () =>
            router.push(`${pathName.replace("details", "")}reschedule`),
        });
        actions.push({
          label: "Cancel Appointment",
          color: "red",
          icon: IconCancel,
          action: () => open(),
        });
      }

      if (
        data?.didPatientSeeDoctor &&
        isTodayAfterDateTime(`${data?.bookingDate} ${data?.endTime}`, "minute")
      ) {
        actions.push({
          label: "Mark as Completed",
          color: "green",
          icon: IconCheck,
          action: () => openMarkAsCompleted(),
        });
      }
    }
    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomModal opened={showCancelModal} onClose={close}>
        <CancelAppointmentCard
          onSubmit={handleCancelAppt}
          onClose={close}
          label="Cancel Appointment?"
          description="Are you sure you want to cancel this Appointment? This action cannot be undone. The patientId will be notified via email and SMS."
        />
      </CustomModal>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <ActionIcon
              onClick={() => router.back()}
              radius={"xl"}
              variant="outline"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Appointment Details
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 mt-1">
                  Appointment ID: {data?.$id}
                </p>
                <CopyButton text={data?.$id as string} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="m-gray.3"
                radius={"md"}
                variant="outline"
                leftSection={<IconPrinter size={16} />}
                size="sm"
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                color="m-gray.3"
                radius={"md"}
                variant="outline"
                leftSection={<IconDownload size={16} />}
                size="sm"
                onClick={async () =>
                  await generatePdf("pdf", "Appointment_Details")
                }
              >
                Export
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between">
            <Badge
              color={status.color}
              variant={status.variant}
              leftSection={<StatusIcon size={16} />}
            >
              {data?.status}
            </Badge>
            <div className="flex gap-2 items-center">
              {approvedStatus.includes(data?.status as string) &&
                isTodaySameWithOrAfterDateTime(
                  data?.bookingDate as string,
                  "day"
                ) && (
                  <MedReserveSwitch
                    didPatientSeeDoctor={data?.didPatientSeeDoctor as boolean}
                    label="Did Patient Checkin?"
                    handleChacked={handleDidPatientSeeDoctor}
                    disabled={isTodayAfterDateTime(
                      data?.bookingDate as string,
                      "day"
                    )}
                  />
                )}

              <CDropdown
                props={{ width: "200px", position: "bottom-end" }}
                trigger={
                  <MedReserveButton size="md" radius="xl">
                    Actions
                  </MedReserveButton>
                }
              >
                <MenuDropdown>
                  {getAppointmentActions().map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <MenuItem
                        key={index}
                        color={item.color}
                        leftSection={<Icon size={12} />}
                        onClick={item.action}
                      >
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </MenuDropdown>
              </CDropdown>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={tabsHeaders[0].id}>
        <Tabs.List className="mb-6">
          {tabsHeaders.map(({ id, icon: Icon, label }) => (
            <Tabs.Tab key={id} value={id} leftSection={<Icon size={12} />}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value={tabsHeaders[0].id}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Appointment Details */}
              <InfoCard title="Appointment Details" icon={IconCalendar}>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Date"
                    value={data?.bookingDate as string}
                    icon={IconCalendar}
                  />
                  <InfoRow
                    label="Time"
                    value={`${getAMPM(data?.startTime as string)} -
                                    ${getAMPM(data?.endTime as string)}`}
                    icon={IconClock}
                  />
                  <InfoRow
                    label="Duration"
                    value={durationOfVisit}
                    icon={IconClock24}
                  />
                  <InfoRow
                    label="Type"
                    value={data?.appointmentType}
                    icon={IconFileText}
                  />
                  <InfoRow
                    label="Location"
                    value={getAppointmentLocation(
                      data?.doctorId.specialization as string
                    )}
                    icon={IconMapPin}
                  />
                </div>
              </InfoCard>

              {/* Doctor Information */}
              <InfoCard title="Doctor Information" icon={IconStethoscope}>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    size={"lg"}
                    src={data?.doctorId.profilePicture}
                    alt={data?.doctorId.fullname}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {data?.doctorId.fullname}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {data?.doctorId.specialization}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Email"
                    value={data?.doctorId.email}
                    icon={IconMail}
                  />
                  <InfoRow
                    label="Phone"
                    value={data?.doctorId.phone}
                    icon={IconPhone}
                  />
                </div>
              </InfoCard>

              {/* Reason & Notes */}
              <InfoCard title="Reason for Visit" icon={IconClipboard}>
                <p className="text-sm text-gray-700 mb-4">{data?.reason}</p>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Medical Notes
                  </h4>
                  <p className="text-sm text-gray-700">{data?.notes}</p>
                </div>
              </InfoCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Patient Summary */}
              <InfoCard title="Patient Summary" icon={IconUser}>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar
                    size={"lg"}
                    src={data?.patientId.profilePicture}
                    alt={data?.patientId.fullname}
                  />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {data?.patientId.fullname}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {data?.patientId.userId}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <InfoRow
                    label="Age"
                    value={getTimeFromNow(
                      data?.patientId.birthDate as string,
                      true
                    )}
                  />
                  <InfoRow
                    label="Gender"
                    value={data?.patientId.gender as string}
                  />
                  <InfoRow
                    label="Blood Type"
                    value={data?.patientId.bloodGroup as string}
                  />
                </div>
                <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                  View Full Profile
                </button>
              </InfoCard>

              {/* Quick Actions */}
              <InfoCard title="Quick Actions" icon={IconSend}>
                <div className="space-y-2">
                  <Button
                    component="a"
                    href={`mailto:${data?.patientId.email}`}
                    leftSection={<IconMail size={16} />}
                    color="m-gray.4"
                    fullWidth
                    variant="outline"
                    radius="md"
                  >
                    Send Email to Patient
                  </Button>
                  <Button
                    component="a"
                    href={`tel:${data?.patientId.phone}`}
                    leftSection={<IconPhone size={16} />}
                    color="m-gray.4"
                    fullWidth
                    variant="outline"
                    radius="md"
                  >
                    Call Patient
                  </Button>
                  <Button
                    leftSection={<IconSend size={16} />}
                    color="m-gray.4"
                    fullWidth
                    variant="outline"
                    radius="md"
                  >
                    Send Reminder
                  </Button>
                </div>
              </InfoCard>

              {/* Appointment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <IconAlertCircle
                    size={20}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Appointment Created
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {data?.$createdAt}
                    </p>
                    <p className="text-xs text-gray-600">
                      By: {data?.patientId.fullname}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value={tabsHeaders[1].id}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard title="Personal Information" icon={IconUser}>
              <div className="space-y-3">
                <InfoRow label="Full Name" value={data?.patientId.fullname} />
                <InfoRow label="Patient ID" value={data?.patientId.userId} />
                <InfoRow
                  label="Age"
                  value={getTimeFromNow(
                    data?.patientId.birthDate as string,
                    true
                  )}
                />
                <InfoRow label="Gender" value={data?.patientId.gender} />
                <InfoRow
                  label="Blood Type"
                  value={data?.patientId.bloodGroup}
                />
              </div>
            </InfoCard>

            <InfoCard title="Contact Information" icon={IconPhone}>
              <div className="space-y-3">
                <InfoRow
                  label="Email"
                  value={data?.patientId.email}
                  icon={IconMail}
                />
                <InfoRow
                  label="Phone"
                  value={data?.patientId.phone}
                  icon={IconPhone}
                />
                <InfoRow
                  label="Address"
                  value={data?.patientId.address}
                  icon={IconMapPin}
                />
              </div>
            </InfoCard>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value={tabsHeaders[2].id}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data &&
              data.paymentId.map((payment, index) => (
                <InfoCard
                  title="Billing Summary"
                  icon={IconCurrencyDollar}
                  key={index}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">
                        Consultation Fee
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(Number(payment.amount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        Insurance Covered
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        -{formatCurrency(Number())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        Patient Pays
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(Number(payment.amount))}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <Badge
                        color={payment?.status == "success" ? "green" : "red"}
                        leftSection={
                          payment?.status == "success" ? (
                            <IconCheck size={16} />
                          ) : (
                            <IconX size={16} />
                          )
                        }
                      >
                        {payment?.status == "success" ? "Paid" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                </InfoCard>
              ))}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value={tabsHeaders[3].id}>
          <InfoCard title="Appointment Timeline" icon={IconHistory}>
            <div className="space-y-4">
              {data &&
                data.history.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      {index < data.history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm font-medium text-gray-900">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.$createdAt}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        By: {item.userId.name}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </InfoCard>
        </Tabs.Panel>
      </Tabs>

      {/* modals */}
      <ConfirmationModal
        btnText="Confirm"
        close={closeMarkAsCompleted}
        modalContent=" Do you want to mark this Appointment as Completed"
        modalHeader="Mark as Completed"
        opened={openedMarkAsCompletedModal}
        fn={handleMarkAsCompleted}
        loading={markAsCompletedAppointment.isPending}
      />
    </div>
  );
};

export default AppoinmentDetailPage;
