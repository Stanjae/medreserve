import { DoctorAvailability } from "../../types/appwrite";

export type TgetDoctorDetailsOnBooking = {
  fullname: string;
  profilePicture: string;
  specialization: string;
    ratingCount: number;
  avgRating: number;
    doctorAvailability: DoctorAvailability;
};