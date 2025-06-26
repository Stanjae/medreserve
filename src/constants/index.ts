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

export const genderData = ['Male', 'Female', 'Other']

export const userRoles = ['patient', 'doctor', 'admin'];

export const doctorCategories = [
  {
    group: "Primary Care Physicians",
    items: [
      { value: "family-medicine", label: "Family Medicine Physician" },
      { value: "internal-medicine", label: "Internal Medicine Physician" },
      { value: "pediatrician", label: "Pediatrician" }
    ]
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
      { value: "urologist", label: "Urologist" }
    ]
  },
  {
    group: "Surgical Specialties",
    items: [
      { value: "general-surgeon", label: "General Surgeon" },
      { value: "plastic-surgeon", label: "Plastic Surgeon" },
      { value: "ent", label: "Otolaryngologist (ENT)" }
    ]
  },
  {
    group: "Other Specialties",
    items: [
      { value: "emergency-medicine", label: "Emergency Medicine Specialist" },
      { value: "geriatric-medicine", label: "Geriatric Medicine Specialist" },
      { value: "physiatrist", label: "Physiatrist" },
      { value: "pathologist", label: "Pathologist" },
      { value: "preventive-medicine", label: "Preventive Medicine Specialist" }
    ]
  }
];

