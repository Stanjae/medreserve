import {
  RefundAppointmentParams,
  RescheduleAppointmentParams,
  TuseFetchAppointmentForReschedule,
} from "@/types";
import {
  calculateRefundAmount,
  getRescheduleFeeBasedOnBookingDate,
} from "./utilsFn";
import {
  appointmentStatusData,
  cancellationRate,
  REFUND_STATUSES,
} from "@/constants";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

export const transformToRescheduleData = (
  data: TuseFetchAppointmentForReschedule
): RescheduleAppointmentParams => {
  return {
    doctorId: data.doctorId.$id,
    doctorName: data.doctorId.fullname,
    patientId: data.patientId.$id,
    slotId: data.$id,
    bookingDate: "",
    startTime: "",
    endTime: "",
    reasonForReschedule: data.reasonForReschedule || "",
    fullname: data.patientId.fullname,
    email: data.patientId.email,
    address: data.patientId.address,
    amount: getRescheduleFeeBasedOnBookingDate(
      `${data.bookingDate} ${data.startTime}`,
      data.doctorId.specialization
    ),
    phone: data.patientId.phone,
    capacity: data.capacity.toString(),
    isReschedueledPolicyConfirm: false,
    appointmentStatus: appointmentStatusData[2],
  };
};

export const transformCancelRefundData = (
  data: TuseFetchAppointmentForReschedule
): RefundAppointmentParams => {
  const initialRecord = data?.paymentId?.find(
    (item) => item.type === "initial-fees"
  );
  const refunded = calculateRefundAmount(
    data?.bookingDate,
    data?.startTime,
    initialRecord?.amount as number
  );
  return {
    bankName: "",
    bankAccountNumber: "",
    bankCode: "",
    status: REFUND_STATUSES.PENDING,
    reason: "",
    refundAmount: refunded?.refundAmount,
    cancellationFee:
      ((initialRecord?.amount as number) * cancellationRate) / 100,
    appointmentId: data.$id,
    doctorId: data?.doctorId?.$id,
    patientId: data?.patientId?.$id,
    paymentId: initialRecord?.$id as string,
    refundReference: nanoid(),
    statusHistory: [
      {
        status: REFUND_STATUSES.PENDING,
        timestamp: dayjs().toISOString(),
        updatedBy: data?.patientId?.userId,
      },
    ],
  };
};
