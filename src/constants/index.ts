import {
  IconClock,
  IconCheck,
  IconX,
  IconCurrencyDollar,
  IconCircleCheck,
  IconCalendarEvent,
} from "@tabler/icons-react";

export const IdentificationTypes = [
  "Driver's License",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Student ID Card",
  "Voter ID Card",
];

// Array of common genotypes related to hemoglobin variants
export const genotypes = ["AA", "AS", "SS"];

// Array of common blood groups with values and labels for UI use
export const bloodGroups = [
  { value: "a-positive", label: "A+" },
  { value: "a-negative", label: "A-" },
  { value: "b-positive", label: "B+" },
  { value: "b-negative", label: "B-" },
  { value: "ab-positive", label: "AB+" },
  { value: "ab-negative", label: "AB-" },
  { value: "o-positive", label: "O+" },
  { value: "o-negative", label: "O-" },
];

export const genderData = ["Male", "Female", "Other"];

export const userRoles = ["patient", "doctor", "admin"];
export const adminSubRoles = ["hospital_admin", "super_admin", "sub_admin"];

export const cadresData = ["consultancy", "residency", "housemanship"];

export const doctorCategories = [
  {
    group: "Primary Care Physicians",
    items: [
      { value: "family-medicine", label: "Family Medicine Physician" },
      { value: "internal-medicine", label: "Internal Medicine Physician" },
      { value: "pediatrician", label: "Pediatrician" },
    ],
  },
  {
    group: "Specialty Care Physicians",
    items: [
      { value: "cardiologist", label: "Cardiologist" },
      { value: "dermatologist", label: "Dermatologist" },
      { value: "endocrinologist", label: "Endocrinologist" },
      { value: "gastroenterologist", label: "Gastroenterologist" },
      { value: "infectious-disease", label: "Infectious Disease Doctor" },
      { value: "neurologist", label: "Neurologist" },
      { value: "obgyn", label: "Obstetrician/Gynecologist (OB/GYN)" },
      { value: "ophthalmologist", label: "Ophthalmologist" },
      { value: "orthopedic-surgeon", label: "Orthopedic Surgeon" },
      { value: "psychiatrist", label: "Psychiatrist" },
      { value: "pulmonologist", label: "Pulmonologist" },
      { value: "radiologist", label: "Radiologist" },
      { value: "rheumatologist", label: "Rheumatologist" },
      { value: "urologist", label: "Urologist" },
    ],
  },
  {
    group: "Surgical Specialties",
    items: [
      { value: "general-surgeon", label: "General Surgeon" },
      { value: "plastic-surgeon", label: "Plastic Surgeon" },
      { value: "ent", label: "Otolaryngologist (ENT)" },
    ],
  },
  {
    group: "Other Specialties",
    items: [
      { value: "emergency-medicine", label: "Emergency Medicine Specialist" },
      { value: "geriatric-medicine", label: "Geriatric Medicine Specialist" },
      { value: "physiatrist", label: "Physiatrist" },
      { value: "pathologist", label: "Pathologist" },
      { value: "preventive-medicine", label: "Preventive Medicine Specialist" },
    ],
  },
];

export const appointmentTypeData = [
  { label: "Consultation", value: "consultation" },
  { label: "Follow up", value: "follow-up" },
  { label: "Emergency", value: "emergency" },
];

export const signUpFilterType = [
  { label: "Unverified", value: "unverified" },
  { label: "Verified", value: "verified" },
];

export const medicalCourses = [
  {
    label: "Medicine and Surgery (MBBS/MBChB)",
    value: "Medicine and Surgery (MBBS/MBChB)",
    degree_awarded: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    description:
      "Study of the human body, diagnosis, treatment, and prevention of diseases. Includes clinical rotations in various specialties.",
  },
  {
    label: "Dentistry",
    value: "Dentistry",
    degree_awarded: "BDS (Bachelor of Dental Surgery)",
    description:
      "Diagnosis, treatment, and prevention of diseases affecting the teeth, gums, and mouth.",
  },
  {
    label: "Pharmacy",
    value: "Pharmacy",
    degree_awarded:
      "B.Pharm (Bachelor of Pharmacy) or PharmD (Doctor of Pharmacy)",
    description:
      "Study of drugs, their preparation, dispensing, and proper utilization for therapeutic purposes.",
  },
  {
    label: "Medical Laboratory Science",
    value: "Medical Laboratory Science",
    degree_awarded: "BMLS (Bachelor of Medical Laboratory Science)",
    description:
      "Conducting laboratory tests to diagnose and monitor diseases, involving analysis of body fluids and tissues.",
  },
  {
    label: "Physiotherapy",
    value: "Physiotherapy",
    degree_awarded: "BPT (Bachelor of Physiotherapy)",
    description:
      "Physical therapy focused on rehabilitation, pain management, and improvement of physical function.",
  },
  {
    label: "Radiography and Radiation Science",
    value: "Radiography and Radiation Science",
    degree_awarded: "B.Rad (Bachelor of Radiography)",
    description:
      "Use of imaging techniques such as X-rays and MRI for diagnosis and treatment of diseases.",
  },
  {
    label: "Optometry",
    value: "Optometry",
    description: "Examination, diagnosis, and treatment of eye disorders.",
    degree_awarded: "OD (Doctor of Optometry)",
  },
];

export const schoolGrades = [
  "4.5 - 5.0",
  "3.5 - 4.49",
  "2.5 - 3.49",
  "1.5 - 2.49",
  "0.5 - 1.49",
];

export const workSchedule = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "0" },
];

export const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const initialPaymentForm = {
  amount: 0,
  email: "",
  fullname: "",
  phone: "",
  capacity: "1",
  address: "",
  patientId: "",
  doctorId: "",
  slotId: "",
};

export const newPrices = [
  {
    value: "family-medicine",
    label: "Family Medicine Physician",
    price: 30000,
  },
  {
    value: "internal-medicine",
    label: "Internal Medicine Physician",
    price: 50000,
  },
  { value: "pediatrician", label: "Pediatrician", price: 20000 },
  { value: "cardiologist", label: "Cardiologist", price: 100000 },
  { value: "dermatologist", label: "Dermatologist", price: 30000 },
  { value: "endocrinologist", label: "Endocrinologist", price: 90000 },
  { value: "gastroenterologist", label: "Gastroenterologist", price: 145000 },
  {
    value: "infectious-disease",
    label: "Infectious Disease Doctor",
    price: 78000,
  },
  { value: "neurologist", label: "Neurologist", price: 50000 },
  { value: "obgyn", label: "Obstetrician/Gynecologist (OB/GYN)", price: 65000 },
  { value: "ophthalmologist", label: "Ophthalmologist", price: 90000 },
  { value: "orthopedic-surgeon", label: "Orthopedic Surgeon", price: 150000 },
  { value: "psychiatrist", label: "Psychiatrist", price: 100000 },
  { value: "pulmonologist", label: "Pulmonologist", price: 45000 },
  { value: "radiologist", label: "Radiologist", price: 75000 },
  { value: "rheumatologist", label: "Rheumatologist", price: 45000 },
  { value: "urologist", label: "Urologist", price: 87000 },
  { value: "general-surgeon", label: "General Surgeon", price: 71000 },
  { value: "plastic-surgeon", label: "Plastic Surgeon", price: 195000 },
  { value: "ent", label: "Otolaryngologist (ENT)", price: 125000 },
  {
    value: "emergency-medicine",
    label: "Emergency Medicine Specialist",
    price: 123000,
  },
  {
    value: "geriatric-medicine",
    label: "Geriatric Medicine Specialist",
    price: 80000,
  },
  { value: "physiatrist", label: "Physiatrist", price: 30000 },
  { value: "pathologist", label: "Pathologist", price: 70000 },
  {
    value: "preventive-medicine",
    label: "Preventive Medicine Specialist",
    price: 175000,
  },
];

export const paymentStatusFilter = [
  { label: "Failed", value: "failed" },
  { label: "Success", value: "success" },
];

export const appointmentTabsData = [
  { label: "Upcoming", value: "upcoming", status: "unread" },
  { label: "Today", value: "today", status: "unread" },
  { label: "Past", value: "past", status: "unread" },
  { label: "Cancelled", value: "cancelled", status: "unread" },
  { label: "Refunded", value: "refunded", status: "unread" },
];

export const newSignupsTabData = [
  { label: "Pending Verification", value: "pending-doctors", status: "unread" },
  { label: "Verified Doctors", value: "verified-doctors", status: "read" },
  { label: "Patients", value: "patient", status: "read" },
  { label: "Suspended", value: "suspended", status: "unread" },
];

export const newUsersTabData = [
  { label: "Doctors", value: "doctor", status: "read" },
  { label: "Patients", value: "patient", status: "read" },
  { label: "Staffs", value: "admin", status: "read" },
];

export const dashboardMetricsCardInfo = [
  { label: "Upcoming Appointment(s)", value: "upcoming" },
  { label: "Total Appointment(s)", value: "total" },
  { label: "Doctors Visited", value: "visited" },
  { label: "Health Score", value: "healthscore" },
];

export const barChartData = [
  { label: "Jan - Jun", value: "first-half" },
  { label: "Jul - Dec", value: "second-half" },
];

export const appointmentStatusData = [
  "pending",
  "approved",
  "cancelled",
  "refunded",
  "completed",
  "rescheduled",
];

export const RolesColor = {
  patient: " cyan",
  admin: "violet",
  doctor: " blue",
};

export const cancel_refundStatusFilter = ["cancelled", "refunded"];
export const usersStatusFilter = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

// Status configuration with colors and icons
export const statusConfig = {
  pending: {
    color: "gray",
    variant: "light",
    icon: IconClock,
    label: "Pending",
  },
  approved: {
    color: "teal",
    variant: "light",
    icon: IconCheck,
    label: "Approved",
  },
  cancelled: {
    color: "red",
    variant: "light",
    icon: IconX,
    label: "Cancelled",
  },
  refunded: {
    color: "violet",
    variant: "outline",
    icon: IconCurrencyDollar,
    label: "Refunded",
  },
  completed: {
    color: "green",
    variant: "filled",
    icon: IconCircleCheck,
    label: "Completed",
  },
  rescheduled: {
    color: "blue",
    variant: "light",
    icon: IconCalendarEvent,
    label: "Rescheduled",
  },
  /* processing: {
    color: "orange", // Changed from yellow for better distinction
    variant: "light",
    icon: IconLoader, 
    label: "Processing",
  }, */
} as const;

export const CANCELLATION_REASONS = [
  { value: "emergency", label: "Personal emergency" },
  { value: "illness", label: "Patient illness" },
  { value: "schedule", label: "Schedule conflict" },
  { value: "other", label: "Other" },
];

export const cancellationRate = 15; //15%
export const refundRate = 15; //10%
export const adminFee = 5;

export const refundType = ["refund", "cancellation"];
export const refundStatus = ["approved", "failed", "pending"];

export const refundTextStatusInfo = [
  {
    title: "Processing Cancellation",
    subtitle: "Please wait while we process your request...",
    status: "initialized",
  },
  {
    title: "Processing Refund",
    subtitle: "Initiating refund to your original payment method...",
    status: "pending",
  },
  {
    title: "Refund Completed",
    subtitle: "Your refund has been processed successfully",
    status: "success",
  },
];

export const refundTextStatusInfo2 = [
  {
    title: "Processing Refund",
    subtitle: "Initiating refund to your original payment method...",
    status: "pending",
  },
  {
    title: "Refund Completed",
    subtitle: "Your refund has been processed successfully",
    status: "success",
  },
];

export const refundReasons = [
  { value: "medical_emergency", label: "Medical Emergency" },
  { value: "family_emergency", label: "Family Emergency" },
  { value: "transportation", label: "Transportation Issues" },
  { value: "hospitalization", label: "Hospitalization" },
  { value: "other", label: "Other (requires approval)" },
];

export const pageHeadersObject = {
  "our-doctors": "Doctor's details",
};

export const userAccountStatus = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];  
