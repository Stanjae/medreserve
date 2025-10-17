"use client";
import { statusConfig } from "@/constants";
import { searchAppointmentsResponse } from "@/types";
import {
  getAppointmentLocation,
  timeStringtoHoursAndMinutes,
} from "@/utils/utilsFn";
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Indicator,
  MenuDropdown,
  MenuItem,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
  IconStethoscope,
  IconUser,
} from "@tabler/icons-react";
import { CDropdown } from "../dropdown/CDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  appointment: searchAppointmentsResponse;
};

const SearchAppointmentCard = ({ appointment }: Props) => {
  const status = statusConfig[appointment.status];
  const StatusIcon = status.icon;

  const pathname = usePathname();

  const absolutePathname = pathname.replace("find-appointments", "");
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.patientId.fullname}
            </h3>

            <Badge
              leftSection={<StatusIcon size={12} />}
              color={status.color}
              variant={status.variant}
            >
              {appointment.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            Appointment ID: {appointment.$id}
          </p>
        </div>

        <div className="relative">
          <CDropdown
            props={{ position: "bottom-end", width: 200, shadow: "md" }}
            trigger={
              <ActionIcon variant="subtle">
                {" "}
                <IconDotsVertical size={20} className="text-gray-600" />
              </ActionIcon>
            }
          >
            <MenuDropdown>
              <MenuItem
                leftSection={<IconEye size={16} />}
                component={Link}
                href={`${absolutePathname}${appointment.$id}/details`}
              >
                View Details
              </MenuItem>
              <MenuItem
                leftSection={<IconEdit size={16} />}
                component={Link}
                href={`${absolutePathname}${appointment.$id}/reschedule`}
              >
                Reschedule
              </MenuItem>
            </MenuDropdown>
          </CDropdown>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Doctor Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <IconStethoscope size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Doctor</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.doctorId.fullname}
              </p>
              <p className="text-xs text-gray-600">
                {appointment.doctorId.specialization}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <IconCalendar size={18} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.bookingDate}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <IconClock size={12} />
                {timeStringtoHoursAndMinutes(
                  appointment.startTime as string
                )} -{" "}
                {timeStringtoHoursAndMinutes(appointment.endTime as string)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <IconMapPin size={18} className="text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">
                {getAppointmentLocation(appointment.doctorId.specialization)}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                {appointment.appointmentType}
              </span>
            </div>
          </div>

          {/* Patient Contact */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <IconUser size={18} className="text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-xs text-gray-900 flex items-center gap-1 truncate">
                <IconPhone size={12} />
                {appointment.patientId.phone}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                <IconMail size={12} />
                {appointment.patientId.email}
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Reason for Visit</p>
          <p className="text-sm text-gray-700">{appointment.reason}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center gap-2">
          <Indicator size={6} color={status.color} />
          <span className="text-xs text-gray-600">
            {appointment.status === "approved" && "Ready for appointment"}
            {appointment.status === "pending" && "Awaiting confirmation"}
            {appointment.status === "completed" && "Visit completed"}
            {appointment.status === "cancelled" && "Appointment cancelled"}
            {appointment.status === "rescheduled" && "Appointment rescheduled"}
          </span>
        </div>
        <Button
          variant="subtle"
          color="m-blue"
          component={Link}
          href={`${absolutePathname}${appointment.$id}/details`}
        >
          View Details →
        </Button>
      </div>
      <Divider color={"m-cyan"} my="sm" size="md" variant="dotted" />
    </div>
  );
};

export default SearchAppointmentCard;
