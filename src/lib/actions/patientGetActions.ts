"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { cancel_refundStatusFilter } from "@/constants";
import {
  getDashboardBarchartAnalyticsType,
  TgetDoctorDetailsOnBooking,
  TMedicalRecordResonse,
  TuseFetchAppointmentForReschedule,
} from "@/types";
import { Query } from "node-appwrite";
import { MedicalRecord } from "../../../types/appwrite";
import dayjs from "dayjs";
import { checkIfDateIsBetweenAYear, isTodayBeforeDateTime, isTodaySameWithDateTime } from "@/utils/utilsFn";

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

export const getPatientDashboardMetricsAction = async (
  patientId: string
): Promise<{
  upcoming: number;
  visited: number;
  total: number;
  healthscore: number;
}> => {
  const { database } = await createAdminClient();
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [Query.equal("patientId", patientId)]
  );

  if (response.total == 0)
    return { upcoming: 0, visited: 0, total: 0, healthscore: 0 };

  const upcomingCount = response.documents.filter(
    (doc) =>
      isTodayBeforeDateTime(doc.bookingDate, "day") &&
      !isTodaySameWithDateTime(doc.bookingDate, "day") &&
      !cancel_refundStatusFilter.includes(doc.status)
  ).length;

  const visitedCount = response.documents.filter(
    (doc) => doc.didPatientSeeDoctor
  ).length;

  const hasRecentCheckup = response.documents.filter(
    (doc) =>
      doc.appointmentType == "follow-up" &&
      checkIfDateIsBetweenAYear(doc.bookingDate) &&
      !cancel_refundStatusFilter.includes(doc.status)
  ).length;

  const attendanceScore =
    response.total > 0 ? (visitedCount / response.total) * 100 : 100;

  const checkupScore = !!hasRecentCheckup ? 100 : 0;

  const countNonEmptyValues = Object.values(
    response?.documents[0].patientId
  ).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;
  const numberOfKeys = Object.keys(response?.documents[0].patientId).length;

  const profileCompletionScore = (countNonEmptyValues / numberOfKeys) * 100;

  const healthScore = Math.round(
    attendanceScore * 0.5 + checkupScore * 0.3 + profileCompletionScore * 0.2
  );

  return {
    upcoming: upcomingCount,
    visited: visitedCount,
    healthscore: healthScore,
    total: response.total,
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

export const fetchMedicalRecords = async (
  patientId: string,
  dateRange: [string | null, string | null]
): Promise<TMedicalRecordResonse> => {
  const { database } = await createAdminClient();

  const filters = [
    Query.equal("patientId", patientId),
    Query.orderDesc("$createdAt"),
  ];
  if (dateRange[0] && dateRange[1]) {
    filters.push(Query.between("$createdAt", dateRange[0], dateRange[1]));
  }
  const response = await database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_MEDICAL_RECORDS_ID!,
    filters
  );
  const isActive = response.documents.filter(
    (doc) => doc.isPrescriptionActive && !doc.isPrescriptionCompleted
  );
  const doctorsVisited = response.documents.filter(
    (doc) => doc.appointmentId.status == "completed"
  );
  const lastAppointment = response.documents.sort(
    (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[0];
  if (!response) throw new Error("No medical records found");
  return {
    stats: {
      total: response.total,
      active: isActive.length,
      doctorsVisited: doctorsVisited.length,
      lastVisit: dayjs(lastAppointment.$createdAt).format("MMM DD"),
    },
    records: response.documents.map((doc) => ({
      ...doc,
      vitals: doc.vitals && JSON.parse(doc.vitals),
    })) as unknown as MedicalRecord[],
  };
};

//dashboard metrics
export async function getDashboardBarchartAnalytics(
  year: number,
  period: string,
  patientId: string
): Promise<Record<string, string | number>[]> {
  // Define date ranges based on period
  let startDate: Date;
  let endDate: Date;

  if (period === "first-half") {
    // January 1 to June 30
    startDate = new Date(year, 0, 1); // January 1
    endDate = new Date(year, 5, 30, 23, 59, 59); // June 30
  } else {
    // July 1 to December 31
    startDate = new Date(year, 6, 1); // July 1
    endDate = new Date(year, 11, 31, 23, 59, 59); // December 31
  }

  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("patientId", patientId),
        Query.greaterThanEqual("$createdAt", startDate.toISOString()),
        Query.lessThanEqual("$createdAt", endDate.toISOString()),
        Query.orderAsc("$createdAt"),
        Query.limit(1000),
      ]
    );

    // Group by month and status
    const monthlyData: { [key: string]: getDashboardBarchartAnalyticsType } =
      {};

    response.documents.forEach((appointment) => {
      const date = new Date(appointment.$createdAt);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          consultation: 0,
          emergency: 0,
          followUp: 0,
          routineCheckup: 0,
        };
      }

      switch (appointment.appointmentType) {
        case "follow-up":
          monthlyData[monthKey].followUp++;
          break;
        case "consultation":
          monthlyData[monthKey].consultation++;
          break;
        case "emergency":
          monthlyData[monthKey].emergency++;
          break;
      }
    });

    // Sort months in correct order
    const monthOrder =
      period === "first-half"
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        : ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthOrder.map(
      (month) =>
        monthlyData[month] || {
          month,
          consultation: 0,
          emergency: 0,
          followUp: 0,
        }
    );
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    return [];
  }
}
