
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Payment } from "../../types/appwrite";
import { AppointmentStatus, AppointmentType, PaymentDataType } from "./actions.types";
import { Icon, IconProps } from "@tabler/icons-react";

export type AppointmentColumnsType = {
  id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  appointmentStatus: AppointmentStatus;
  doctorName: string;
  doctorExperience: number;
  didPatientSeeDoctor: boolean;
  profilePicture: string;
  specialization: string;
  rating: string[];
  bio: string;
  patientUserId: string;
  doctorUserId: string;
  paymentId: Payment[];
  cancelRefund: { [key: string]: unknown };
  doctorAvailability: string[];
  weekdayEndTime: string;
  weekdayStartTime: string;
  weekendEndTime: string;
  weekendStartTime: string;
  createdAt?: string;
  reason?: string;
  notes?: string;
  patientPhone?: string;
  patientFullname?: string;
  patientAddress?: string;
  patientEmail?: string;
  capacity?: string;
  appointmentType?: AppointmentType;
};

export type PaymentColumnsType = {
  id: string;
  reference: string;
  amount: number;
  type: PaymentDataType;
  status: string;
  createdAt: string;
  patientUserId: string;
  doctorUserId: string;
  metaData: string;
  appointmentId: string;
  specialization: string;
  doctorName: string;
};

interface ColumnFilter {
  id: string;
  value: unknown;
}
export type ColumnFiltersState = ColumnFilter[];

export type NavList = {
  label: string;
  href: string;
  child: boolean;
  leftIcon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  sub?: { label: string; href: string }[];
  allowedSubRoles?: string[];
};
