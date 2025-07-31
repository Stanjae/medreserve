"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { Query } from "node-appwrite";
import { Payment} from "../../../types/appwrite";
import { getUserAppointmentsResponse, getUserPaymentsResponse } from "@/types/actions.types";

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
  if (response.total == 0) return null;
  return response.documents;
}

export async function fetchCurrentBookingSlot(slotId: string) {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    slotId
  );
  if (!response) throw new Error("No patient found");
  return {
    doctorSpecialization: response?.doctorId?.specialization,
    patientFullname: response?.patientId.fullname,
    address: response?.patientId.address,
    phone: response?.patientId.phone,
  };
}

export async function getPatientBookingReference(
  paymentreferenceId: string
): Promise<Payment | null> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PAYMENT_ID!,
    [Query.equal("reference", paymentreferenceId)]
  );
  if (response.total == 0) return null;
  return response.documents[0];
}

/* Tables */

export async function getPatientAppointmentTable(
  patientId: string
): Promise<getUserAppointmentsResponse> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [Query.equal("patientId", patientId), Query.orderDesc("$createdAt")]
  );
  if (response.total == 0 || !response) return { project: [], total: 0 };
  const newResponse = response.documents.map((slot) => ({
    doctorName: slot.doctorId.fullname,
    id: slot.$id,
    bookingDate: slot.bookingDate,
    startTime: slot.startTime,
    endTime: slot.endTime,
    paymentStatus: slot.status,
    createdAt: slot.$createdAt,
    specialization: slot.doctorId.specialization,
    profilePicture: slot.doctorId.profilePicture,
    rating: slot.doctorId.rating,
    bio: slot.doctorId.bio,
    patientUserId: slot.patientId.$id,
    doctorUserId: slot.doctorId.$id,
    paymentId: slot.paymentId,
    doctorAvailability: slot.doctorId.doctorAvailability.workSchedule,
    weekdayEndTime: slot.doctorId.doctorAvailability.weekdayEndTime,
    weekdayStartTime: slot.doctorId.doctorAvailability.weekdayStartTime,
    weekendEndTime: slot.doctorId.doctorAvailability.weekendEndTime,
    weekendStartTime: slot.doctorId.doctorAvailability.weekendStartTime,
    notes: slot.notes,
    patientPhone: slot.patientId.phone,
    patientFullname: slot.patientId.fullname,
    patientAddress: slot.patientId.address,
    patientEmail: slot.patientId.email,
    capacity: slot.capacity,
  }));
  return {
    project: newResponse,
    total: response.total,
  };
}

export const getPatientPaymentsTable = async (
  patientId: string
):Promise<getUserPaymentsResponse | null>=> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PAYMENT_ID!,
    [Query.orderDesc("$createdAt")]
  );
  if (response.total == 0) return null;

  const userPayments = response.documents
    .filter((payment) => payment.patientId.$id == patientId)
    .map((payment) => ({
      id: payment.$id,
      reference: payment.reference,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.$createdAt,
      patientUserId: payment.patientId.$id,
      doctorUserId: payment.doctorId.$id,
      metaData: payment.metaData ? JSON.parse(payment.metaData) : null,
      appointmentId: payment.appointment?.$id,
      specialization: payment.doctorId?.specialization,
      type: payment?.type,
      doctorName: payment.doctorId?.fullname,
    }));

  return { project: userPayments, total: response.total };
};