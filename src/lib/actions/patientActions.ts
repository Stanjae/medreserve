"use server";
import { createAdminClient } from "@/appwrite/appwrite";
import {
  CreateAppointmentParams2,
  PaymentDataType,
  PaymentFormParams,
  RefundAppointmentParams,
  RescheduleAppointmentParams,
} from "@/types";
import { ID } from "node-appwrite";
import { createHistory, isAuthenticated } from "./authActions";
import {
  calculateRefundAmount,
  formatCurrency,
  getAMPM,
  isTodayAfterDateTime,
} from "@/utils/utilsFn";
import { appointmentStatusData } from "@/constants";
import dayjs from "dayjs";

/**
 * Create a reservation to see a doctor
 *
 * A reusable server action that creates a booking for the patient.
 *
 * Props:
 * - items: An object of items. Each item must have a unique `id` property.
 *
 * Usage:
 * Pass an array of objects and specify how to render each item.
 * This component ensures type safety using TypeScript generics.
 */
export async function createReservationAction(data: CreateAppointmentParams2) {
  try {
    const { database } = await createAdminClient();
    await isAuthenticated();

    if (isTodayAfterDateTime(`${data.bookingDate} ${data.startTime}`, "hour")) {
      return {
        code: 403,
        status: "success",
        message: "You cannot book an appointment in the past.",
      };
    }
    const uniqueID = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID,
      { ...data }
    );
    return {
      code: 201,
      status: "success",
      message: "Reservation created successfully",
    };
  } catch (err) {
    return {
      code: 500,
      status: "success",
      message: `${err}`,
    };
  }
}

/**
 * cancel an Appoinment to see a doctor
 *
 * A reusable server action that deletes a booking for the patient.
 *
 * Props:
 * - items: An object of items. Each item must have a unique `id` property.
 *
 * Usage:
 * Pass an array of objects and specify how to render each item.
 * This component ensures type safety using TypeScript generics.
 */
export async function deleteReservationAction(uniqueID: string) {
  try {
    const { database } = await createAdminClient();
    await isAuthenticated();
    await database.deleteDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID
    );
    return {
      code: 201,
      status: "success",
      message: "Reservation cancelled successfully",
    };
  } catch (err) {
    throw new Error(`${err}`);
  }
}

/**
 * Creates a payment record in the database for a completed appointment.
 *
 * This function is a server-side action that processes payment information
 * and stores it in the designated payment collection. It ensures that all
 * necessary payment details are recorded, including metadata and authorization.
 *
 * @param {PaymentFormParams & { reference: string; status: "success" | "failed"; metaData: string; paidOn: string; authorization: string }} data
 * - The payment data object containing all necessary fields for processing
 *   the payment. It includes information such as the payment reference,
 *   transaction status, metadata, and authorization.
 *
 * @returns {Promise<{ code: number; status: string; message: string }>}
 * - Returns a promise that resolves to an object indicating the result of
 *   the operation, including an HTTP status code, a status string, and a
 *   message describing the outcome.
 *
 * @throws Will log an error and return an error response if the payment
 *         record creation fails.
 */

export const createPaymentAction = async (
  data: PaymentFormParams & {
    reference: string;
    status: "success" | "failed";
    metaData: string;
    paidOn: string;
    authorization: string;
    userId: string;
  }
) => {
  try {
    const { database } = await createAdminClient();
    const uniqueID = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PAYMENT_ID!,
      uniqueID, // documentId
      {
        metaData: data.metaData,
        appointment: data.slotId,
        amount: data.amount,
        paidOn: data.paidOn,
        reference: data.reference,
        status: data.status,
        patientId: data.patientId,
        doctorId: data.doctorId,
        authorization: data.authorization,
      }
    );
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      data.slotId,
      {
        status: "approved",
        capacity: Number(data.capacity),
      }
    );

    await createHistory({
      action: "create",
      relatedEntityType: "payments",
      userId: data.userId,
      relatedEntityId: uniqueID,
      description: `Payment was made for an appointment by`,
    });
    return {
      code: 201,
      status: "success",
      refId: data.reference,
      message: "Appointment Paid and Completed successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};

export const reschedulePaymentAction = async (
  data: RescheduleAppointmentParams & {
    reference: string;
    status: "success" | "failed";
    metaData: string;
    paidOn: string;
    authorization: string;
    type: PaymentDataType;
    userId: string;
  }
) => {
  try {
    const { database } = await createAdminClient();
    const uniqueId = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PAYMENT_ID!,
      uniqueId, // documentId
      {
        metaData: data.metaData,
        appointment: data.slotId,
        amount: data.amount,
        paidOn: data.paidOn,
        reference: data.reference,
        status: data.status,
        patientId: data.patientId,
        doctorId: data.doctorId,
        authorization: data.authorization,
        type: data.type,
      }
    );
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      data.slotId,
      {
        capacity: Number(data.capacity),
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        reasonForReschedule: data.reasonForReschedule,
        status: data.appointmentStatus,
      }
    );

    await createHistory({
      action: "create",
      relatedEntityType: "payments",
      userId: data.userId,
      relatedEntityId: uniqueId,
      description: `Reschedule fees was made for an appointment by`,
    });
    await createHistory({
      action: "update",
      relatedEntityType: "appointments",
      relatedEntityId: data.slotId,
      description: `Appointment was rescheduled by`,
      userId: data.userId,
    });
    return {
      code: 200,
      status: "success",
      refId: data.reference,
      message: "Dear user, your appointment has been rescheduled successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};

//cancel-refund
export const createCancellationAction = async ({
  notes,
  ...params
}: RefundAppointmentParams) => {
  try {
    const { database } = await createAdminClient();
    const uniqueID = ID.unique();
    const newParams = {
      ...params,
      statusHistory: JSON.stringify(params.statusHistory),
    };
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_CANCEL_REFUND_ID!,
      uniqueID, // documentId
      {
        ...newParams,
      }
    );
    console.log(notes);
    const response = await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      params.appointmentId,
      {
        cancelRefund: uniqueID,
        status: appointmentStatusData[3],
      }
    );

    const newData = {
      email: response.patientId.email,
      patientName: response.patientId.fullname,
      doctorName: response.doctorId.fullname,
      appointmentDate: response.bookingDate,
      appointmentTime: `${getAMPM(response.startTime)} - ${getAMPM(response.endTime)}`,
      cancellationReason: params.reason,
      refundAmount: formatCurrency(params.refundAmount - params.cancellationFee),
      refundPercentage: 
        calculateRefundAmount(
          response?.bookingDate,
          response?.startTime,
          params?.refundAmount
        ).percentage,
      refundReference: params.refundReference,
      expectedRefundDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
      userId: response.patientId.userId,
    };
    return {
      code: 201,
      status: "success",
      message: "Appointment cancellation successful!",
      data: newData,
    };
  } catch (err) {
    throw new Error(`${err}`);
  }
};


export const markPrescriptionAsCompleted = async (id: string) => {
  try {
      const { database } = await createAdminClient();
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_MEDICAL_RECORDS_ID!,
      id,
      { isPrescriptionCompleted : true }
    );
    return {
      code: 200,
      status: "success",
      message: "Prescription marked as completed",
    };
  }catch(err) {
    throw new Error(`${err}`);
  }

  
}