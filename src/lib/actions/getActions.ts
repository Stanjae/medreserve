 
"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { Query } from "node-appwrite";
import {
  AdminProfile,
  Doctor,
  ModifiedHistory,
  Patient,
  Payment,
} from "../../../types/appwrite";
import {
  DoctorReviewsResponse,
  GetDoctorsMasonryResponse,
  getUserAppointmentsResponse,
  getUserPaymentsResponse,
  ReviewParams,
} from "@/types/actions.types";
import {
  getFilterByCreatedAt,
  isTodayAfterDateTime,
  isTodayBeforeDateTime,
  isTodaySameWithDateTime,
} from "@/utils/utilsFn";
import { cancel_refundStatusFilter, userRoles } from "@/constants";
import { ROLES } from "@/types";

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
  return response.documents[0] as unknown as Payment;
}

/* Tables */

export async function getPatientAppointmentTable(
  patientId: string,
  activeTab: string
): Promise<getUserAppointmentsResponse> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [Query.equal("patientId", [patientId]), Query.orderDesc("$createdAt")]
  );
  let appointRecords;
  const customFn = getFilterByCreatedAt(activeTab);
  if (response.total == 0 || !response) return { project: [], total: 0 };

  if (cancel_refundStatusFilter.includes(activeTab)) {
    appointRecords = response.documents.filter(
      (item) => item.status == activeTab
    );
  } else {
    appointRecords = response.documents.filter(
      (item) =>
        customFn(item?.bookingDate, "day") &&
        !cancel_refundStatusFilter.includes(item?.status)
    );
  }

  const newResponse = appointRecords?.map((slot) => ({
    doctorName: slot.doctorId.fullname,
    doctorExperience: slot.doctorId.experience,
    id: slot.$id,
    didPatientSeeDoctor: slot.didPatientSeeDoctor,
    bookingDate: slot.bookingDate,
    startTime: slot.startTime,
    endTime: slot.endTime,
    appointmentStatus: slot.status,
    createdAt: slot.$createdAt,
    specialization: slot.doctorId.specialization,
    profilePicture: slot.doctorId.profilePicture,
    rating: slot.doctorId.reviewsId,
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
    reason: slot.reason,
    patientPhone: slot.patientId.phone,
    patientFullname: slot.patientId.fullname,
    patientAddress: slot.patientId.address,
    patientEmail: slot.patientId.email,
    capacity: slot.capacity,
    appointmentType: slot.appointmentType,
    cancelRefund: slot.cancelRefund,
  }));
  return {
    project: newResponse,
    total: response.total,
  };
}

export const getPatientPaymentsTable = async (
  patientId: string
): Promise<getUserPaymentsResponse | null> => {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PAYMENT_ID!,
    [Query.orderDesc("$createdAt")]
  );
  if (response.total == 0) return { project: [], total: 0 };

  const userPayments = response.documents
    .filter((payment) => payment?.patientId?.$id == patientId)
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

export const getPatientsTabsCountAction = async (
  patientId: string
): Promise<{
  upcoming: number;
  past: number;
  today: number;
  all: number;
  refunded: number;
  cancelled: number;
}> => {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [Query.equal("patientId", patientId)]
  );

  if (response.total == 0)
    return {
      upcoming: 0,
      past: 0,
      today: 0,
      all: 0,
      refunded: 0,
      cancelled: 0,
    };

  const upcomingCount = response.documents.filter(
    (doc) =>
      isTodayBeforeDateTime(doc.bookingDate, "day") &&
      !isTodaySameWithDateTime(doc.bookingDate, "day") &&
      !cancel_refundStatusFilter.includes(doc.status)
  ).length;

  const pastCount = response.documents.filter(
    (doc) =>
      isTodayAfterDateTime(doc.bookingDate, "day") &&
      !isTodaySameWithDateTime(doc.bookingDate, "day") &&
      !cancel_refundStatusFilter.includes(doc.status)
  ).length;

  const todayCount = response.documents.filter(
    (doc) =>
      isTodaySameWithDateTime(doc.bookingDate, "day") &&
      !cancel_refundStatusFilter.includes(doc.status)
  ).length;

  const cancelled = response.documents.filter(
    (doc) => doc.status == "cancelled"
  ).length;

  const refunded = response.documents.filter(
    (doc) => doc.status == "refunded"
  ).length;

  return {
    upcoming: upcomingCount,
    past: pastCount,
    today: todayCount,
    all: response.total,
    refunded: refunded,
    cancelled: cancelled,
  };
};



/* fetch appointment for cancel */

export async function getCurrentAppointmentForCancelSlot(slotId: string) {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    slotId
  );
  if (!response) throw new Error("No appointment found");
  return {
    doctorSpecialization: response?.doctorId?.specialization,
    doctorName: response?.doctorId?.fullname,
    doctorProfilePicture: response?.doctorId?.profilePicture,
    doctorId: response?.doctorId?.$id,
    patientId: response?.patientId?.$id,
    slotId: response?.$id,
    patientFullname: response?.patientId.fullname,
    appointmentType: response?.appointmentType,
    appointmentStatus: response?.status,
    bookingDate: response?.bookingDate,
    startTime: response?.startTime,
    endTime: response?.endTime,
    paymentId: response?.paymentId,
    refundStatus: response?.cancelRefund?.status,
  };
}

/* fetch all doctors */
export async function getAllDoctors(
  filter: string
): Promise<GetDoctorsMasonryResponse[]> {
  const queries = [
    Query.select([
      "$id",
      "fullname",
      "profilePicture",
      "specialization",
      "bio",
    ]),
    Query.limit(1000),
  ];

  if (filter) {
    queries.push(Query.equal("specialization", filter));
  }

  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
    queries
  );
  if (!response) throw new Error("No doctor found");

  const doctors = response.documents.map((doctor) => ({
    id: doctor.$id,
    fullname: doctor.fullname,
    profilePicture: doctor.profilePicture,
    specialization: doctor.specialization,
    bio: doctor.bio,
  }));

  return doctors as GetDoctorsMasonryResponse[];
}

export async function getDoctorDetails(doctorId: string): Promise<Doctor> {
  const { database } = await createAdminClient();
  const response = await database.getDocument(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
    doctorId
  );
  if (!response) throw new Error("No doctor found");

  return response as Doctor;
}

export async function getDoctorReviewByPatient(
  doctorId: string,
  patientId: string
): Promise<ReviewParams | null> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_REVIEWS_ID!,
    [Query.equal("patientId", patientId), Query.equal("doctorId", doctorId)]
  );
  if (response.total == 0) return null;

  const review = response?.documents[0];

  return {
    _id: review?.$id,
    rating: review?.rating,
    reviewText: review?.reviewText,
    patientId: review?.patientId?.$id,
    doctorId: review?.doctorId?.$id,
    type: review?.type,
    anonymous: review?.anonymous,
  };
}

export async function getDoctorReviews(
  doctorId: string
): Promise<DoctorReviewsResponse[] | null> {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_REVIEWS_ID!,
    [Query.equal("doctorId", doctorId), Query.equal("type", "doctor")]
  );
  if (response.total == 0) return null;

  return response?.documents?.map((review) => ({
    _id: review?.$id,
    rating: review?.rating,
    reviewText: review?.reviewText,
    type: review?.type,
    anonymous: review?.anonymous,
    patientPicture: review?.patientId?.profilePicture,
    patientName: review?.patientId?.fullname,
    patientOccupation: review?.patientId?.occupation,
  }));
}

export const getDocumentHistory = async (
  documentId: string
): Promise<{ documents: ModifiedHistory[]; total: number }> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_HISTORY_ID!,
      [
        Query.equal("relatedEntityId", documentId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return response as { documents: ModifiedHistory[]; total: number };
  } catch (error) {
    console.error(error);
    return { documents: [], total: 0 };
  }
};

export const getUserProfileForUpdateAction = async (
  role: ROLES,
  userId: string
) => {
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
    const { database } = await createAdminClient();

    const profile = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      collectionId,
      [Query.equal("userId", userId)]
    );

    const newProfile = profile.documents[0] as unknown as
      | Doctor
      | Patient
      | AdminProfile;

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

    return { profile: emptyProfile };
  } catch (error) {
    throw new Error(error as string);
  }
};
