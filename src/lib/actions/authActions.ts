"use server";
import { createAdminClient, createSessionClient } from "@/appwrite/appwrite";
import { ID } from "@/appwrite/client";
import {
  CreatePatientProfileParams,
  ClientRegistrationParams,
  PatientLoginParams,
  CreateDoctorProfileParams,
  CreateAppointmentParams2,
  RescheduleAppointmentParams,
  PaymentDataType,
  RefundAppointmentParams,
  AppointmentStatus,
  ReviewParams,
} from "@/types/actions.types";
import { AdminPermissions, ROLES } from "@/types/store.types";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { PaymentFormParams } from "../../types/actions.types";
import { revalidatePath } from "next/cache";
import { generateSecureOTP } from "@/utils/utilsFn";
import argon2 from "argon2";
import { History } from "../../../types/appwrite";

/**
 * Checks the authentication status of the current user.
 *
 * A reusable server action that verifies if a user is authenticated
 *
 *
 * Usage:
 * This component ensures type safety using TypeScript generics.
 */
export async function checkAuthStatus() {
  let newRole = null;
  try {
    const { account } = await createSessionClient();
    const { database } = await createAdminClient();

    if (!account) return null;

    const response = await account.get();

    if (response?.prefs?.subRoleId) {
      const role = await database.getDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_ROLES_ID!,
        response?.prefs?.subRoleId
      );
      newRole = role;
    }
    return {
      credentials: {
        userId: response?.$id,
        email: response?.email,
        username: response?.name,
        role: response?.labels[0],
        emailVerified: response?.emailVerification,
        medId: response?.labels[0] == "doctor" ? response?.prefs?.medId : null,
        databaseId: response?.prefs?.databaseId,
        subRoleId: response?.prefs?.subRoleId,
      },
      permissions: {
        type: newRole?.type,
        permissions: newRole?.permissions,
        id: newRole?.$id,
        priority: newRole?.priority,
      } as AdminPermissions,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error checking auth status:", error);
    }
    return null;
  }
};

export async function registerClientAction(
  data: ClientRegistrationParams,
  role: ROLES
) {
  try {
    const { account, users } = await createAdminClient();
    const { email, password, username, terms_and_conditions, medId } = data;
    const uniqueID = ID.unique();

    const response = await account.create(uniqueID, email, password, username);

    await users.updateLabels(response?.$id, [
      role == "doctor" ? "doctor" : "patient",
    ]); // Assign "patient" label to user

    const prefs =
      role == "doctor"
        ? { terms_and_conditions: terms_and_conditions, medId: medId }
        : { terms_and_conditions: terms_and_conditions };

    await users.updatePrefs(response?.$id, prefs);

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const result = await users.get(response?.$id);

    return {
      credentials: {
        userId: result?.$id,
        email: result?.email,
        username: result?.name,
        role: result?.labels[0],
        emailVerified: result?.emailVerification,
        medId: role == "doctor" ? result?.prefs?.medId : null,
      },
      code: 200,
      status: "success",
      message: "Registration successful",
    };
  } catch (err) {
    const error = err as { code: number; type: string; response: string };
    return { code: error.code, status: error.type, message: error.response };
  }
}
export const clearCookies = async () =>
  (await cookies()).delete("my-custom-session");

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    await clearCookies();
    await account?.deleteSession("current");
    return { code: 200, type: "success", message: "Logged out successfully" };
  } catch (err) {
    return { code: 400, type: "error", message: `${err}` };
  }
}

export async function loginClientAction(data: PatientLoginParams) {
  try {
    const { email, password } = data;
    const { users, account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    const result = await users.get(response?.userId);

    if (result?.labels[0] == "admin")
      return {
        code: 403,
        status: "This role is not allowed to login here",
        message: "Invalid role",
      };
    (await cookies()).set("my-custom-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      credentials: {
        userId: result?.$id,
        email: result?.email,
        username: result?.name,
        role: result?.labels[0],
        emailVerified: result?.emailVerification,
        medId: result?.labels[0] == "doctor" ? result?.prefs?.medId : null,
        databaseId: result?.prefs?.databaseId,
      },
      code: 200,
      status: "success",
      message: "Login successful",
    };
  } catch (err) {
    const error = err as { code: number; type: string; response: string };
    return { code: error.code, status: error.type, message: error.response };
  }
}

export async function createPatientAction(data: CreatePatientProfileParams) {
  try {
    const { database, users } = await createAdminClient();
    const uniqueID = ID.unique();
    const a = await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!,
      uniqueID, // documentId
      { ...data }
    );
    await users.updateEmailVerification(data?.userId as string, true);
    await users.updatePrefs(data?.userId as string, { databaseId: a.$id });
    return {
      code: 200,
      status: "success",
      message: "Profile created successfully",
      databaseId: a.$id,
    };
  } catch (err) {
    return { code: 400, status: "error", message: `${err}`, databaseId: "" };
  }
}

export async function createDoctorAction(data: CreateDoctorProfileParams) {
  try {
    const {
      weekdayEndTime,
      weekdayStartTime,
      weekendEndTime,
      weekendStartTime,
      workSchedule,
      ...rest
    } = data;
    const { database, users } = await createAdminClient();
    const uniqueID = ID.unique();
    const uniqueID2 = ID.unique();
    const response = await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
      uniqueID, // documentId
      { ...rest }
    );
    await users.updateEmailVerification(data?.userId as string, true);
    await users.updatePrefs(data?.userId as string, {
      databaseId: response.$id,
    });

    const response2 = await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_AVAILABILITY_ID!,
      uniqueID2, // documentId
      {
        weekdayEndTime,
        weekdayStartTime,
        weekendEndTime,
        weekendStartTime,
        workSchedule,
        doctorId: response.$id,
      }
    );

    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_DOCTOR_ID!,
      uniqueID, // documentId
      {
        doctorAvailability: response2.$id,
      }
    );
    return {
      code: 200,
      status: "success",
      message: "Profile created successfully",
    };
  } catch (err) {
    return { code: 400, status: "error", message: `${err}` };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { users } = await createAdminClient();
    const response = await users.list([Query.equal("email", email)]);
    if (!response?.users?.length) return null;

    const fetchedUserInfo = response?.users[0];
    return {
      userId: fetchedUserInfo?.$id,
      email: fetchedUserInfo?.email,
      argon: fetchedUserInfo?.password,
      username: fetchedUserInfo?.name,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function resetPasswordAction(userId: string, password: string, token: string) {
  try {
    const { users } = await createAdminClient();
    if(((await users.get(userId)).password as string) !== token){
      return { code: 400, status: "error", message: "Invalid or expired token" };
    }
    await users.updatePassword(userId, password);
    return {
      code: 200,
      status: "success",
      message: "Password reset successful",
    };
  } catch (err) {
    console.log(err);
    return { code: 400, status: "error", message: "Failed to reset password" };
  }
}

/**
 * Create an Appoinment to see a doctor
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
export async function createAppointmentAction(data: CreateAppointmentParams2) {
  try {
    const { database } = await createAdminClient();
    const uniqueID = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID, // documentId
      { ...data }
    );
    return {
      code: 201,
      status: "success",
      message: "Appointment created successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
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
export async function deleteAppointmentAction(uniqueID: string) {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      uniqueID // documentID
    );
    return {
      code: 201,
      status: "success",
      message: "Appointment cancelled successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
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
        reason: data.reason,
        status: data.appointmentStatus,
      }
    );
    return {
      code: 201,
      status: "success",
      refId: data.reference,
      message: "Dear user, your appointment has been rescheduled successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};

export const createCancellationAction = async (
  params: RefundAppointmentParams,
  appointmentStatus: AppointmentStatus
) => {
  try {
    const { database } = await createAdminClient();
    const uniqueID = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_CANCEL_REFUND_ID!,
      uniqueID, // documentId
      {
        ...params,
      }
    );
    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      params.appointmentId,
      {
        cancelRefund: uniqueID,
        status: appointmentStatus,
      }
    );
    return {
      code: 201,
      status: "success",
      message: "Appointment cancellation successful!",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};

/* reviews */

export const addUpdateReviewAction = async (
  params: ReviewParams,
  editMode: boolean
) => {
  try {
    const { _id, ...rest } = params;
    const { database } = await createAdminClient();
    const uniqueID = ID.unique();
    if (!editMode) {
      await database.createDocument(
        process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
        process.env.NEXT_APPWRITE_DATABASE_COLLECTION_REVIEWS_ID!,
        uniqueID, // documentId
        {
          ...rest,
        }
      );
      revalidatePath(`/our-doctors/${params.doctorId}`);
      return {
        code: 201,
        status: "success",
        message: "Review added successfully",
      };
    }

    await database.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_REVIEWS_ID!,
      _id as string,
      {
        ...rest,
      }
    );
    revalidatePath(`/our-doctors/${params.doctorId}`);
    return {
      code: 204,
      status: "success",
      message: "Review updated successfully",
    };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};

///admin actions

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
};

export async function loginAdminAction(data: PatientLoginParams) {
  try {
    const otpCode = generateSecureOTP();
    const { email, password } = data;
    const { users } = await createAdminClient();

    const userAccount = await users.list(
      [Query.equal("email", email)] // queries (optional)
    );

    if (userAccount?.total == 0) {
      return {
        code: 400,
        status: "Invalid email or password",
      };
    }
    const userDetails = userAccount?.users[0];

    if (userDetails?.labels[0] !== "admin") {
      return {
        code: 403,
        status: "Forbidden Access",
      };
    }

    const verify = await verifyPassword(
      password,
      userDetails?.password as string
    );

    if (!verify) {
      return {
        code: 400,
        status: "Invalid password",
      };
    }

    const getOldprefs = await users.getPrefs(userDetails?.$id as string);

    await users.updatePrefs(userDetails?.$id as string, {
      ...getOldprefs,
      otpCode: otpCode,
    });

    return {
      code: 201,
      status: "success",
      message: "Login successful. Please enter the OTP sent to your email",
      credentials: {
        emailVerification: userDetails?.emailVerification,
        otpCode,
        username: userDetails?.name,
      },
    };
  } catch (err) {
    const error = err as { code: number; type: string; response: string };
    return { code: error.code, status: error.type, message: error.response };
  }
}

export async function handleOTPVerifyAction(
  data: PatientLoginParams,
  otpCode: string
) {
  try {
    const { email, password } = data;
    const { users, account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    const result = await users.get(response?.userId);

    if (result?.prefs?.otpCode != otpCode) {
      return {
        code: 400,
        status: "Invalid OTP",
        message: "Invalid OTP",
      };
    }
    (await cookies()).set("my-custom-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const getOldprefs = await users.getPrefs(result?.$id as string);

    await users.updatePrefs(result?.$id as string, {
      ...getOldprefs,
      otpCode: "0000",
    });

    return {
      credentials: {
        userId: result?.$id,
        email: result?.email,
        username: result?.name,
        role: result?.labels[0],
        emailVerified: result?.emailVerification,
        medId: result?.labels[0] == "doctor" ? result?.prefs?.medId : null,
        databaseId: result?.prefs?.databaseId,
      },
      code: 201,
      status: "success",
      message: "Login successful",
    };
  } catch (err) {
    const error = err as { code: number; type: string; response: string };
    return { code: error.code, status: error.type, message: error.response };
  }
}

export const createHistory = async (data: History) => {
  try {
    const { database } = await createAdminClient();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_HISTORY_ID!,
      ID.unique(),
      data
    );
    return { code: 201, status: "success" };
  } catch (err) {
    return { code: 500, status: "error", message: `${err}` };
  }
};
