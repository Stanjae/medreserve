import { JSX } from "react";
import doctorsData from "../lib/api/data.json";
import universitiesData from "../lib/api/universities.json";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { GETADDBYPARAMS } from "@/types";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { Payment } from "../../types/appwrite";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(calendar);
dayjs.extend(relativeTime);

export const parseResponse = (response: string) =>
  response.replace(/[_-]/g, " ");

export const handleFileUpload = async (file: File) => {
  const body = new FormData();
  body.append("file", file);
  try {
    const response = await fetch("/api/medreserve/upload", {
      method: "POST",
      body,
    });
    const data = await response.json();
    return data?.fileUrl;
  } catch (err) {
    console.log(err);
  }
};

export const handleNavLinks = (
  role: string,
  userId: string | undefined,
  navigation: {
    sub?: { label: string; href: string }[];
    child: boolean;
    label: string;
    href: string;
    leftIcon: JSX.Element;
  }[]
) => {
  return navigation.map((item) => ({
    ...item,
    href:
      item.href == "dashboard"
        ? `/${role}/${userId}/dashboard`
        : `/${role}/${userId}/dashboard/${item.href}`,
  }));
};

// Define the Doctor type
export interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  designation: string;
  specialization: string;
  imageUrl: string;
}

// Define the API response type
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null | undefined; // data can be Doctor or null if not found
}

export async function simulateFetchNin(
  search: string,
  delay: number
): Promise<ApiResponse<Doctor | null>> {
  const nin = doctorsData.doctors.find((doc) => doc.doctorId == search);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        message: "Doctors data fetched successfully",
        data: nin,
      });
    }, delay);
  });
}

export async function simulateFetchUniversities(
  delay: number
): Promise<ApiResponse<Array<{ items: string[]; group: string }>>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        message: "Doctors data fetched successfully",
        data: universitiesData,
      });
    }, delay);
  });
}

export function formatDate(dateString: string): string {
  const today = dayjs().startOf("day");
  const newDate = dayjs(dateString).startOf("day");

  return newDate.isSame(today)
    ? dayjs().format("YYYY-MM-DD") + " (Today)"
    : newDate.format("YYYY-MM-DD");
}

export function getAMPM(timeString: string): string {
  // Prepend a default date to the time string
  const dateTimeString = `2000-01-01 ${timeString}`;

  // Parse with format including date and time
  const parsed = dayjs(dateTimeString, "YYYY-MM-DD HH:mm:ss");
  return parsed.format("h:mm A");
}

export function getDateTimeAMPM(dateTimeString: string): string {
  const parsed = dayjs(dateTimeString, "YYYY-MM-DD HH:mm:ss");
  return parsed.format("YYYY-MM-DD @ HH:mm A");
}

export function addOrSubtractTime(
  dateTimeString: string,
  type: "add" | "subtract",
  incrementBy: number,
  unit: GETADDBYPARAMS,
  timeFormat: "h-m-s" | "am-pm"
): string {
  // Prepend a default date to the time string

  // Parse with format including date and time
  const parsed = dayjs(dateTimeString, "YYYY-MM-DD HH:mm:ss");
  if (type == "add") {
    const a = parsed.add(incrementBy, unit);
    return a.format(timeFormat == "h-m-s" ? "HH:mm:ss" : "HH:mm A");
  }

  return parsed
    .subtract(incrementBy, unit)
    .format(timeFormat == "h-m-s" ? "HH:mm:ss" : "HH:mm A");
}

export function isbBeforeDateTime(dateString: string): boolean {
  const newDate = dayjs().isAfter(dayjs(dateString));
  return newDate;
}

export function checkDateTimeDifferenceFromNow(dateTimeString: string | undefined) {
  return dayjs().diff(dayjs(dateTimeString), "hour"); // 7
}

export function getCalendarDateTime(dateTimeString: string) {
  return dayjs(dateTimeString).calendar(null, {
    sameDay: "[Today at] h:mm A", // The same day ( Today at 2:30 AM )
    nextDay: "[Tomorrow]", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "[next week] dddd [by] h:mm A", // The next week ( Sunday at 2:30 AM )
    lastDay: "[Yesterday]", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd", // Last week ( Last Monday at 2:30 AM )
    sameElse: "DD/MM/YYYY", // Everything else ( 7/10/2011 )
  });
}

export function getAMPWAT(timeString: string) {
  const watTime = dayjs.utc(timeString).tz("Africa/Lagos").subtract(1, "hour");
  const formatted = watTime.format("hA [WAT]"); // "4PM WAT"
  return formatted;
}

export const getTimeFromNow = (dateTimeString: string) =>
  dayjs(dateTimeString).fromNow();

export function convertToCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal", // or 'currency', 'percent'
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(amount)}`;
}

export const getLatestObjectByCreatedAt = (arr: Payment[]) => {
  if (arr.length === 0) return null;

  return arr.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  });
};
