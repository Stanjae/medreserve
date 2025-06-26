"use server";
import { createAdminClient, createSessionClient } from "@/appwrite/appwrite";
import { ID } from "@/appwrite/client";
import {
  CreatePatientProfileParams,
  ClientRegistrationParams,
  PatientLoginParams,
} from "@/types/actions.types";
import { ROLES } from "@/types/store";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

export async function checkAuthStatus() {
  try {
    const { account } = await createSessionClient();
    // If successful, user is authenticated
    const response = await account.get();

    return {
      userId: response?.$id,
      email: response?.email,
      username: response?.name,
      role: response?.labels[0],
      emailVerified: response?.emailVerification,
      medId: response?.labels[0] == "doctor" ? response?.prefs?.medId : null,
    };
  } catch (error) {
    console.error("User is not authenticated:", error);
    return null;
  }
}
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
    (await cookies()).delete("my-custom-session");
    await account.deleteSession("current");
    return { code: 200, type: "success", message: "Logged out successfully" };
  } catch (err) {
    console.log(err);
    return { code: 400, type: "error", message: "Failed to log out" };
  }
}

export async function loginClientAction(data: PatientLoginParams) {
  try {
    const { email, password } = data;
    const { users, account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    const result = await users.get(response?.userId);

    console.log("result:", result);

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
      },
      code: 200,
      status: "success",
      message: "Login successful",
    };
  } catch (err) {
    const error = err as { code: number; type: string; response: string };
    console.log("err:", error);
    return { code: error.code, status: error.type, message: error.response };
  }
}

export async function createPatientAction(data: CreatePatientProfileParams) {
  try {
    const { database, users } = await createAdminClient();
    const uniqueID = ID.unique();
    await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_USERS_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_PATIENT_ID!,
      uniqueID, // documentId
      { ...data }
    );
    await users.updateEmailVerification(data?.userId as string, true);
    return {
      code: 200,
      status: "success",
      message: "Profile created successfully",
    };
  } catch (err) {
    console.log(err);
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

export async function resetPasswordAction(userId: string, password: string) {
  try {
    const { users } = await createAdminClient();
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
