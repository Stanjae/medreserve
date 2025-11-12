import {
  CreateBookingSchema,
  PaymentFormSchema,
  RefundSchema,
  UpdateBookingSchema,
} from "@/lib/schema/zod";
import { z } from "zod";
import { AppointmentColumnsType, PaymentColumnsType } from "./table.types";
import { Payment } from "../../types/appwrite";

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

export type Gender = "Male" | "Female" | "Other";

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

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "cancelled"
  | "refunded"
  | "completed"
  | "rescheduled";

  export type RefundStatus =
    | "pending"
    | "under_review"
    | "approved"
    | "processing_refund"
    | "completed"
  | "rejected";
    
  export type StatusHistoryItem =  {
    status: RefundStatus;
    timestamp: string;
    note?: string;
    updatedBy: string; // userId of admin or 'system'
  }
export type AppointmentType = "consultation" | "follow-up" | "emergency";
export type PaymentDataType = "initial-fees" | "reschedule-fees";

export type CreateAppointMentParams = {
  doctorId: string;
  patientId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: AppointmentStatus;
};

export type CreateAppointmentParams2 = z.infer<typeof CreateBookingSchema>;

export type PaymentFormParams = z.infer<typeof PaymentFormSchema>;

export type RescheduleAppointmentParams = z.infer<typeof UpdateBookingSchema>;

export type RefundAppointmentParams = z.infer<typeof RefundSchema>;

export type getUserAppointmentsResponse = {
  project: AppointmentColumnsType[];
  total: number;
};

export type getUserPaymentsResponse = {
  project: PaymentColumnsType[];
  total: number;
};

export type getDashboardBarchartAnalyticsType = {
  month: string;
  followUp: number;
  consultation: number;
  emergency: number;
};

export type cancelAppointmentResponse = {
  doctorSpecialization: string;
  doctorName: string;
  doctorProfilePicture: string;
  patientFullname: string;
  appointmentType: string;
  appointmentStatus: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  paymentId: Payment[];
  doctorId: string;
  patientId: string;
  slotId: string;
  refundStatus: RefundStatus;
};

export type GetDoctorsMasonryResponse = {
  id: string;
  fullname: string;
  profilePicture: string;
  specialization: string;
  bio: string;
};

export type ReviewParams = {
  doctorId?: string | undefined;
  rating: number;
  reviewText: string;
  type: "doctor" | "appointment";
  patientId: string | null | undefined;
  appointmentId?: string | undefined;
  anonymous?: boolean;
  _id?: string | null | undefined;
};

export type DoctorReviewsResponse = {
  _id: string;
  rating: number;
  reviewText: string;
  type: ReviewParams["type"];
  anonymous: boolean;
  patientPicture: string;
  patientName: string;
  patientOccupation: string;
};

export type SignupTabsType =
  | "pending-doctors"
  | "verified-doctors"
  | "patient"
  | "suspended";

export type AssignUsersToNewRoleParams = {
  userId: string;
  prefs: { [key: string]: string | undefined | null };
};

export type EditAccountSubSectionType = {
  status: "suspended" | "active";
  email: string;
  phone: string;
  username: string;
  prefs?:
    | {
        subRoleId?: string | undefined;
        subRole?: string | undefined;
      }
    | undefined;
};

export type Cadre = "housemanship" | "consultancy" | "residency";
export type BloodGroupType =
  | "a-positive"
  | "a-negative"
  | "b-positive"
  | "b-negative"
  | "ab-positive"
  | "ab-negative"
  | "o-positive"
  | "o-negative";
export type GenotypeType = "AA" | "AS" | "SS";

export type EditUserParams = {
  accountId: string | undefined;
  profileId: string | undefined;
  scheduleId?: string | null;
  role: string;
};

export type EditUserModified = {
  account: {
    email: string;
    username: string;
    phone: string;
    status: "suspended" | "active";
    password?: string;
    prefs?: {
      subRoleId?: string;
      subRole?: string;
    };
    // Additional fields that might be returned from database
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
  };
  profile: {
    userId: string;
    fullname: string;
    birthDate: string;
    gender: Gender;
    address: string;
    privacyConsent: boolean;
    profilePicture: string;
    identificationType?: string;
    identificationNumber?: string;
    // Role-specific fields will be added based on role
    // Patient-specific
    occupation?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    bloodGroup?: string;
    genotype?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    allergies?: string;
    currentMedication?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    identificationDocument?: string;
    // Doctor-specific
    bio?: string;
    stateOfOrigin?: string;
    lga?: string;
    zipcode?: string;
    grade?: string;
    university?: string;
    courseOfStudy?: string;
    degree?: string;
    yearOfGraduation?: string;
    courseDuration?: number;
    cadre?: "consultancy" | "residency" | "housemanship";
    experience?: number;
    specialization?: string;
    medId?: string;
    weekdayStartTime?: string;
    weekdayEndTime?: string;
    weekendStartTime?: string;
    weekendEndTime?: string;
    workSchedule?: string[];
    // Admin-specific
    jobSpecification?: string;
    // Additional database fields
    $id?: string;
    $permissions?: string[];
    phone?: string;
    reviewsId?: string;
    rating?: number;
  };
};
