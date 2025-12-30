"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import { appointmentTypeData, chartColors, topDiagnoses } from "@/constants";
import {
  getDashboardBarchartAnalyticsType,
  TDonutsChartData,
  TGetDoctorMetricsSubParams,
  TMetricCardStatus,
  TPatientAgeDemographics,
} from "@/types";
import { getAgeGroup } from "@/utils/utilsFn";
import dayjs from "dayjs";
import { Query } from "node-appwrite";

export const getDoctorDashboardMetricsAction = async (
  doctorId: string
): Promise<{
  todayAppt: TGetDoctorMetricsSubParams;
  totalPatientsSeen: TGetDoctorMetricsSubParams;
  avgTimeOfConsultation: TGetDoctorMetricsSubParams;
  patientAvgRating: TGetDoctorMetricsSubParams;
}> => {
  const { database } = await createAdminClient();
  const today = dayjs().format("YYYY-MM-DD");

  const todayApptResponse = database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [Query.equal("doctorId", doctorId), Query.equal("bookingDate", today)]
  );

  const yesterdayApptResponse = database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [
      Query.and([
        Query.equal("doctorId", doctorId),
        Query.equal(
          "bookingDate",
          dayjs().subtract(1, "day").format("YYYY-MM-DD")
        ),
      ]),
    ]
  );

  const totalPatientsSeenResponse = database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [
      Query.and([
        Query.equal("doctorId", doctorId),
        Query.equal("didPatientSeeDoctor", true),
      ]),
    ]
  );

  const totalPatientsSeenThisWeekResponse = database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
    [
      Query.and([
        Query.equal("doctorId", doctorId),
        Query.equal("didPatientSeeDoctor", true),
        Query.greaterThanEqual(
          "bookingDate",
          dayjs().subtract(7, "day").format("YYYY-MM-DD")
        ),
      ]),
    ]
  );

  const patientAvgRatingResponse = database.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_REVIEWS_ID!,
    [Query.equal("doctorId", doctorId)]
  );

  const [
    todayApptData,
    yesterdayApptData,
    totalPatientsSeenThisWeekData,
    totalPatientsSeenData,
    patientAvgRatingData,
  ] = await Promise.all([
    todayApptResponse,
    yesterdayApptResponse,
    totalPatientsSeenThisWeekResponse,
    totalPatientsSeenResponse,
    patientAvgRatingResponse,
  ]);

  const todayApptResult = {
    count: todayApptData.total,
    subLabel: yesterdayApptData.total
      ? `${(((todayApptData.total - yesterdayApptData.total) / yesterdayApptData.total) * 100).toFixed(1)}% from yesterday`
      : "N/A",
    status:
      todayApptData.total == 0
        ? "stable"
        : todayApptData.total >= yesterdayApptData.total
          ? "improve"
          : ("decline" as TMetricCardStatus),
  };

  const totalPatientsSeenResult = {
    count: totalPatientsSeenData.total,
    subLabel: totalPatientsSeenThisWeekData.total
      ? `${totalPatientsSeenThisWeekData.total}% from this week`
      : "N/A",
    status:
      totalPatientsSeenThisWeekData.total == 0
        ? "stable"
        : totalPatientsSeenThisWeekData.total > 0
          ? "improve"
          : ("decline" as TMetricCardStatus),
  };

  const avgTimeOfConsultationResultModified =
    totalPatientsSeenData.total > 0
      ? totalPatientsSeenData.documents.reduce(
          (acc, doc) => acc + parseInt(doc.actualDurationOfAppointmentInMins),
          0
        ) / totalPatientsSeenData.total
      : 0;

  const avgTimeOfConsultationResult = {
    count: avgTimeOfConsultationResultModified,
    subLabel: "Target: is 1 hr",
    status: "stable" as TMetricCardStatus,
  };

  const patientAvgRatingResultTotal =
    patientAvgRatingData.total > 0
      ? patientAvgRatingData.documents.reduce(
          (acc: number, item) => acc + item.rating,
          0
        )
      : 0;
  const patientAvgRatingResultModified =
    patientAvgRatingResultTotal / patientAvgRatingData.total || 0;

  const patientAvgRatingResult = {
    count: patientAvgRatingResultModified.toFixed(1) as unknown as number,
    subLabel: `${patientAvgRatingData.total} reviews`,
    status:
      patientAvgRatingData.total == 0
        ? "stable"
        : Number(patientAvgRatingResultModified) >= 4.0
          ? "improve"
          : ("decline" as TMetricCardStatus),
  };

  return {
    todayAppt: todayApptResult,
    totalPatientsSeen: totalPatientsSeenResult,
    avgTimeOfConsultation: avgTimeOfConsultationResult,
    patientAvgRating: patientAvgRatingResult,
  };
};

//bar-chart metrics
export async function getDoctorDashboardBarchartAnalytics(
  year: number,
  period: string,
  doctorId: string
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
        Query.and([
          Query.equal("didPatientSeeDoctor", true),
          Query.equal("doctorId", doctorId),
          Query.greaterThanEqual("$createdAt", startDate.toISOString()),
          Query.lessThanEqual("$createdAt", endDate.toISOString()),
        ]),
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
        case "routine-checkup":
          monthlyData[monthKey].routineCheckup++;
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
          routineCheckup: 0,
        }
    );
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    return [];
  }
}

export const getPatientAgeDemographicsAction = async (): Promise<
  TPatientAgeDemographics[]
> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!,
      [Query.limit(1000)]
    );
    const ageGroups = ["Under 18", "18-29", "30-39", "40-49", "50-59", "60+"];

    const ageCounts = response.documents.reduce(
      (acc, patient) => {
        const ageGroup = getAgeGroup(patient.birthDate);
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Ensure all groups are present with 0 count if missing
    const ageDistribution = ageGroups.map((group) => ({
      ageGroup: group,
      count: ageCounts[group] || 0,
    }));

    return ageDistribution;
  } catch (error) {
    console.error("Error fetching patient age demographics:", error);
    return [];
  }
};

export const getPatientTopDiagnosisAction = async (): Promise<
  TDonutsChartData[]
> => {
  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_MEDICAL_RECORDS_ID!,
      [Query.limit(1000)]
    );
    const diagnosis = topDiagnoses;

    const counts = response.documents.reduce(
      (acc, doc) => {
        const diagnosise = doc.diagnosis.toLowerCase();
        acc[diagnosise] = (acc[diagnosise] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Ensure all groups are present with 0 count if missing
    const topDiagnosis = diagnosis.map((group, index) => ({
      name: group,
      value: counts[group.toLowerCase()] || 0,
      color: chartColors[index],
    }));

    return topDiagnosis as TDonutsChartData[];
  } catch (error) {
    console.error("Error fetching patient age demographics:", error);
    return [];
  }
};

export const getPatientAppointmentsDistributionAction = async (): Promise<
 { total: number; data: TDonutsChartData[] }
> => {
  try {
    const { database } = await createAdminClient();
    const consultation = database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("appointmentType", appointmentTypeData[0].value),
        Query.limit(1000),
      ]
    );

    const followup = database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("appointmentType", appointmentTypeData[1].value),
        Query.limit(1000),
      ]
    );

    const emergency = database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("appointmentType", appointmentTypeData[2].value),
        Query.limit(1000),
      ]
    );

    const routineCheckup = database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("appointmentType", appointmentTypeData[3].value),
        Query.limit(1000),
      ]
    );

    const [consultationData, followupData, emergencyData, routineCheckupData] =
      await Promise.all([consultation, followup, emergency, routineCheckup]);

    const consultationCount = consultationData.total || 0;
    const followUpCount = followupData.total || 0;
    const emergencyCount = emergencyData.total || 0;
    const routineCheckupCount = routineCheckupData.total || 0;

    const totalCount =
      consultationCount + followUpCount + emergencyCount + routineCheckupCount;

    return {
      total: totalCount,
      data: [
        { name: "Consultation", value: consultationCount, color: chartColors[0] },
        { name: "Follow-up", value: followUpCount, color: chartColors[1] },
        { name: "Emergency", value: emergencyCount, color: chartColors[2] },
        {
          name: "Routine Checkup",
          value: routineCheckupCount,
          color: chartColors[3],
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching patient age demographics:", error);
    return { total: 0, data: [] };
  }
};
