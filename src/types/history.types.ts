import { ModifiedHistory } from "../../types/appwrite";
import { ROLES } from "./store.types";

/**
 * Represents a modified history response for appointments,
 * replacing the userId field with detailed user information.
 * Use this type when you need appointment history with user details.
 */
export type ModifiedHistoryResponseForAppointments = Omit<
  ModifiedHistory,
  "userId"
> & {
  userId: {
    $id: string;
    name: string;
    role: ROLES;
  };
};
