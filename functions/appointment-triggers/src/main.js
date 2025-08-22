// functions/appointment-triggers/src/main.js
import { Client, Databases, Functions } from "node-appwrite";

export const appointmentTriggers = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.NEXT_APPWRITE_KEY);

    const databases = new Databases(client);
    const functions = new Functions(client);

    // Parse the trigger event data
    const eventData = JSON.parse(req.body);
    const { events, userId } = req.headers;

    log('Trigger event received:', { events, eventData: eventData });

    // Determine what kind of database event this is
    const eventType = events[0]; // e.g., "databases.*.collections.*.documents.*.create"

    // Handle different types of appointment events
    if (eventType.includes('documents.*.create')) {
      await handleAppointmentCreated(eventData, functions, databases, log);
    } else if (eventType.includes('documents.*.update')) {
      await handleAppointmentUpdated(eventData, functions, databases, log);
    } else if (eventType.includes('documents.*.delete')) {
      await handleAppointmentDeleted(eventData, functions, databases, log);
    }

    return res.json({
      success: true,
      message: 'Trigger processed successfully',
    });
  } catch (err) {
    error('Error processing trigger:', err);
    return res.json({ success: false, error: err.message }, 500);
  }
};

// Handle new appointment creation
async function handleAppointmentCreated(
  appointmentData,
  functions,
  databases,
  log
) {
  try {
    log('Processing new appointment creation');

    // Get doctor and patient details
    const doctorDetails = await getUserDetails(
      databases,
      appointmentData.doctorId,
      'doctors'
    );
    const patientDetails = await getUserDetails(
      databases,
      appointmentData.patientId,
      'patients'
    );

    if (!doctorDetails || !patientDetails) {
      log('Could not find doctor or patient details');
      return;
    }

    // Send notification to doctor
    await callNotificationFunction(functions, {
      recipientId: appointmentData.doctorId,
      title: 'New Appointment Booked 📅',
      body: `${patientDetails.name} booked an appointment for ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime}`,
      data: {
        type: 'new_appointment',
        appointmentId: appointmentData.$id,
        patientId: appointmentData.patientId,
        patientName: patientDetails.name,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        action: 'view_appointment',
      },
      userType: 'doctor',
    });

    // Send notification to admin
    await callNotificationFunction(functions, {
      recipientId: 'admin',
      title: 'New Appointment Created 🏥',
      body: `${patientDetails.name} booked with Dr. ${doctorDetails.name} on ${formatDate(appointmentData.appointmentDate)}`,
      data: {
        type: 'admin_notification',
        appointmentId: appointmentData.$id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        doctorName: doctorDetails.name,
        patientName: patientDetails.name,
        action: 'manage_appointment',
      },
      userType: 'admin',
    });

    // Send confirmation to patient
    await callNotificationFunction(functions, {
      recipientId: appointmentData.patientId,
      title: 'Appointment Confirmed ✅',
      body: `Your appointment with Dr. ${doctorDetails.name} is confirmed for ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime}`,
      data: {
        type: 'appointment_confirmation',
        appointmentId: appointmentData.$id,
        doctorId: appointmentData.doctorId,
        doctorName: doctorDetails.name,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        action: 'view_appointment',
      },
      userType: 'patient',
    });

    log('All notifications sent for new appointment');
  } catch (err) {
    log('Error handling appointment creation:', err);
  }
}

// Handle appointment updates (reschedule, status changes)
async function handleAppointmentUpdated(
  appointmentData,
  functions,
  databases,
  log
) {
  try {
    log('Processing appointment update');

    // Get the previous version to compare changes
    // Note: You might want to store previous values in a separate field or collection

    const doctorDetails = await getUserDetails(
      databases,
      appointmentData.doctorId,
      'doctors'
    );
    const patientDetails = await getUserDetails(
      databases,
      appointmentData.patientId,
      'patients'
    );

    // Check if appointment was rescheduled
    if (appointmentData.isRescheduled) {
      await handleAppointmentRescheduled(
        appointmentData,
        doctorDetails,
        patientDetails,
        functions,
        log
      );
    }

    // Check if status changed (confirmed, cancelled, completed)
    if (appointmentData.status === 'cancelled') {
      await handleAppointmentCancelled(
        appointmentData,
        doctorDetails,
        patientDetails,
        functions,
        log
      );
    }

    // Check if appointment was confirmed by doctor
    if (
      appointmentData.status === 'confirmed' &&
      appointmentData.confirmedBy === 'doctor'
    ) {
      await callNotificationFunction(functions, {
        recipientId: appointmentData.patientId,
        title: 'Appointment Confirmed by Doctor ✅',
        body: `Dr. ${doctorDetails.name} confirmed your appointment for ${formatDate(appointmentData.appointmentDate)}`,
        data: {
          type: 'doctor_confirmation',
          appointmentId: appointmentData.$id,
          doctorName: doctorDetails.name,
          action: 'view_appointment',
        },
        userType: 'patient',
      });
    }
  } catch (err) {
    log('Error handling appointment update:', err);
  }
}

// Handle appointment rescheduling
async function handleAppointmentRescheduled(
  appointmentData,
  doctorDetails,
  patientDetails,
  functions,
  log
) {
  // Notify patient about reschedule
  await callNotificationFunction(functions, {
    recipientId: appointmentData.patientId,
    title: 'Appointment Rescheduled 📅',
    body: `Your appointment with Dr. ${doctorDetails.name} has been moved to ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime}`,
    data: {
      type: 'appointment_rescheduled',
      appointmentId: appointmentData.$id,
      doctorName: doctorDetails.name,
      newDate: appointmentData.appointmentDate,
      newTime: appointmentData.appointmentTime,
      action: 'view_appointment',
    },
    userType: 'patient',
  });

  // Notify doctor if rescheduled by admin
  if (appointmentData.rescheduledBy === 'admin') {
    await callNotificationFunction(functions, {
      recipientId: appointmentData.doctorId,
      title: 'Appointment Rescheduled by Admin',
      body: `Your appointment with ${patientDetails.name} has been rescheduled to ${formatDate(appointmentData.appointmentDate)}`,
      data: {
        type: 'appointment_rescheduled',
        appointmentId: appointmentData.$id,
        patientName: patientDetails.name,
        action: 'view_schedule',
      },
      userType: 'doctor',
    });
  }

  log('Reschedule notifications sent');
}

// Handle appointment cancellation
async function handleAppointmentCancelled(
  appointmentData,
  doctorDetails,
  patientDetails,
  functions,
  log
) {
  const cancelledBy = appointmentData.cancelledBy || 'admin';

  // Notify patient
  await callNotificationFunction(functions, {
    recipientId: appointmentData.patientId,
    title: 'Appointment Cancelled ❌',
    body: `Your appointment with Dr. ${doctorDetails.name} on ${formatDate(appointmentData.appointmentDate)} has been cancelled. ${appointmentData.cancellationReason || ''}`,
    data: {
      type: 'appointment_cancelled',
      appointmentId: appointmentData.$id,
      doctorName: doctorDetails.name,
      reason: appointmentData.cancellationReason,
      cancelledBy,
      action: 'book_new_appointment',
    },
    userType: 'patient',
  });

  // Notify doctor if cancelled by admin
  if (cancelledBy === 'admin') {
    await callNotificationFunction(functions, {
      recipientId: appointmentData.doctorId,
      title: 'Appointment Cancelled by Admin',
      body: `Your appointment with ${patientDetails.name} on ${formatDate(appointmentData.appointmentDate)} has been cancelled`,
      data: {
        type: 'appointment_cancelled',
        appointmentId: appointmentData.$id,
        patientName: patientDetails.name,
        cancelledBy,
        action: 'view_schedule',
      },
      userType: 'doctor',
    });
  }

  // Always notify admin about cancellations
  if (cancelledBy !== 'admin') {
    await callNotificationFunction(functions, {
      recipientId: 'admin',
      title: `Appointment Cancelled by ${cancelledBy}`,
      body: `${patientDetails.name}'s appointment with Dr. ${doctorDetails.name} has been cancelled`,
      data: {
        type: 'admin_notification',
        appointmentId: appointmentData.$id,
        cancelledBy,
        reason: appointmentData.cancellationReason,
        action: 'manage_appointments',
      },
      userType: 'admin',
    });
  }

  log('Cancellation notifications sent');
}

// Handle appointment deletion
async function handleAppointmentDeleted(
  appointmentData,
  functions,
  databases,
  log
) {
  // Similar to cancellation but more permanent
  log('Appointment deleted, sending notifications...');

  // You might want to implement similar logic to cancellation
  // but with different messaging indicating the appointment was deleted
}

// Helper function to get user details
async function getUserDetails(databases, userId, collectionName) {
  try {
    const user = await databases.getDocument(
      process.env.DATABASE_ID,
      collectionName,
      userId
    );
    return user;
  } catch (err) {
    console.error(`Error getting user details from ${collectionName}:`, err);
    return null;
  }
}

// Helper function to call the notification function
async function callNotificationFunction(functions, notificationData) {
  try {
    await functions.createExecution(
      'send-push-notification',
      JSON.stringify(notificationData)
    );
  } catch (err) {
    console.error('Error calling notification function:', err);
  }
}

// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
