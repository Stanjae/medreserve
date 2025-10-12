import {
  BloodGroupType,
  Cadre,
  EditUserModified,
  Gender,
  GenotypeType,
} from "@/types/actions.types";
import { ROLES } from "@/types/store.types";

export const InitialDoctorProfile = {
  fullname: "",
  email: "",
  address: "",
  bio: "",
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
};

export const initialPatientProfile = {
  fullname: "",
  email: "",
  phone: "",
  occupation: "",
  address: "",
  gender: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  birthDate: "",
  bloodGroup: "a-positive" as BloodGroupType,
  genotype: "",
  insurancePolicyNumber: "",
  insuranceProvider: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "",
  identificationNumber: "",
  identificationDocument: "",
  profilePicture: "",
  privacyConsent: false,
};

export const initialAdminProfile = {
  fullname: "",
  userId: "",
  jobSpecification: "",
  address: "",
  gender: "Male" as Gender,
  birthDate: "",
  privacyConsent: false as boolean,
  profilePicture: "",
  identificationType: "",
  identificationNumber: "",
};

export const initialUsers = {
  username: "",
  email: "",
  phone: "",
  status: "active" as "active" | "suspended",
};

export const EditInitialDoctorProfile = {
  fullname: "",
  userId: "",
  gender: "Male" as Gender,
  address: "",
  bio: "",
  cadre: "housemanship" as Cadre,
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
  identificationType: "",
  identificationNumber: "",
  identificationDocument: "",
  profilePicture: "",
  privacyConsent: false as boolean,
};

export const EditSchedule = {
  weekdayStartTime: "",
  weekdayEndTime: "",
  weekendStartTime: "",
  weekendEndTime: "",
  workSchedule: [] as string[],
};

export const EditInitialPatientProfile = {
  fullname: "",
  occupation: "",
  userId: "",
  address: "",
  gender: "Male" as Gender,
  emergencyContactName: "",
  emergencyContactNumber: "",
  birthDate: "",
  bloodGroup: "" as BloodGroupType,
  genotype: "" as GenotypeType,
  insurancePolicyNumber: "",
  insuranceProvider: "",
  allergies: "" as string | undefined,
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "",
  identificationNumber: "",
  identificationDocument: "",
  profilePicture: "",
  privacyConsent: false as boolean,
};

/* export const userFormInitals = (role: ROLES) => {
  const newAccount =
    role == "admin"
      ? { ...initialUsers, prefs: { subRoleId: "", subRole: "" } }
      : { ...initialUsers };
  const newProfile =
    role == "admin"
      ? initialAdminProfile
      : role == "patient"
        ? EditInitialPatientProfile
        : {...EditInitialDoctorProfile,  ...EditSchedule};

  return {
    account: newAccount,
    profile: newProfile,
  };
}; */

export const userFormInitials = (
  role: ROLES,
  userId?: string
): EditUserModified => {
  const baseUser: EditUserModified = {
    account: {
      email: "",
      username: "",
      phone: "",
      status: "active",
    },
    profile: {
      userId: "",
      fullname: "",
      birthDate: "",
      gender: "" as Gender,
      address: "",
      privacyConsent: false,
      profilePicture: "",
    },
  };

  // Add role-specific fields
  if (role === "patient") {
    baseUser.profile = {
      ...baseUser.profile,
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      bloodGroup: "o-positive",
      genotype: "AA",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      identificationDocument: "",
    };
  } else if (role === "doctor") {
    baseUser.profile = {
      ...baseUser.profile,
      bio: "",
      stateOfOrigin: "",
      lga: "",
      university: "",
      courseOfStudy: "",
      degree: "",
      yearOfGraduation: "",
      courseDuration: 0,
      cadre: "housemanship",
      experience: 0,
      medId: "",
      specialization: "",
      identificationType: "",
      identificationNumber: "",
      weekdayStartTime: "",
      weekdayEndTime: "",
      weekendStartTime: "",
      weekendEndTime: "",
      workSchedule: [],
    };
  } else if (role === "admin") {
    baseUser.profile = {
      ...baseUser.profile,
      jobSpecification: "",
      identificationType: "",
      identificationNumber: "",
    };

    baseUser.account = {
      ...baseUser.account,
      prefs: {
        subRoleId: "",
        subRole: "",
      },
    };
  }

  if (!userId) {
    baseUser.account = { ...baseUser.account, password: "" };
  }

  return baseUser;
};

export const userEditFormArrange = (role: ROLES, userId?: string) => {
  let newAccount: EditUserModified["account"] =
    role == "admin"
      ? {
          ...initialUsers,
          prefs: {},
        }
      : { ...initialUsers };
  if (!userId) {
    newAccount = { ...newAccount, password: "" };
  }
  const newProfile =
    role == "admin"
      ? initialAdminProfile
      : role == "patient"
        ? EditInitialPatientProfile
        : EditInitialDoctorProfile;

  if (role == "doctor") {
    return {
      account: newAccount,
      profile: newProfile,
      schedule: EditSchedule,
    };
  }

  return {
    account: newAccount,
    profile: newProfile,
  };
};
