import { isbBeforeDateTime } from "@/utils/utilsFn";
import { z } from "zod";

export const PatientStepFormValidation = [
  z.object({
    fullname: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    birthDate: z.coerce.date(),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),
    occupation: z
      .string()
      .min(2, "Occupation must be at least 2 characters")
      .max(500, "Occupation must be at most 500 characters"),
    emergencyContactName: z
      .string()
      .min(2, "Contact name must be at least 2 characters")
      .max(50, "Contact name must be at most 50 characters"),
    emergencyContactNumber: z
      .string()
      .refine(
        (emergencyContactNumber) =>
          /^\+\d{10,15}$/.test(emergencyContactNumber),
        "Invalid phone number"
      ),
  }),
  z.object({
    bloodGroup: z.enum([
      "a-positive",
      "a-negative",
      "b-positive",
      "b-negative",
      "ab-positive",
      "ab-negative",
      "o-positive",
      "o-negative",
    ]),
    genotype: z.enum(["AA", "AS", "SS"]),
    insuranceProvider: z
      .string()
      .min(2, "Insurance name must be at least 2 characters")
      .max(50, "Insurance name must be at most 50 characters"),
    insurancePolicyNumber: z
      .string()
      .min(2, "Policy number must be at least 2 characters")
      .max(50, "Policy number must be at most 50 characters"),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
  }),
  z.object({
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationDocument: z.custom<File[]>().optional(),
    profilePicture: z.custom<File[]>().optional(),
    privacyConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: "You must consent to privacy in order to proceed",
      }),
  }),
];

export const DoctorStepFormValidation = [
  /* personal info */
  z.object({
    fullname: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    birthDate: z.coerce.date(),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),
    bio: z
      .string()
      .min(2, "Bio must be at least 2 characters")
      .max(50, "Bio must be at most 50 characters"),
    stateOfOrigin: z.string().nonempty("State of origin is required"),
    lga: z.string().nonempty("Lga of origin is required"),
    zipcode: z.string().optional(),
  }),
  /* academic info */
  z.object({
    grade: z.string().optional(),
    university: z.string().nonempty("University is required"),
    courseOfStudy: z.string().nonempty("Course of study is required"),
    degree: z.string().optional(),
    yearOfGraduation: z.string().nonempty("year of graduation is required"),
    courseDuration: z.number().nonnegative("Course duration is required"),
  }),
  /* medical info */
  z.object({
    cadre: z.enum(["consultancy", "residency", "housemanship"]),
    experience: z.number().nonnegative("Experience is required"),
    specialization: z.string().nonempty("Specialization is required"),
    medId: z.string().optional(),
    weekdayStartTime: z.string().nonempty("Weekday start time is required"),
    weekdayEndTime: z.string().nonempty("Weekday end time is required"),
    weekendStartTime: z.string().optional(),
    weekendEndTime: z.string().optional(),
  }),
  /* identification */
  z.object({
    identificationType: z.string().nonempty("Identification type is required"),
    identificationNumber: z
      .string()
      .nonempty("Identification number is required"),
    identificationDocument: z.custom<File[]>().optional(),
    profilePicture: z.custom<File[]>().optional(),
    privacyConsent: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: "You must consent to privacy in order to proceed",
      }),
  }),
];

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(32, { message: "Password must be at most 32 characters long" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    message: "Password must contain at least one special character",
  })
  .refine((val) => !/\s/.test(val), {
    message: "Password cannot contain spaces",
  });

// Full schema example
export const PatientRegistrationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  terms_and_conditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
});

export const DoctorRegistrationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  terms_and_conditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  medId: z.string(),
  //.regex(/^DRX\d{7}$/, ),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
});

export const PatientLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const ResetPasswordSchema = z.object({
  password: passwordSchema,
});

export const CreateBookingSchema = z
  .object({
    patientId: z.string().nonempty("Patient ID is required"),
    doctorId: z.string().nonempty("Doctor ID is required"),
    bookingDate: z.coerce.string(),
    startTime: z.string(),
    endTime: z.string(),
    notes: z.string().nonempty("Notes is required"),
    status: z.enum(["pending", "approved", "declined"]),
  })
  .refine(
    (data) =>
      false == isbBeforeDateTime(`${data.bookingDate} ${data.startTime}`),
    {
      message: "You cannot book an appointment in the past",
      path: ["startTime"], // Optional: attach error to endDate field
    }
  );

export const UpdateBookingSchema = z
  .object({
    patientId: z.string().nonempty("Patient ID is required"),
    doctorId: z.string().nonempty("Doctor ID is required"),
    doctorName: z.string().optional(),
    paymentId: z.array(z.record(z.any())).optional(),
    bookingDate: z.coerce.string(),
    startTime: z.string(),
    endTime: z.string(),
    notes: z.string().nonempty("Notes is required"),
    slotId: z.string().nonempty("Slot ID is required"),
    address: z.string().nonempty("Address is required"),
    fullname: z.string().nonempty("Full name is required"),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().nonempty("Phone number is required"),
    capacity: z.string().nonempty("Capacity is required"),
    amount: z
      .number()
      .int("Amount must be an integer")
      .positive("Amount must be positive")
      .min(1, "Amount must be at least 1")
      .max(100000, "Amount exceeds maximum allowed"),
  })
  .refine(
    (data) =>
      false == isbBeforeDateTime(`${data.bookingDate} ${data.startTime}`),
    {
      message: "You cannot book an appointment in the past",
      path: ["startTime"], // Optional: attach error to endDate field
    }
  );

export const PaymentFormSchema = z.object({
  amount: z
    .number()
    .int("Amount must be an integer")
    .positive("Amount must be positive")
    .min(1, "Amount must be at least 1")
    .max(1000000, "Amount exceeds maximum allowed"),
  patientId: z.string().nonempty("Patient ID is required"),
  doctorId: z.string().nonempty("Doctor ID is required"),
  slotId: z.string().nonempty("Slot ID is required"),
  address: z.string().nonempty("Address is required"),
  fullname: z.string().nonempty("Full name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().nonempty("Phone number is required"),
  capacity: z.string().nonempty("Capacity is required"),
});
