"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { SignupTabsType } from "@/types/actions.types";
import { getFilterByNewSignups } from "@/utils/utilsFn";
import { Query } from "node-appwrite";
import {
  AdminProfile,
  Doctor,
  ModifiedRoles,
  ModifiedUser,
  Patient,
} from "../../../types/appwrite";
import { ROLES } from "@/types/store.types";
import { userRoles } from "@/constants";
import {
  getAllAppointmentsActionWithinYearAndMonthResponse,
  ModifiedHistoryResponseForAppointments,
  searchAppointmentDetailsResponse,
  searchAppointmentsResponse,
} from "@/types";
import { getDocumentHistory } from "./getActions";
export async function getAllUsers(
  tab: SignupTabsType,
  dateRange: [string | null, string | null]
): Promise<{ project: ModifiedUser[]; total: number }> {
  try {
    const { users, database } = await createAdminClient();
    const filterFn = getFilterByNewSignups(tab);

    if (dateRange[0] && dateRange[1]) {
      filterFn.push(Query.between("$createdAt", dateRange[0], dateRange[1]));
    }
    const result = await users.list([
      ...filterFn,
      Query.orderDesc("$createdAt"),
    ]);
    const doctorProfiles = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
    );

    const patientProfiles = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
    );
    if (
      result.total == 0 &&
      doctorProfiles.total == 0 &&
      patientProfiles.total == 0
    )
      return { project: [], total: 0 };

    const usersList: ModifiedUser[] = result.users?.map((user) => {
      const doctor = doctorProfiles.documents.find(
        (doc) => doc.$id === user.prefs?.databaseId
      ) as Doctor | undefined;
      const patient = patientProfiles.documents.find(
        (doc) => doc.$id === user.prefs?.databaseId
      ) as Patient | undefined;
      const labels = user.labels[0] as "admin" | "doctor" | "patient";
      const profile: Doctor | Patient | null | undefined =
        labels === "admin" ? null : labels === "doctor" ? doctor : patient;

      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        labels,
        status: user.status,
        prefs: user.prefs,
        $createdAt: user?.$createdAt,
        accessedAt: user.accessedAt,
        profile,
        registeredAt: user?.registration,
        phone: user?.phone,
        emailVerification: user?.emailVerification,
        $updatedAt: user?.$updatedAt,
      } as ModifiedUser;
    });

    return { project: usersList, total: usersList.length };
  } catch (error) {
    console.log(error);
    return { project: [], total: 0 };
  }
}

export const getNewSignupsTabCountAction = async () => {
  try {
    const { users } = await createAdminClient();
    const unverifiedDoctors = await users.list([
      Query.contains("labels", "doctor"),
      Query.equal("emailVerification", false),
      Query.equal("status", true),
    ]);

    const patientsCount = await users.list([
      Query.contains("labels", "patient"),
    ]);

    const verifiedDoctors = await users.list([
      Query.contains("labels", "doctor"),
      Query.equal("emailVerification", true),
      Query.equal("status", true),
    ]);

    const suspendedUsers = await users.list([Query.equal("status", false)]);

    return {
      "pending-doctors": unverifiedDoctors.total,
      patient: patientsCount.total,
      "verified-doctors": verifiedDoctors.total,
      suspended: suspendedUsers.total,
    };
  } catch (e) {
    console.log("err", e);
  }
};

//roles and permissons
export const getAllRolesAction = async (): Promise<ModifiedRoles[]> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!
    );
    return response.documents as ModifiedRoles[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUsersByRoleAction = async (role: ROLES) => {
  try {
    const { users } = await createAdminClient();
    const response = await users.list([Query.contains("labels", role)]);
    return response.users;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//USERS
/* 
This code snippet is a TypeScript function named 
getSpecificRoleUsersAndProfilesAction
 that retrieves specific users and their profiles based on a given role and date range. It uses the async/await syntax to handle asynchronous operations.

Here's a breakdown of what the code does:

It takes two parameters: role (a string representing the role of the users to retrieve) and dateRange (an array containing the start and end dates of the date range).
 */
export const getSpecificRoleUsersAndProfilesAction = async (
  role: ROLES,
  dateRange: [string | null, string | null]
): Promise<{ project: ModifiedUser[]; total: number }> => {
  try {
    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
              .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    const { users, database } = await createAdminClient();
    const filters = [
      Query.contains("labels", role),
      Query.equal("emailVerification", true),
      Query.orderDesc("$createdAt"),
    ];
    if (dateRange[0] && dateRange[1]) {
      filters.push(Query.between("$createdAt", dateRange[0], dateRange[1]));
    }
    const response = await users.list(filters);

    const profile = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      collectionId
    );

    if (response.total == 0 && profile.total == 0)
      return { project: [], total: 0 };

    const usersList: ModifiedUser[] = response.users?.map((user) => {
      const newProfile = profile.documents.find(
        (item) => item.$id === user.prefs?.databaseId
      );
      const labels = user.labels[0] as "admin" | "doctor" | "patient";

      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        labels,
        status: user.status,
        prefs: user.prefs,
        $createdAt: user?.$createdAt,
        accessedAt: user.accessedAt,
        profile: newProfile,
        registeredAt: user?.registration,
        phone: user?.phone,
        emailVerification: user?.emailVerification,
        $updatedAt: user?.$updatedAt,
      } as ModifiedUser;
    });

    return { project: usersList, total: usersList.length };
  } catch (error) {
    console.log(error);
    return { project: [], total: 0 };
  }
};

export const getSpecificRoleUsersAndProfilesCountAction = async (): Promise<{
  doctor: number;
  patient: number;
  admin: number;
}> => {
  try {
    const { users } = await createAdminClient();
    const response = await users.list([Query.equal("emailVerification", true)]);

    if (response.total == 0) return { doctor: 0, patient: 0, admin: 0 };

    const doctor = response.users?.filter((user) =>
      user.labels.includes("doctor")
    ).length;
    const patient = response.users?.filter((user) =>
      user.labels.includes("patient")
    ).length;
    const admin = response.users?.filter((user) =>
      user.labels.includes("admin")
    ).length;

    return { doctor, patient, admin };
  } catch (error) {
    console.log(error);
    return { doctor: 0, patient: 0, admin: 0 };
  }
};

//appointments
export const getAllAppointmentsActionWithinYearAndMonth = async (
  month?: number,
  year?: number
): Promise<getAllAppointmentsActionWithinYearAndMonthResponse[]> => {
  try {
    const { database } = await createAdminClient();

    const queries = [Query.orderAsc("startTime")];

    if (month !== undefined && year !== undefined) {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;

      // Calculate last day of the month
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      queries.push(
        Query.greaterThanEqual("bookingDate", startDate),
        Query.lessThanEqual("bookingDate", endDate)
      );
    }
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      queries
    );
    return response.documents.map((item) => ({
      startTime: item.startTime,
      endTime: item.endTime,
      bookingDate: item.bookingDate,
      status: item.status,
      id: item.$id,
      appointmentType: item.appointmentType,
      notes: item.notes || "",
      reason: item.reason,
      didPatientSeeDoctor: item.didPatientSeeDoctor,
      doctorName: item?.doctorId?.fullname,
      doctorProfilePicture: item.doctorId.profilePicture,
      doctorSpecialization: item.doctorId.specialization,
      patientFullname: item?.patientId?.fullname || "",
      patientProfilePicture: item?.patientId?.profilePicture,
      patientId: item?.patientId?.userId,
      patientEmail: item?.patientId?.email,
      patientPhone: item?.patientId?.phone,
      createdAt: item.$createdAt,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllUserRolesAction = async () => {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!
    );
    return response.documents.map((item) => ({
      label: item.type,
      value: item.$id,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUserForEditAction = async (role: ROLES, userId: string) => {
  try {
    if (!userRoles.includes(role)) {
      throw new Error("Invalid role");
    }
    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
              .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    const { users, database } = await createAdminClient();
    const response = await users.get(userId);

    const profile = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      collectionId,
      [Query.equal("userId", userId)]
    );

    const newProfile = profile.documents[0] as unknown as
      | Doctor
      | Patient
      | AdminProfile;

    const account = {
      $id: response.$id,
      email: response.email,
      labels: response.labels[0],
      phone: response.phone || "",
      username: response.name,
      status: response.status ? "active" : "suspended",
      prefs: {
        subRoleId: response.prefs?.subRoleId || undefined,
        subRole: response.prefs?.subRole || undefined,
      },
    };

    const emptyProfile = {
      $id: newProfile?.$id,
      fullname: newProfile?.fullname,
      address: newProfile?.address,
      bio: newProfile?.bio,
      userId: newProfile?.userId,
      gender: newProfile?.gender,
      cadre: newProfile?.cadre,
      birthDate: newProfile?.birthDate,
      zipcode: newProfile?.zipcode,
      experience: newProfile?.experience,
      medId: newProfile?.medId,
      jobSpecification: newProfile?.jobSpecification,
      specialization: newProfile?.specialization,
      grade: newProfile?.grade,
      courseOfStudy: newProfile?.courseOfStudy,
      university: newProfile?.university,
      yearOfGraduation: newProfile?.yearOfGraduation,
      degree: newProfile?.degree,
      courseDuration: newProfile?.courseDuration,
      stateOfOrigin: newProfile?.stateOfOrigin,
      lga: newProfile?.lga,
      identificationType: newProfile?.identificationType,
      identificationNumber: newProfile?.identificationNumber,
      identificationDocument: newProfile?.identificationDocument,
      profilePicture: newProfile?.profilePicture,
      privacyConsent: newProfile?.privacyConsent,
      weekdayStartTime: newProfile?.doctorAvailability?.weekdayStartTime,
      weekdayEndTime: newProfile?.doctorAvailability?.weekdayEndTime,
      weekendStartTime: newProfile?.doctorAvailability?.weekendStartTime,
      weekendEndTime: newProfile?.doctorAvailability?.weekendEndTime,
      workSchedule: newProfile?.doctorAvailability?.workSchedule,
      scheduleId: newProfile?.doctorAvailability?.$id,
      occupation: newProfile?.occupation,
      emergencyContactName: newProfile?.emergencyContactName,
      emergencyContactNumber: newProfile?.emergencyContactNumber,
      bloodGroup: newProfile?.bloodGroup,
      genotype: newProfile?.genotype,
      insurancePolicyNumber: newProfile?.insurancePolicyNumber,
      insuranceProvider: newProfile?.insuranceProvider,
      allergies: newProfile?.allergies,
      currentMedication: newProfile?.currentMedication,
      familyMedicalHistory: newProfile?.familyMedicalHistory,
      pastMedicalHistory: newProfile?.pastMedicalHistory,
    };

    return { account, profile: emptyProfile };
  } catch (error) {
    /*     const err = error as { message: string };
    console.log(err);
    return { code: 500, message: err?.message || "An error occurred." }; */
    throw new Error(error as string);
  }
};

export const getAppointmentDocumentHistory = async (
  documentId: string
): Promise<ModifiedHistoryResponseForAppointments[]> => {
  try {
    const { users } = await createAdminClient();
  const response = await getDocumentHistory(documentId);
    const result = response.documents.map(async (item) => {
      const user = await users.get(item.userId);
      return {
        ...item,
        userId: {
          $id: user.$id,
          role: user.labels[0] as ROLES,
          name: user.name,
        },
      };
    }) as unknown as ModifiedHistoryResponseForAppointments[];
    return await Promise.all(result);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAppointmentsSearchAndFilterAction = async (
  appointmentId: string | null | undefined,
  bookingDate: string,
  appointmentType: string,
  page: number
) => {
  try {
    const LIMIT = 5;
    const OFFSET = (page - 1) * LIMIT;

    if (!bookingDate && !appointmentType && !appointmentId) {
      return {
        project: [],
        total: 0,
        hasMore: false
      };
    }

    const selectFields = Query.select([
      "$id",
      "bookingDate",
      "status",
      "patientId.fullname",
      "patientId.profilePicture",
      "patientId.phone",
      "patientId.email",
      "startTime",
      "endTime",
      "doctorId.fullname",
      "doctorId.profilePicture",
      "doctorId.specialization",
      "reason",
      "appointmentType",
    ]);

    const queryFilter = [
      Query.limit(LIMIT),
      Query.offset(OFFSET),
      selectFields,
    ];

    if (appointmentId) {
      queryFilter.push(Query.equal("$id", appointmentId));
    }

    if (bookingDate) {
      queryFilter.push(Query.equal("bookingDate", bookingDate));
    }

    if (appointmentType) {
      queryFilter.push(Query.equal("appointmentType", appointmentType));
    }
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      queryFilter
    );
    return {
      project: response.documents as unknown as searchAppointmentsResponse[],
      total: response.total,
      hasMore: response?.total > LIMIT * page,
    };
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const getAppointmentDetailsAction = async (appointmentId: string) => {
  try {
     const selectFields = Query.select([
       "$id",
       "bookingDate",
       "status",
       "patientId.fullname",
       "patientId.profilePicture",
       "patientId.phone",
       "patientId.email",
       "patientId.userId",
       "patientId.gender",
       "patientId.birthDate",
       "patientId.bloodGroup",
       "patientId.address",
       "startTime",
       "endTime",
       "doctorId.fullname",
       "doctorId.profilePicture",
       "doctorId.specialization",
       "doctorId.userId",
       "doctorId.email",
       "doctorId.phone",
       "reason",
       "appointmentType",
       "didPatientSeeDoctor",
       "paymentId.*"
     ]);
    const { database } = await createAdminClient();
    const response = await database.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      appointmentId,
      [selectFields]
    );

    const historyResponse = await getAppointmentDocumentHistory(appointmentId);
    return {...response, history: historyResponse} as unknown as searchAppointmentDetailsResponse;
  } catch (err) {
    throw new Error(`${err}`);
  }
};
