"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { ROLES } from "@/types/store";

export async function getAllUsers(role:ROLES) {
  try {
    const { users, database } = await createAdminClient();
    const result = await users.list();
    const doctorProfiles = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!
      );
      
      const patientProfiles = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!,
    );
    if (result.total == 0 && doctorProfiles.total == 0 && patientProfiles.total == 0) return { project: [], total: 0 };

      const usersList = result.users?.filter((user) => user.labels[0] == role ).map((user) => {
          const doctor = doctorProfiles.documents.find((doc) => doc.$id === user.prefs?.databaseId)
          const patient = patientProfiles.documents.find((doc) => doc.$id === user.prefs?.databaseId)
        return {...user, profile:user.labels[0] == "doctor" ? doctor : patient};
      });
      
      return {project:usersList, total: usersList.length};
  } catch (error) {
    console.log(error);
  }
}
