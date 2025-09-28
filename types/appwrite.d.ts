import { Gender } from "@/types/actions.types";
import { PermissionKeys } from "@/types/store";
import { Models } from "node-appwrite";

export type Doctor = Models.Document & {
  fullname: string;
  grade: string | null;
  university: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  bio: string;
  stateOfOrigin: string;
  lga: string;
  zipcode: string | null;
  courseOfStudy: string;
  degree: string;
  yearOfGraduation: string;
  courseDuration: number;
  cadre: string;
  experience: number;
  specialization: string;
  medId: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument: string | null;
  profilePicture: string | null;
  privacyConsent: boolean;
  doctorAvailability: DoctorAvailability | null;
  userId: string;
  rating: string[];
  reviewsId: Reviews[] | null;
};

export type Patient = Models.Document & {
  fullname: string;
  userId: string;
  address: string;
  email: string;
  birthDate: string;
  gender: string;
  phone: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | null;
  currentMedication: string | null;
  familyMedicalHistory: string | null;
  pastMedicalHistory: string | null;
  identificationType: string | null;
  identificationNumber: string | null;
  identificationDocument: string | null;
  treatmentConsent: boolean | null;
  disclosureConsent: boolean | null;
  privacyConsent: boolean;
  profilePicture: string | null;
  bloodGroup: string | null;
  genotype: string | null;
};

export type Appointment = Models.Document & {};

export type Payment = Models.Document & {};

export type DoctorAvailability = Models.Document & {
  doctorId: Doctor[] | null;
  workSchedule: string[] | null;
  weekendStartTime: string | null;
  weekendEndTime: string | null;
  weekdayStartTime: string;
  weekdayEndTime: string;
};

export type Payment = Models.Document & {
  metaData: string;
  appointment: Appointment[] | null;
  amount: number;
  reference: string;
  status: string;
  patientId: Patient[] | null;
  doctorId: Doctor[] | null;
  authorization: string;
  paidOn: string;
};

export type Reviews = Models.Document & {
  anonymous: boolean;
  appointmentId: Appointment[] | null;
  doctorId: Doctor[] | null;
  patientId: Patient[] | null;
  rating: number;
  reviewText: string;
  type: "doctor" | "appointment";
};

export type AdminProfile = Models.Document & {
  fullname: string;
  userId: string;
  jobSpecification: string;
  email: string;
  phone: string;
  address: string;
  gender:Gender
  birthDate: string;
  privacyConsent: boolean;
  profilePicture: string;
  identificationType: string;
  identificationNumber: string;
};

type MaybeUser =
  | { labels: "patient"; profile: Patient }
  | { labels: "doctor"; profile: Doctor }
  | { labels: "admin"; profile: AdminProfile };
export type ModifiedUser = MaybeUser & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registeredAt: string;
  status: boolean;
  email: string;
  phone: string;
  emailVerification: boolean;
  prefs: {
    terms_and_conditions?: boolean;
    medId?: string;
    databaseId?: string;
    subRoleId?: string;
    subRole?: string;
  };
  accessedAt: string;
};

export type DefaultRoles = {
  priority: number;
  type: PermissionKeys;
  permissions: string;
};

export type ModifiedRoles = Models.Document & DefaultRoles;
