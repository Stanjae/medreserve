import { Models } from 'node-appwrite';

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
}

export type Appointment = Models.Document & {
}

export type Payment = Models.Document & {
}

export type DoctorAvailability = Models.Document & {
  doctorId: Doctor[] | null;
  workSchedule: string[] | null;
  weekendStartTime: string | null;
  weekendEndTime: string | null;
  weekdayStartTime: string;
  weekdayEndTime: string;
}

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
}
