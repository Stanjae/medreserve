import { Payment } from "../../types/appwrite";

export type AppointmentColumnsType = {
  id: string;
  bookingDate: string;
  timeFrameTimeZone: string;
  startTime: string;
  endTime: string;
  timeFrameStatus: "upcoming" | "past" | "today";
  paymentStatus: "pending" | "approved" | "declined";
  doctorName: string;
  profilePicture: string;
  specialization: string;
  rating: string[];
  bio: string;
  patientUserId: string;
  doctorUserId: string;
  slotId: string;
  paymentId: Payment;
  doctorAvailability: string[];
  weekdayEndTime: string;
  weekdayStartTime: string;
  weekendEndTime: string;
  weekendStartTime: string;
};

interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFiltersState = ColumnFilter[];