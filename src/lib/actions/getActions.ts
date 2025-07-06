"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { Query } from "node-appwrite";

export const getAvailableDoctorsFilterAction = async (
  specialty: string | null | undefined,
  weekDay: string,
  isPast: boolean,
  page: number
) => {
  if (isPast) {
    throw new Error("You can't find available doctors in the Past");
  }
  let newArr;
  const LIMIT = 5;
  const OFFSET = (page - 1) * LIMIT;
  const { database } = await createAdminClient();
  const availableSlots = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_AVAILABILITY_ID!,
    [
      Query.contains("workSchedule", [weekDay]),
      Query.limit(LIMIT),
      Query.offset(OFFSET),
    ]
  );

  if (!specialty) {
    newArr = availableSlots?.documents.map((slot) => ({
      ...slot?.doctorId,
      workSchedule: slot?.workSchedule,
      weekendStartTime: slot?.weekendStartTime,
      weekendEndTime: slot?.weekendEndTime,
      weekdayStartTime: slot?.weekdayStartTime,
      weekdayEndTime: slot?.weekdayEndTime,
    }));
    return {
      project: newArr,
      total: availableSlots?.total,
      hasMore: availableSlots?.total > LIMIT * page,
    };
  }

  newArr = availableSlots?.documents
    .map((slot) => ({
      ...slot?.doctorId,
      workSchedule: slot?.workSchedule,
      weekendStartTime: slot?.weekendStartTime,
      weekendEndTime: slot?.weekendEndTime,
      weekdayStartTime: slot?.weekdayStartTime,
      weekdayEndTime: slot?.weekdayEndTime,
    }))
    .filter((slot) => slot?.specialization === specialty);
  return {
    project: newArr,
    total: availableSlots?.total,
    hasMore: availableSlots?.total > LIMIT * page,
  };
};

export async function getDoctorDetailsOnBooking(doctorId: string) {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
    doctorId,
    [Query.select(["fullname", "profilePicture", "specialization", "rating"])]
  );
  if (!response) throw new Error("No doctor found");

  return response;
}

export async function checkIfSlotIsBooked(
  doctorId: string,
  bookingDate: string
) {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [
      Query.and([
        Query.equal("bookingDate", bookingDate),
        Query.equal("doctorId", doctorId),
      ]),
    ]
  );
  if (response.total == 0) return [];
  return response.documents;
}

export async function checkIfUserBookedASlot(
  doctorId: string,
  bookingDate: string,
  patientId: string
) {
  const { database } = await createAdminClient();
  const status = "pending";
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [
      Query.and([
        Query.equal("bookingDate", bookingDate),
        Query.equal("doctorId", doctorId),
        Query.equal("patientId", patientId),
        Query.endsWith("status", status),
      ]),
    ]
  );
  if (response.total == 0) return null
  return response.documents;
}

/* export async function getPatientId() {
        const { database } = await createAdminClient();
        const response = await database.getDocument(
          process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
          process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!,
            [
              Query.equal('$id', userId)
          ]
        );
        if (!response) throw new Error("No patient found");
        return response;
    } */
