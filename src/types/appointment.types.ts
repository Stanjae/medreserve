import { AppointmentStatus } from "./actions.types";

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
}
