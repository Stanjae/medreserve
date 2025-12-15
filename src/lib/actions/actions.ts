"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { EditProfileType, UpdateProfileParamsType } from "@/types";
import { extractScheduleFields, removeScheduleFields } from "@/utils/utilsFn";

export const updateUserProfileAction = async (
  params: UpdateProfileParamsType
) => {
  try {
    const { scheduleId, role, profileId, profile } = params;

    const newProfile =
      role === "doctor"
        ? removeScheduleFields(profile as unknown as EditProfileType["profile"])
        : profile;
    const workingSchedule =
      role === "doctor" &&
      extractScheduleFields(profile as unknown as EditProfileType["profile"]);
    const collectionId =
      role == "doctor"
        ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
        : role == "patient"
          ? process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!
          : process.env
              .NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ADMIN_PROFILE_ID!;
    const { database } = await createAdminClient();

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
      message: `Profile has been updated successfully.`,
    };
  } catch (error) {
    throw new Error(`Failed to update profile: ${error}`);
  }
};
