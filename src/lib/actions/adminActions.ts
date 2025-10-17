/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import {
  AssignUsersToNewRoleParams,
  EditUserModified,
  EditUserParams,
} from "@/types/actions.types";
import { ID, Query } from "node-appwrite";
import { DefaultRoles, ModifiedRoles } from "../../../types/appwrite";
import { ROLES } from "@/types/store.types";
import { createHistory } from "./actions";
import { cancellationActionData, TpatientCheckinActionData, updateAppointmentAdminParams } from "@/types";

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

    const newPrefs =
      role === "admin"
        ? {
            ...defaultPrefs,
            subRoleId: account.prefs?.subRoleId || "",
            subRole: account.prefs?.subRole || "",
          }
        : role === "doctor"
          ? { ...defaultPrefs, medId: profile.medId }
          : { ...defaultPrefs };

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

export const deleteUserProfileAction = async (params: EditUserParams) => {
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

    if (accountId) {
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

export async function updateAdminAppointmentAction(
  uniqueID: string,
  userId: string,
  data: updateAppointmentAdminParams
) {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID,
      data
    );
    await createHistory({
      action: "update",
      relatedEntityType: "appointments",
      relatedEntityId: uniqueID,
      description: `Appointment was ${data?.bookingDate ? "rescheduled" : "updated"} by`,
      userId,
    });
    return {
      code: 200,
      status: "success",
      message: `Appointment ${data?.bookingDate ? "rescheduled" : "updated"} successfully`,
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
}

export async function deleteAdminAppointmentAction(
  uniqueID: string,
  userId: string
) {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID
    );
    await createHistory({
      action: "delete",
      relatedEntityType: "appointments",
      relatedEntityId: uniqueID,
      description: "Appointment was deleted by",
      userId,
    });
    return {
      code: 200,
      status: "success",
      message: "Appointment deleted successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};


export async function cancelAdminAppointmentAction(
  uniqueID: string,
  userId: string,
  data: cancellationActionData
) {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID,
      data
    );
    await createHistory({
      action: "update",
      relatedEntityType: "appointments",
      relatedEntityId: uniqueID,
      description: `Appointment was cancelled by`,
      userId,
    });
    return {
      code: 200,
      status: "success",
      message: `Appointment cancelled successfully`,
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
}


export async function patientCheckinForAppointmentAction(
  uniqueID: string,
  userId: string,
  data: TpatientCheckinActionData
) {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID,
      data
    );
    await createHistory({
      action: "update",
      relatedEntityType: "appointments",
      relatedEntityId: uniqueID,
      description: `Patient was cheked in by`,
      userId,
    });
    return {
      code: 200,
      didPatientSeeDoctor: data.didPatientSeeDoctor,
      status: "success",
      message: `Patient ${data.didPatientSeeDoctor ? '' : 'did not'} checked in successfully for the appointment`,
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
}
