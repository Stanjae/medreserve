// This function runs on a schedule to send appointment reminders
import { Client, Databases, Functions } from 'node-appwrite';

module.exports = async ({ req, res, log, error }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.NEXT_APPWRITE_KEY);

    const databases = new Databases(client);
    const functions = new Functions(client);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const oneHourFromNow = new Date(now);
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

    log('Running appointment reminder check at:', now.toISOString());

    // Get appointments that need reminders
    const appointmentsToRemind = await getAppointmentsNeedingReminders(
      databases,
      tomorrow,
      oneHourFromNow
    );

    if (appointmentsToRemind.length === 0) {
      log('No appointments need reminders right now');
      return res.json({ success: true, message: 'No reminders needed' });
    }

    // Send reminders
    let remindersSent = 0;
    for (const appointment of appointmentsToRemind) {
      try {
        await sendAppointmentReminder(appointment, functions, databases, log);
        remindersSent++;
      } catch (err) {
        error('Error sending reminder for appointment', appointment.$id, err);
      }
    }

    log(`Sent ${remindersSent} appointment reminders`);
    return res.json({
      success: true,
      message: `Sent ${remindersSent} reminders`,
      remindersSent,
    });
  } catch (err) {
    error('Error in appointment reminder function:', err);
    return res.json({ success: false, error: err.message }, 500);
  }
};

// Get appointments that need reminders
async function getAppointmentsNeedingReminders(
  databases,
  tomorrow,
  oneHourFromNow
) {
  try {
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
    //const oneHourStr = oneHourFromNow.toISOString();

    // Get appointments for tomorrow (24-hour reminder)
    const tomorrowAppointments = await databases.listDocuments(
      process.env.DATABASE_ID,
      'appointments',
      [
        sdk.Query.equal('appointmentDate', tomorrowStr),
        sdk.Query.equal('status', 'approved'),
        sdk.Query.equal('reminderSent24h', false),
      ]
    );

    // Get appointments in 1 hour (1-hour reminder)
    const oneHourAppointments = await databases.listDocuments(
      process.env.DATABASE_ID,
      'appointments',
      [
        sdk.Query.greaterThan(
          'appointmentDateTime',
          oneHourFromNow.toISOString()
        ),
        sdk.Query.lessThan(
          'appointmentDateTime',
          new Date(oneHourFromNow.getTime() + 30 * 60000).toISOString()
        ), // 30 min window
        sdk.Query.equal('status', 'confirmed'),
        sdk.Query.equal('reminderSent1h', false),
      ]
    );

    // Combine and mark reminder type
    const allReminders = [
      ...tomorrowAppointments.documents.map((apt) => ({
        ...apt,
        reminderType: '24h',
      })),
      ...oneHourAppointments.documents.map((apt) => ({
        ...apt,
        reminderType: '1h',
      })),
    ];

    return allReminders;
  } catch (err) {
    console.error('Error getting appointments for reminders:', err);
    return [];
  }
}

// Send appointment reminder
async function sendAppointmentReminder(appointment, functions, databases, log) {
  try {
    // Get doctor and patient details
    const [doctorDetails, patientDetails] = await Promise.all([
      getUserDetails(databases, appointment.doctorId, 'doctors'),
      getUserDetails(databases, appointment.patientId, 'patients'),
    ]);

    if (!doctorDetails || !patientDetails) {
      log('Missing doctor or patient details for reminder');
      return;
    }

    const reminderTime =
      appointment.reminderType === '24h' ? '24 hours' : '1 hour';
    const appointmentDateTime = `${formatDate(appointment.appointmentDate)} at ${appointment.appointmentTime}`;

    // Send reminder to patient
    await callNotificationFunction(functions, {
      recipientId: appointment.patientId,
      title: `Appointment Reminder ⏰`,
      body: `Your appointment with Dr. ${doctorDetails.name} is in ${reminderTime} (${appointmentDateTime})`,
      data: {
        type: 'appointment_reminder',
        appointmentId: appointment.$id,
        doctorName: doctorDetails.name,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reminderType: appointment.reminderType,
        action: 'view_appointment',
      },
      userType: 'patient',
    });

    // Send reminder to doctor (only for 1-hour reminders)
    if (appointment.reminderType === '1h') {
      await callNotificationFunction(functions, {
        recipientId: appointment.doctorId,
        title: `Upcoming Appointment ⏰`,
        body: `You have an appointment with ${patientDetails.name} in 1 hour (${appointmentDateTime})`,
        data: {
          type: 'appointment_reminder',
          appointmentId: appointment.$id,
          patientName: patientDetails.name,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          reminderType: '1h',
          action: 'view_appointment',
        },
        userType: 'doctor',
      });
    }

    // Mark reminder as sent
    const updateField =
      appointment.reminderType === '24h' ? 'reminderSent24h' : 'reminderSent1h';
    await databases.updateDocument(
      process.env.DATABASE_ID,
      'appointments',
      appointment.$id,
      { [updateField]: true }
    );

    log(
      `${appointment.reminderType} reminder sent for appointment ${appointment.$id}`
    );
  } catch (err) {
    console.error('Error sending appointment reminder:', err);
  }
}

// Helper functions (same as trigger function)
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================================
// DEPLOYMENT SETUP COMMANDS
// ============================================================================

/*

1. CREATE AND DEPLOY THE TRIGGER FUNCTION:
-------------------------------------------

# Create the appointment triggers function
appwrite functions create \
  --functionId="appointment-triggers" \
  --name="Appointment Database Triggers" \
  --runtime="node-18.0" \
  --events=["databases.*.collections.appointments.documents.*.create","databases.*.collections.appointments.documents.*.update","databases.*.collections.appointments.documents.*.delete"]

# Deploy the function
appwrite functions deploy --functionId="appointment-triggers"


2. CREATE AND DEPLOY THE REMINDER FUNCTION:
--------------------------------------------

# Create the reminder function  
appwrite functions create 
  --functionId="appointment-reminders" 
  --name="Appointment Reminders" 
  --runtime="node-18.0" 
  --schedule="0 */

/*# Deploy the function
appwrite functions deploy --functionId="appointment-reminders"


3. REQUIRED ENVIRONMENT VARIABLES (for both functions):
-------------------------------------------------------
APPWRITE_FUNCTION_ENDPOINT=https://your-appwrite-endpoint.com/v1
APPWRITE_FUNCTION_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
DATABASE_ID=your-database-id


4. REQUIRED DATABASE COLLECTIONS:
----------------------------------

appointments collection should have these fields:
- doctorId (string)
- patientId (string) 
- appointmentDate (string, YYYY-MM-DD format)
- appointmentTime (string)
- appointmentDateTime (datetime, for precise scheduling)
- status (string: 'pending', 'confirmed', 'cancelled', 'completed')
- reminderSent24h (boolean, default: false)
- reminderSent1h (boolean, default: false)
- isRescheduled (boolean, default: false)
- cancelledBy (string, optional)
- cancellationReason (string, optional)
- rescheduledBy (string, optional)

doctors collection:
- name (string)
- email (string)
- specialization (string)

patients collection:
- name (string)  
- email (string)
- phone (string)


5. TESTING THE TRIGGERS:
------------------------

# Test by creating an appointment in your database
# The trigger function will automatically fire and send notifications

Test reminders by creating an appointment for tomorrow
The reminder function runs every 15 minutes and will send reminders

*/
