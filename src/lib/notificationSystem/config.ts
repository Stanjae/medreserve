"use client";
import { accountClient, ID } from "@/appwrite/client";
import { ROLES } from "@/types/store.types";

// 1. REQUEST PERMISSION AND SUBSCRIBE USER
export async function requestNotificationPermission() {
  // Check if browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  // Request permission
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted");
    return true;
  } else {
    console.log("Notification permission denied");
    return false;
  }
}

// 2. SUBSCRIBE USER TO PUSH NOTIFICATIONS
export async function subscribeUserToPush(userId: string, userType: ROLES) {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_NOTIFY_PUBLIC_KEY!
      ),
    });

    // Save subscription to Appwrite database
    await saveSubscription(userId, userType, subscription);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    throw error;
  }
}

// 3. SAVE SUBSCRIPTION TO DATABASE
async function saveSubscription(
  userId: string,
  userType: ROLES,
  subscription: unknown
) {
  try {
    const uniqueID = ID.unique();
    const { database } = await accountClient();
    const subscriptionData = {
      userId,
      userType,
      subscription: JSON.stringify(subscription),
      isActive: true,
    };

    await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_KEY!,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NOTIFICATION_ID!,
      uniqueID,
      {
        ...subscriptionData,
      }
    );
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
}

// 4. SEND NOTIFICATION FUNCTION
export async function sendNotification(
  recipientId: string,
  title: string,
  body,
  data = {},
  userType: ROLES
) {
  try {
    const payload = {
      recipientId,
      title,
      body,
      data,
      userType,
    };

    const { functions } = await accountClient();
    console.log("Sending notification:", payload);

    const execution = await functions.createExecution(
      "send-push-notification", // Function ID
      JSON.stringify(payload), // Data to send
      false, // Async execution
      "/send-push-notification" // Path (optional)
    );

    console.log("Notification function executed:", execution);
    return execution;
  } catch (error) {
    console.error("Error calling notification function:", error);
    throw error;
  }
}

// ============================================================================
// Enhanced notification workflows with better error handling
// ============================================================================

// Enhanced appointment notification functions
export async function notifyNewAppointment(appointmentData) {
  const {
    doctorId,
    patientId,
    appointmentDate,
    appointmentTime,
    doctorName,
    patientName,
  } = appointmentData;

  try {
    // Notify doctor
    await sendNotification(
      doctorId,
      "New Appointment Booked",
      `${patientName} booked an appointment for ${appointmentDate} at ${appointmentTime}`,
      {
        type: "new_appointment",
        appointmentId: appointmentData.id,
        patientId,
        appointmentDate,
        appointmentTime,
        action: "view_appointment",
      },
      "doctor"
    );

    // Notify admin
    await sendNotification(
      "admin",
      "New Appointment Created",
      `New appointment: ${patientName} with Dr. ${doctorName} on ${appointmentDate}`,
      {
        type: "admin_notification",
        appointmentId: appointmentData.id,
        doctorId,
        patientId,
        action: "manage_appointment",
      },
      "admin"
    );

    // Confirm to patient
    await sendNotification(
      patientId,
      "Appointment Confirmed ✅",
      `Your appointment with Dr. ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}`,
      {
        type: "appointment_confirmation",
        appointmentId: appointmentData.id,
        doctorId,
        appointmentDate,
        appointmentTime,
        action: "view_appointment",
      },
      "patient"
    );

    console.log("All appointment notifications sent successfully");
  } catch (error) {
    console.error("Error sending appointment notifications:", error);
    throw error;
  }
}

// 5. NOTIFICATION WORKFLOWS FOR APPOINTMENTS

// When admin reschedules appointment
export async function notifyAppointmentRescheduled(appointmentData) {
  const { patientId, doctorId, oldDate, newDate, oldTime, newTime } =
    appointmentData;

  // Notify patient
  await sendNotification(
    patientId,
    "Appointment Rescheduled",
    `Your appointment has been moved from ${oldDate} ${oldTime} to ${newDate} ${newTime}`,
    {
      type: "appointment_rescheduled",
      appointmentId: appointmentData.id,
      action: "view_appointment",
    },
    "patient"
  );

  // Notify doctor
  await sendNotification(
    doctorId,
    "Appointment Rescheduled",
    `Appointment rescheduled to ${newDate} at ${newTime}`,
    {
      type: "appointment_rescheduled",
      appointmentId: appointmentData.id,
      action: "view_appointment",
    },
    "doctor"
  );
}

// 6. UTILITY FUNCTIONS

// Convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Unsubscribe user
export async function unsubscribeUser(userId: string) {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Mark as inactive in database
        // You'll need to implement this query based on your database structure
        console.log("User unsubscribed successfully");
      }
    }
  } catch (error) {
    console.error("Error unsubscribing user:", error);
  }
}
// When appointment is cancelled
export async function notifyAppointmentCancelled(
  appointmentData,
  cancelledBy = "admin"
) {
  const {
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason,
    doctorName,
    patientName,
  } = appointmentData;

  try {
    // Notify patient
    await sendNotification(
      patientId,
      "Appointment Cancelled ❌",
      `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} has been cancelled. ${reason || ""}`,
      {
        type: "appointment_cancelled",
        appointmentId: appointmentData.id,
        doctorId,
        reason,
        cancelledBy,
        action: "book_new_appointment",
      },
      "patient"
    );

    // Notify doctor (if cancelled by admin)
    if (cancelledBy === "admin") {
      await sendNotification(
        doctorId,
        "Appointment Cancelled",
        `Appointment with ${patientName} on ${appointmentDate} at ${appointmentTime} has been cancelled by admin`,
        {
          type: "appointment_cancelled",
          appointmentId: appointmentData.id,
          patientId,
          reason,
          cancelledBy,
          action: "view_schedule",
        },
        "doctor"
      );
    }

    // Notify admin (if cancelled by doctor or patient)
    if (cancelledBy !== "admin") {
      await sendNotification(
        "admin",
        "Appointment Cancelled by " + cancelledBy,
        `${patientName}'s appointment with Dr. ${doctorName} has been cancelled`,
        {
          type: "admin_notification",
          appointmentId: appointmentData.id,
          cancelledBy,
          reason,
          action: "manage_appointments",
        },
        "admin"
      );
    }
  } catch (error) {
    console.error("Error sending cancellation notifications:", error);
    throw error;
  }
}
