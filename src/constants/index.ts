import {
  IconClock,
  IconCheck,
  IconX,
  IconCurrencyDollar,
  IconCircleCheck,
  IconCalendarEvent,
  IconLoader,
  IconFileText,
  IconCircleX,
} from "@tabler/icons-react";

export const pageHeadersLibrary = {
  "our-doctors": "Doctor's details",
  "cancel-appointment": "Cancel Appointment",
  "reschedule": "Reschedule Appointment",
  "dashboard":"Dashboard"
};

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

export const capacityData = [
  { label: "1 Person", value: "1" },
  { label: "2 Persons", value: "2" },
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

export const rescheduleRate = 0.5;

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
  "rescheduled",
  "cancelled",
  "refunded",
  "completed",
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
  under_review: {
    color: "yellow",
    variant: "light",
    icon: IconLoader,
    label: "Under Review",
  },
  processing_refund: {
    color: "purple",
    variant: "light",
    icon: IconLoader,
    label: "Processing Refund",
  },
  rejected: {
    color: "red.7",
    variant:'filled',
    icon: IconX,
    label: "Rejected",
  },
} as const;

export const CANCELLATION_REASONS = [
  { value: "Personal emergency", label: "Personal emergency" },
  { value: "illness", label: "Patient illness" },
  { label: "Change in schedule", value: "Change in schedule" },
  { label: "Found another doctor", value: "Found another doctor" },
  { label: "Financial reasons", value: "Financial reasons" },
  { value: "Doctor unavailable", label: "Doctor unavailable" },
  { label: "Medical condition improved", value: "Medical condition improved" },
  { value: "other", label: "Other" },
];

export const cancellationRate = 5; //5%
export const refundRate = 15; //10%
export const administrationFee = 5;

export const cancellationStatuses = [
  {
    status: "pending",
    label: "Cancellation Requested",
    description: "Patient has submitted a cancellation request",
    icon: IconFileText,
    color: "border-blue-500",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
    timeline: "0-1 hours",
    actions: ["Review request", "Verify appointment details"],
  },
  {
    status: "under_review",
    label: "Under Review",
    description: "Admin is reviewing the cancellation request and eligibility",
    icon: IconClock,
    color: "border-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
    timeline: "1-24 hours",
    actions: [
      "Check cancellation policy",
      "Verify appointment date",
      "Calculate refund amount",
    ],
  },
  {
    status: "approved",
    label: "Approved",
    description: "Cancellation approved, refund process initiated",
    icon: IconCircleCheck,
    color: "border-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
    timeline: "24-48 hours",
    actions: ["Notify patient", "Cancel appointment slot", "Initiate refund"],
  },
  {
    status: "processing_refund",
    label: "Processing Refund",
    description: "Refund is being processed through payment gateway",
    icon: IconCurrencyDollar,
    color: "border-purple-500",
    textColor: "text-purple-700",
    bgLight: "bg-purple-50",
    timeline: "3-7 business days",
    actions: ["Payment gateway processing", "Bank transfer initiated"],
  },
  {
    status: "completed",
    label: "Refund Completed",
    description: "Refund has been successfully processed",
    icon: IconCircleCheck,
    color: "border-emerald-500",
    textColor: "text-emerald-700",
    bgLight: "bg-emerald-50",
    timeline: "Final",
    actions: ["Refund credited to account", "Email confirmation sent"],
  },
  {
    status: "rejected",
    label: "Rejected",
    description: "Cancellation request was rejected (outside policy)",
    icon: IconCircleX,
    color: "border-red-500",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
    timeline: "Final",
    actions: ["Notify patient with reason", "Provide alternatives"],
  },
];



export const userAccountStatus = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];  

export const durationOfVisit = "1 hour";


export const TOAST_MESSAGES = {
  session_expired: {
    type: "error",
    message: "Session expired. Please login again.",
  },
  login_success: {
    type: "success",
    message: "Welcome back!",
  },
  logout_success: {
    type: "success",
    message: "Logged out successfully",
  },
  unauthorized: {
    type: "error",
    message: "You do not have permission to access that page",
  },
  email_not_verified: {
    type: "info",
    message: "Please complete your profile to continue",
  },
} as const;

// constants/refund.ts
export const REFUND_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  PROCESSING_REFUND: 'processing_refund',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const REFUND_POLICY = {
  MORE_THAN_24_HOURS: {
    hours: 24,
    percentage: 100,
    label: 'Full refund'
  },
  BETWEEN_12_24_HOURS: {
    hours: 12,
    percentage: 50,
    label: 'Partial refund'
  },
  LESS_THAN_12_HOURS: {
    hours: 0,
    percentage: 0,
    label: 'No refund'
  }
};

export const STATUS_LABELS = {
  pending: 'Cancellation Requested',
  under_review: 'Under Review',
  approved: 'Approved',
  processing_refund: 'Processing Refund',
  completed: 'Refund Completed',
  rejected: 'Rejected',
};