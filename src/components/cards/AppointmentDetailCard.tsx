"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconFileText,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconEdit,
  IconTrash,
  IconSend,
  IconProps,
  Icon,
  IconLink,
} from "@tabler/icons-react";
import {
  getAllAppointmentsActionWithinYearAndMonthResponse,
  updateAppointmentAdminParams,
} from "@/types";
import { Avatar, Badge, Button, ScrollArea, Switch, Tabs } from "@mantine/core";
import { appointmentStatusData, RolesColor, statusConfig } from "@/constants";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import CustomInput from "../molecules/inputs/CustomInput";
import { AppointmentStatus } from "@/types/actions.types";
import { parseResponse } from "@/utils/utilsFn";
import Link from "next/link";
import { useMedStore } from "@/providers/med-provider";
import useHandleAppointmentsByAdmin from "@/hooks/admin/useHandleAppointmentsByAdmin";
import MedReserveLoader from "../loaders/MedReserveLoader";
import dayjs from "dayjs";
import useGetAppointmentDocumentsHistory from "@/hooks/admin/useGetDocumentHistory";

type Props = {
  data: getAllAppointmentsActionWithinYearAndMonthResponse | null;
  onClose: () => void;
};

export default function AppointmentDetailCard({ data, onClose }: Props) {
  const [formData, setFormData] = useState<updateAppointmentAdminParams>({
    didPatientSeeDoctor: data?.didPatientSeeDoctor,
    notes: data?.notes,
    status: data?.status as AppointmentStatus,
  });

  const { credentials } = useMedStore((state) => state);

  const hasChanges = useCallback(() => {
    return (
      formData.didPatientSeeDoctor !== data?.didPatientSeeDoctor ||
      formData.notes !== data?.notes ||
      formData.status !== data?.status
    );
  }, [formData, data]);

  const {
    deleteAppointment: { mutateAsync, isPending },
    updateAppointment: {
      mutateAsync: updateMutateAsync,
      isPending: updateIsPending,
    },
  } = useHandleAppointmentsByAdmin();

  const { data: historyData, isLoading } = useGetAppointmentDocumentsHistory(
    data?.id as string
  );

  const handleDeleteAppointment = async () => {
    const response = await mutateAsync({
      appointmentId: data?.id as string,
      userId: credentials?.userId as string,
    });
    if (response?.code === 200) {
      onClose();
    }
  };

  const handleUpdateAppointment = async () => {
    await updateMutateAsync({
      appointmentId: data?.id as string,
      userId: credentials?.userId as string,
      data: formData,
    });
  };

  const tabHeaders = [
    { label: "details", icon: IconFileText },
    { label: "patient", icon: IconUser },
    { label: "history", icon: IconClock },
  ];

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<Icon>
    >;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-gray-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 capitalize">{label}</p>
        <p className="text-sm font-medium text-gray-900 capitalize">{value}</p>
      </div>
    </div>
  );

  const statusOfAppointment = data && statusConfig[data?.status];
  const IconDay = statusOfAppointment?.icon as React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  >;

  return (
    <section className="">
      <ScrollArea h={600} type="scroll">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full  flex flex-col mb-14">
          {/* Content */}
          <div className="flex-1  px-6 py-4">
            <div className="space-y-4">
              {/* Status and Quick Actions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    leftSection={<IconDay className="w-4 h-4" />}
                    color={statusOfAppointment?.color}
                    variant={statusOfAppointment?.variant}
                  >
                    {data?.status}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      variant="light"
                      color="m-blue"
                      radius={35}
                      leftSection={<IconEdit size={16} />}
                    >
                      Reschedule
                    </Button>
                    <CustomCancelBtn
                      btnText="Delete"
                      modalContent="Are you sure you want to delete this appointment? This action is irreversible"
                      modalHeader="Delete Appointment"
                      loading={isPending}
                      btnProps={{
                        color: "red",
                        radius: 35,
                        variant: "subtle",
                        leftSection: <IconTrash size={16} />,
                      }}
                      fn={handleDeleteAppointment}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    icon={IconCalendar}
                    label="Date"
                    value={data?.bookingDate as string}
                  />
                  <InfoRow
                    icon={IconClock}
                    label="Time"
                    value={`${data?.startTime} - ${data?.endTime}`}
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <Switch
                  checked={formData.didPatientSeeDoctor}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      didPatientSeeDoctor: event.currentTarget.checked,
                    })
                  }
                  color="teal"
                  size="md"
                  label="Patient Attendance"
                  thumbIcon={
                    formData.didPatientSeeDoctor ? (
                      <IconCheck
                        size={12}
                        color="var(--mantine-color-teal-6)"
                        stroke={3}
                      />
                    ) : (
                      <IconX
                        size={12}
                        color="var(--mantine-color-red-6)"
                        stroke={3}
                      />
                    )
                  }
                />
              </div>

              {/* Tabs */}
              <div className=" border-gray-200">
                <Tabs className="space-y-5" defaultValue="details">
                  <Tabs.List>
                    {tabHeaders.map((tab, index) => {
                      const Icon = tab.icon;
                      return (
                        <Tabs.Tab
                          size={50}
                          className="capitalize"
                          value={tab.label}
                          key={index}
                          leftSection={<Icon size={12} />}
                        >
                          {tab.label}
                        </Tabs.Tab>
                      );
                    })}
                  </Tabs.List>

                  <Tabs.Panel value="details">
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Doctor Information
                        </p>
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="md"
                            radius="xl"
                            src={data?.doctorProfilePicture}
                            name={data?.doctorName}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Dr. {data?.doctorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {parseResponse(
                                data?.doctorSpecialization as string
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          Appointment Details
                        </p>
                        <div className="space-y-3">
                          <InfoRow
                            icon={IconFileText}
                            label="Type"
                            value={data?.appointmentType as string}
                          />
                          <InfoRow
                            icon={IconMapPin}
                            label="Location"
                            value={`${parseResponse(data?.doctorSpecialization as string)} Room`}
                          />
                          <InfoRow
                            icon={IconAlertCircle}
                            label="Reason"
                            value={data?.reason as string}
                          />
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <CustomInput
                          label="Additional Notes"
                          placeholder="Enter notes"
                          value={formData.notes}
                          type="textarea"
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setFormData({
                              ...formData,
                              notes: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value="patient">
                    {" "}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar
                          src={data?.patientProfilePicture}
                          name={data?.patientFullname as string}
                          size="xl"
                        />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {data?.patientFullname}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded">
                            Patient ID: {data?.patientId}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <InfoRow
                          icon={IconMail}
                          label="Email"
                          value={data?.patientEmail as string}
                        />
                        <InfoRow
                          icon={IconPhone}
                          label="Phone"
                          value={data?.patientPhone as string}
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Quick Actions
                        </p>
                        <div className="flex gap-2">
                          <Button
                            color="m-blue"
                            leftSection={<IconSend size={14} />}
                            href={`mailto:${data?.patientEmail}`}
                            component="a"
                          >
                            Send Email
                          </Button>
                          <Button
                            color="green"
                            component="a"
                            variant="light"
                            href={`tel:${data?.patientPhone}`}
                            leftSection={<IconPhone size={14} />}
                          >
                            Call Patient
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value="history">
                    <div className="space-y-3">
                      {isLoading && (
                        <div className="flex items-center justify-center">
                          <MedReserveLoader />
                        </div>
                      )}
                      {historyData &&
                        historyData?.map((historyItem, index) => {
                          return (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 capitalize">
                                    {historyItem?.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {dayjs(historyItem?.$createdAt).format(
                                      "MMM DD, YYYY h:mm A"
                                    )}
                                  </p>
                                </div>
                                {/* September 28, 2025 10:30 AM */}
                                <Badge
                                  size="sm"
                                  color={RolesColor[historyItem?.userId.role]}
                                >
                                  {historyItem?.userId.name}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Tabs.Panel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-300 bg-white fixed bottom-0 left-0 w-full z-[99999] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <CustomInput
              type="select"
              placeholder="Update Status"
              value={formData.status}
              data={appointmentStatusData}
              radius={35}
              onChange={(e) =>
                setFormData({ ...formData, status: e as AppointmentStatus })
              }
            />
            <Button
              leftSection={<IconLink size={14} />}
              variant="light"
              component={Link}
              href={`/admin/${credentials?.userId}/dashboard/appointments/${data?.id}/details`}
            >
              View More
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              disabled={!hasChanges()}
              leftSection={<IconCheck size={16} />}
              loading={updateIsPending}
              onClick={handleUpdateAppointment}
              radius={35}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </footer>
    </section>
  );
}
