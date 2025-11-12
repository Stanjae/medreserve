"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { cancel_refundStatusFilter } from "@/constants";
import {
  TgetDoctorDetailsOnBooking,
  TuseFetchAppointmentForReschedule,
} from "@/types";
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

  newArr = availableSlots?.documents
    .map((slot) => ({
      ...slot?.doctorId,
      workSchedule: slot?.workSchedule,
      weekendStartTime: slot?.weekendStartTime,
      weekendEndTime: slot?.weekendEndTime,
      weekdayStartTime: slot?.weekdayStartTime,
      weekdayEndTime: slot?.weekdayEndTime,
    }))
    .filter((slot) => slot?.isActive);

  if (specialty) {
    newArr = newArr?.filter((slot) => slot?.specialization === specialty);
  }

  return {
    project: newArr,
    total: newArr?.length,
    hasMore: newArr?.length > LIMIT * page,
  };
};

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
  return response.documents.filter(
    (doc) => !cancel_refundStatusFilter.includes(doc.status)
  );
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
  if (response.total == 0) return null;
  return response.documents;
}

export async function getDoctorDetailsOnBooking(
  doctorId: string
): Promise<TgetDoctorDetailsOnBooking> {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
    doctorId
  );
  if (!response) throw new Error("No doctor found");
  const ratingTotal =
    Array.isArray(response?.reviewsId) &&
    response?.reviewsId?.reduce(
      (acc, val) => Number(acc) + Number(val?.rating),
      0
    );

  const ratingCount = Array.isArray(response?.reviewsId)
    ? response?.reviewsId?.length
    : 0;

  const avgRating = ratingTotal / ratingCount;

  return {
    fullname: response?.fullname,
    profilePicture: response?.profilePicture,
    specialization: response?.specialization,
    ratingCount,
    avgRating,
    doctorAvailability: response?.doctorAvailability,
  };
}

export async function fetchCurrentBookingSlot(slotId: string) {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    slotId
  );
  if (!response) throw new Error("No appointment found");
  return {
    doctorSpecialization: response?.doctorId?.specialization,
    patientFullname: response?.patientId.fullname,
    address: response?.patientId.address,
    phone: response?.patientId.phone,
  };
}

export async function fetchAppointmentByIdForReschedule(
  slotId: string
): Promise<TuseFetchAppointmentForReschedule> {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    slotId,
    [
      Query.select([
        "$id",
        "bookingDate",
        "status",
        "startTime",
        "endTime",
        "reason",
        "reasonForReschedule",
        "doctorId.profilePicture",
        "doctorId.$id",
        "doctorId.specialization",
        "doctorId.fullname",
        "doctorId.doctorAvailability.workSchedule",
        "doctorId.doctorAvailability.weekendStartTime",
        "doctorId.doctorAvailability.weekendEndTime",
        "doctorId.doctorAvailability.weekdayStartTime",
        "doctorId.doctorAvailability.weekdayEndTime",
        "patientId.$id",
        "patientId.fullname",
        "patientId.phone",
        "patientId.address",
        "patientId.email",
        "patientId.userId",
        "capacity",
        "paymentId.*",
        "cancelRefund.*",
      ]),
    ]
  );
  if (!response) throw new Error("No appointment found");
  return response as unknown as TuseFetchAppointmentForReschedule;
}
