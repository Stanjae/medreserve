import { CancelRefund, Doctor, Patient, Payment } from "../../types/appwrite";
import { AppointmentStatus } from "./actions.types";
import { ModifiedHistoryResponseForAppointments } from "./history.types";

export type getAllAppointmentsActionWithinYearAndMonthResponse = {
  startTime: string;
  endTime: string;
  bookingDate: string;
  status: AppointmentStatus;
  id: string;
  didPatientSeeDoctor: boolean;
  appointmentType: string;
  doctorName: string;
  doctorProfilePicture: string;
  doctorSpecialization: string;
  notes: string;
  reason: string;
  patientFullname: string;
  patientProfilePicture: string;
  patientId: string;
  patientEmail: string;
  patientPhone: string;
  createdAt: string;
};

export type updateAppointmentAdminParams = {
  bookingDate?: string;
  status: AppointmentStatus;
  notes?: string;
  didPatientSeeDoctor?: boolean;
  startTime?: string;
  endTime?: string;
};

export type searchAppointmentsResponse = updateAppointmentAdminParams & {
  $id: string;
  doctorId: {
    fullname: string;
    profilePicture: string;
    userId: string;
    specialization: string;
  };
  patientId: {
    fullname: string;
    profilePicture: string;
    userId: string;
    phone: string;
    email: string;
  };
  reason: string;
  appointmentType: string;
};

export type searchAppointmentDetailsResponse = updateAppointmentAdminParams & {
  $id: string;
  $createdAt: string;
  doctorId: {
    fullname: string;
    profilePicture: string;
    userId: string;
    specialization: string;
    phone: string;
    email: string;
  };
  patientId: {
    fullname: string;
    profilePicture: string;
    userId: string;
    phone: string;
    email: string;
    gender: string;
    birthDate: string;
    bloodGroup: string;
    address: string;
  };
  reason: string;
  didPatientSeeDoctor: boolean;
  appointmentType: string;
  paymentId: Payment[];
  history: ModifiedHistoryResponseForAppointments[]
};

export type cancellationActionParams = {
  appointmentId: string;
  userId: string;
  data:cancellationActionData
};

export type cancellationActionData = {
  reasonForCancellationByAdmin: string;
  status: AppointmentStatus
};

export type TpatientCheckinActionData = {
 didPatientSeeDoctor: boolean;
};

/* ================================patient============================================= */
export type TuseFetchAppointmentForReschedule = {
  startTime: string;
  endTime: string;
  bookingDate: string;
  status: AppointmentStatus;
  $id: string;
  doctorId: Doctor;
  patientId: Patient;
  reason: string;
  reasonForReschedule: string;
  paymentId: Payment[];
  capacity: number;
  cancelRefund: CancelRefund;
};