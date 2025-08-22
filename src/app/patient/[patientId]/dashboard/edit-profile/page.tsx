"use client";
import { useState } from "react";
import { notifyNewAppointment } from "@/lib/notificationSystem/config";
import NotificationSetup from "@/components/notifications/NotificationSetup";
import { useMedStore } from "@/providers/med-provider";

export default function Page() {
  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    patientId: "", // You'll get this from your auth system
    appointmentDate: "",
    appointmentTime: "",
    // ... other fields
  });
    
    const {credentials} = useMedStore(state => state);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    try {
      // 1. Save appointment to database first
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const newAppointment = await response.json();

      // 2. Send notifications
      await notifyNewAppointment(newAppointment);

      alert("Appointment booked successfully! Notifications sent.");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  };

    return (
        <div>
            <NotificationSetup userId={credentials?.userId} userType={'patient'}/>
                <form onSubmit={handleBookAppointment}>
      {/* Your appointment booking form */}
      <button type="submit">Book Appointment</button>
    </form>
      </div>

  );
}
