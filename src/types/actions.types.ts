import {
  CreateBookingSchema,
  PaymentFormSchema,
  UpdateBookingSchema,
} from "@/lib/schema/zod";
import { z } from "zod";
import { AppointmentColumnsType, PaymentColumnsType } from "./table.types";

export type ClientRegistrationParams = {
  username: string;
  email: string;
  password: string;
  terms_and_conditions: boolean;
  medId?: string | null | undefined;
};

export type PatientLoginParams = {
  email: string;
  password: string;
};

type Gender = "Male" | "Female" | "Other";

export type CreatePatientProfileParams = {
  email: string;
  phone: string;
  fullname: string;
  userId?: string;
  birthDate: Date | string;
  gender?: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  bloodGroup: string;
  genotype: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | string | undefined;
  profilePicture: FormData | string | undefined;
  privacyConsent: boolean;
};

export type CreateDoctorProfileParams = {
  fullname: string;
  address: string;
  bio: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: Date | string;
  zipcode: string;
  medId: string;
  userId?: string;
  grade: string;
  courseOfStudy: string;
  university: string;
  yearOfGraduation: string;
  degree: string;
  courseDuration: number;
  stateOfOrigin: string;
  lga: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument: FormData | string | undefined;
  profilePicture: string;
  privacyConsent: boolean;
  cadre: string;
  experience: number;
  specialization: string;
  weekdayStartTime: string;
  weekdayEndTime: string;
  weekendStartTime: string | undefined;
  weekendEndTime: string | undefined;
  workSchedule?: string[];
};

export type CreateAppointMentParams = {
  doctorId: string;
  patientId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: "pending" | "approved" | "declined";
};

export type CreateAppointmentParams2 = z.infer<typeof CreateBookingSchema>;

export type PaymentFormParams = z.infer<typeof PaymentFormSchema>;

export type RescheduleAppointmentParams = z.infer<typeof UpdateBookingSchema>;

export type getUserAppointmentsResponse = {
  project: AppointmentColumnsType[];
  total: number;
};

export type getUserPaymentsResponse = {
  project: PaymentColumnsType[];
  total: number;
};