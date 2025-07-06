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
  { label: "Monday", value: '1' },
  { label: "Tuesday", value: '2' },
  { label: "Wednesday", value: '3' },
  { label: "Thursday", value: '4' },
  { label: "Friday", value: '5' },
  { label: "Saturday", value: '6' },
  { label: "Sunday", value: '0' },
]

export const InitialDoctorProfile = {
      fullname: "",
      address: "",
      bio: "",
      email: "",
      phone: "",
      gender: "",
      cadre: "",
      birthDate: "",
      zipcode: "",
      experience: 0,
      medId: "",
      specialization: "",
      grade: "",
      courseOfStudy: "",
      university: "",
      yearOfGraduation: "",
      degree: "",
      courseDuration: 0,
      stateOfOrigin: "",
      lga: "",
      weekdayStartTime: "",
      weekdayEndTime: "",
      weekendStartTime: "",
      weekendEndTime: "",
      identificationType: "",
      identificationNumber: "",
      identificationDocument: "",
      profilePicture: "",
      privacyConsent: false,
    }
