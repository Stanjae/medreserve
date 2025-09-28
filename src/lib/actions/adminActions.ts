/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import {
  AssignUsersToNewRoleParams,
  EditUserModified,
  EditUserParams,
  SignupTabsType,
} from "@/types/actions.types";
import { getFilterByNewSignups } from "@/utils/utilsFn";
import { ID, Query } from "node-appwrite";
import {
  AdminProfile,
  DefaultRoles,
  Doctor,
  ModifiedRoles,
  ModifiedUser,
  Patient,
} from "../../../types/appwrite";
import { ROLES } from "@/types/store";
import { userRoles } from "@/constants";

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

export const newSignupsTabCountAction = async () => {
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

export async function updateUserStatusAction(
  userId: string,
  status: boolean
): Promise<{ code: number; message: string } | void> {
  try {
    const { users } = await createAdminClient();
    const response = await users.updateStatus(userId, status);
    if (response.$id) {
      return {
        code: 200,
        message: `User has been ${status ? "unblocked" : "blocked"} successfully.`,
      };
    } else {
      return { code: 400, message: "Failed to update user status." };
    }
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
}

export async function updateUserBulkStatusAction(
  userId: string[],
  status: boolean
): Promise<{ code: number; message: string } | void> {
  try {
    const { users } = await createAdminClient();

    userId.forEach(async (id) => {
      await users.updateStatus(id, status);
    });

    return {
      code: 200,
      message: `${userId.length} Users has been ${status ? "unblocked" : "blocked"} successfully.`,
    };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
}

export async function updateUserVerificationAction(
  userId: string,
  status: boolean
): Promise<{ code: number; message: string } | void> {
  try {
    const { users } = await createAdminClient();
    const response = await users.updateEmailVerification(userId, status);
    if (response.$id) {
      return {
        code: 200,
        message: `User has been ${status ? "verified" : "unverified"} successfully.`,
      };
    } else {
      return { code: 400, message: "Failed to update user verification." };
    }
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
}

export async function updateUserBulkVerificationAction(
  userId: string[],
  status: boolean
): Promise<{ code: number; message: string } | void> {
  try {
    const { users } = await createAdminClient();

    userId.forEach(async (id) => {
      await users.updateEmailVerification(id, status);
    });
    return {
      code: 200,
      message: `${userId.length} Users has been ${status ? "verified" : "unverified"} successfully.`,
    };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
}

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

export const updateRoleAction = async (role: ModifiedRoles) => {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!,
      role.$id,
      { ...role }
    );
    return { code: 200, message: "Role has been updated successfully." };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
};

export const createRoleAction = async (role: DefaultRoles) => {
  try {
    const uniqueID = ID.unique();
    const { database } = await createAdminClient();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!,
      uniqueID,
      { ...role }
    );
    return { code: 200, message: "Role has been created successfully." };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
};

export const deleteRoleAction = async (roleId: string) => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!,
      roleId
    );
    return { code: 200, message: "Role has been deleted successfully." };
  } catch (error) {
    const err = error as { message: string };
    console.log(err);
    return { code: 500, message: err?.message || "An error occurred." };
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

export const bulkAssignUsersToNewRoleAction = async (
  roles: AssignUsersToNewRoleParams[]
) => {
  try {
    const { users } = await createAdminClient();
    roles.forEach(async (user) => {
      await users.updatePrefs(user.userId, { ...user.prefs });
    });
    return { code: 200, message: "Roles have reassigned successfully." };
  } catch (error) {
    const err = error as { message: string };
    console.log(err);
    return { code: 500, message: err?.message || "An error occurred." };
  }
};

//USERS

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

//edit users

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

const extractScheduleFields = (profile: any) => {
  return {
    weekdayStartTime: profile?.weekdayStartTime,
    weekdayEndTime: profile?.weekdayEndTime,
    weekendStartTime: profile?.weekendStartTime,
    weekendEndTime: profile?.weekendEndTime,
    workSchedule: profile?.workSchedule,
  };
};

// Helper function to remove schedule fields from profile
const removeScheduleFields = (profile: any) => {
  const {
    weekdayStartTime,
    weekdayEndTime,
    weekendStartTime,
    weekendEndTime,
    workSchedule,
    ...cleanProfile
  } = profile;
  console.error(
    weekdayStartTime,
    weekdayEndTime,
    weekendStartTime,
    weekendEndTime,
    workSchedule
  );
  return cleanProfile;
};

export const updateUserProfileAction = async (
  params: EditUserParams & EditUserModified
) => {
  try {
    const { scheduleId, role, accountId, profileId, account, profile } = params;

    let newProfile =
      role === "doctor"
        ? removeScheduleFields(profile as unknown as EditUserModified)
        : profile;
    const workingSchedule =
      role === "doctor"
        ? extractScheduleFields(profile as unknown as EditUserModified)
        : {};
    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
              .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    const { users, database } = await createAdminClient();

    //account
    if (account && Object.keys(account).length > 0) {
      if (account.status) {
        const status = account.status === "active" ? true : false;
        await users.updateStatus(accountId as string, status);
      }

      if (account.phone) {
        await users.updatePhone(accountId as string, account.phone);
        if (newProfile) {
          newProfile.phone = account.phone || "";
        } else {
          newProfile = {
            ...newProfile,
            phone: account.phone || "",
          };
        }
      }

      if (account.username) {
        await users.updateName(accountId as string, account.username);
      }

      if (account.email) {
        await users.updateEmail(accountId as string, account.email);
        if (newProfile) {
          newProfile.email = account.email || "";
        } else {
          newProfile = {
            ...newProfile,
            phone: account.phone || "",
          };
        }
      }

      if (role === "admin" && Object.keys(account.prefs as any).length > 0) {
        const allPrefs = await users.getPrefs(accountId as string);
        await users.updatePrefs(accountId as string, {
          ...allPrefs,
          ...account.prefs,
        });
      }
    }

    if (newProfile && Object.keys(newProfile).length > 0) {
      await database.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        collectionId,
        profileId as string,
        newProfile
      );
    }

    if (
      role == "doctor" &&
      scheduleId &&
      Object.keys(workingSchedule).length > 0
    ) {
      await database.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_AVAILABILITY_ID!,
        scheduleId,
        { ...workingSchedule }
      );
    }

    return {
      code: 200,
      message: `User has been updated successfully.`,
    };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
};

export const createUserProfileAction = async (
  params: EditUserModified & { role: ROLES }
) => {
  try {
    const { role, account, profile } = params;

    const newProfile =
      role === "doctor"
        ? removeScheduleFields(profile as unknown as EditUserModified)
        : profile;
    const workingSchedule =
      role === "doctor"
        ? extractScheduleFields(profile as unknown as EditUserModified)
        : {};

    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
              .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    const { account: accounts, database, users } = await createAdminClient();

    if (role === "doctor") {
      const doesMedIdExist = await database.listDocuments(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        collectionId,
        [Query.equal("medId", profile.medId || "")]
      );
      if (doesMedIdExist.total > 0) {
        return { code: 400, message: "Medical ID already exists." };
      }
    }
    const newUser = await accounts.create(
      ID.unique(),
      account.email,
      account.password as string,
      account.username
    );

    if (!newUser.$id) {
      return { code: 400, message: "Failed to create user account." };
    }

    const newProfileModified = {
      ...newProfile,
      email: account.email,
      phone: account.phone,
      userId: newUser.$id,
    };

    const createdProfile = await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      collectionId,
      ID.unique(),
      newProfileModified
    );

    if (!createdProfile.$id) {
      await users.delete(newUser.$id);
      return { code: 400, message: "Failed to create user profile." };
    }

    const defaultPrefs = {
      terms_terms_and_conditions: true,
      databaseId: createdProfile.$id,
    };

    const newPrefs = role === "admin" ? {...defaultPrefs,
      subRoleId: account.prefs?.subRoleId || "",
      subRole: account.prefs?.subRole || "",  
    } : role === "doctor" ? {...defaultPrefs, medId: profile.medId} : {...defaultPrefs};

    const status = account.status === "active" ? true : false;

    await users.updateLabels(newUser.$id, [role]);
    await users.updatePrefs(newUser.$id, newPrefs);
    await users.updateEmailVerification(newUser.$id, true);
    await users.updateStatus(newUser.$id, status);
    await users.updatePhone(newUser.$id, account.phone || "");

    if (role == "doctor") {
      const response2 = await database.createDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_AVAILABILITY_ID!,
        ID.unique(),
        {
          ...workingSchedule,
          doctorId: createdProfile.$id,
        }
      );

      await database.updateDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
        createdProfile.$id, // documentId
        {
          doctorAvailability: response2.$id,
        }
      );
    }

    return {
      code: 200,
      message: `${role} has been created successfully.`,
      userId: newUser.$id,
      role,
    };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
  }
};

export const deleteUserProfileAction = async (
  params: EditUserParams
) => {
  try {
    const { role, accountId, profileId, scheduleId } = params;

    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
            .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    
    const { database, users } = await createAdminClient();

    if(accountId){
      await users.delete(accountId);
    }

    if (profileId) {
      await database.deleteDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        collectionId,
        profileId
      );
    }
    if (role == "doctor" && scheduleId) {
      await database.deleteDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_AVAILABILITY_ID!,
        scheduleId
      );
    }

    return {
      code: 200,
      message: `${role} has been deleted successfully.`,
      role,
    };
  } catch (error) {
    const err = error as { message: string };
    return { code: 500, message: err?.message || "An error occurred." };
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
