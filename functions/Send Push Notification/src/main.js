// This is an Appwrite Function (server-side)
import { Client, Databases } from "node-appwrite";
import webpush from "web-push";

// This is the main function that Appwrite will execute
export const mainFn = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.NEXT_APPWRITE_KEY);

    const databases = new Databases(client);

    // Configure web-push with VAPID details
    webpush.setVAPIDDetails(
      `mailto:${process.env.EMAIL_USER}`,
      process.env.NEXT_PUBLIC_NOTIFY_PUBLIC_KEY,
      process.env.NOTIFY_PRIVATE_KEY
    );

    // Parse the request data
    const {
      recipientId,
      title,
      body,
      data = {},
      userType,
    } = JSON.parse(req.body);

    log(`Sending notification to ${recipientId}: ${title} ${userType}`);

    // Get user's push subscriptions from database
    let subscriptions = [];

    if (recipientId === "admin") {
      // Get all admin subscriptions
      subscriptions = await getAdminSubscriptions(databases);
    } else {
      // Get specific user's subscriptions
      subscriptions = await getUserSubscriptions(databases, recipientId);
    }

    if (subscriptions.length === 0) {
      log(`No active subscriptions found for ${recipientId}`);
      return res.json({
        success: false,
        message: "No active subscriptions found",
      });
    }

    // Prepare notification payload
    const notificationPayload = {
      title,
      body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: {
        ...data,
        url: getNotificationUrl(data),
        timestamp: new Date().getTime(),
      },
      actions: getNotificationActions(data.type),
      requireInteraction: true,
      tag: data.type || "general",
    };

    // Send notifications to all subscriptions
    const results = await sendToMultipleSubscriptions(
      subscriptions,
      notificationPayload,
      databases,
      log,
      error
    );

    // Log results
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    log(`Notifications sent: ${successful} successful, ${failed} failed`);

    return res.json({
      success: true,
      message: `Sent ${successful} notifications successfully`,
      results: {
        successful,
        failed,
        total: subscriptions.length,
      },
    });
  } catch (err) {
    error("Error sending push notifications:", err);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500
    );
  }
};

// Helper function to get user subscriptions
async function getUserSubscriptions(databases, userId) {
  try {
      const response = await databases.listDocuments(
            process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NOTIFICATION_ID,
      "push_subscriptions",
      [sdk.Query.equal("userId", userId), sdk.Query.equal("isActive", true)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      subscription: JSON.parse(doc.subscription),
      userId: doc.userId,
      userType: doc.userType,
    }));
  } catch (err) {
    console.error("Error getting user subscriptions:", err);
    return [];
  }
}

// Helper function to get admin subscriptions
async function getAdminSubscriptions(databases) {
  try {
      const response = await databases.listDocuments(
            process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NOTIFICATION_ID,
      "push_subscriptions",
      [sdk.Query.equal("userType", "admin"), sdk.Query.equal("isActive", true)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      subscription: JSON.parse(doc.subscription),
      userId: doc.userId,
      userType: doc.userType,
    }));
  } catch (err) {
    console.error("Error getting admin subscriptions:", err);
    return [];
  }
}

// Send notifications to multiple subscriptions
async function sendToMultipleSubscriptions(
  subscriptions,
  payload,
  databases,
  log,
  error
) {
  const promises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify(payload),
        {
          TTL: 24 * 60 * 60, // 24 hours
          urgency: "normal",
        }
      );

      log(`✅ Notification sent successfully to user ${sub.userId}`);
      return { success: true, userId: sub.userId };
    } catch (err) {
      error(
        `❌ Failed to send notification to user ${sub.userId}:`,
        err.message
      );

      // Handle expired subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        await markSubscriptionInactive(databases, sub.id);
        log(`Marked subscription ${sub.id} as inactive (expired)`);
      }

      return { success: false, userId: sub.userId, error: err.message };
    }
  });

  return Promise.all(promises);
}

// Mark subscription as inactive if it's expired
async function markSubscriptionInactive(databases, subscriptionId) {
  try {
      await databases.updateDocument(
            process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NOTIFICATION_ID,
      "push_subscriptions",
      subscriptionId,
      { isActive: false }
    );
  } catch (err) {
    console.error("Error marking subscription inactive:", err);
  }
}

// Get notification actions based on type
function getNotificationActions(type) {
  const commonActions = [
    { action: "view", title: "View", icon: "/view-icon.png" },
    { action: "dismiss", title: "Dismiss", icon: "/dismiss-icon.png" },
  ];

  switch (type) {
    case "new_appointment":
      return [
        { action: "view", title: "View Details", icon: "/view-icon.png" },
        { action: "accept", title: "Accept", icon: "/accept-icon.png" },
        { action: "dismiss", title: "Later", icon: "/dismiss-icon.png" },
      ];
    case "appointment_cancelled":
      return [
        { action: "view", title: "View Details", icon: "/view-icon.png" },
        {
          action: "reschedule",
          title: "Reschedule",
          icon: "/calendar-icon.png",
        },
        { action: "dismiss", title: "OK", icon: "/dismiss-icon.png" },
      ];
    default:
      return commonActions;
  }
}

// Get URL to open when notification is clicked
function getNotificationUrl(data) {
  switch (data.type) {
    case "new_appointment":
    case "appointment_rescheduled":
    case "appointment_confirmation":
      return `/appointments/${data.appointmentId}`;
    case "appointment_cancelled":
      return "/appointments";
    case "admin_notification":
      return "/admin/appointments";
    case "appointment_reminder":
      return `/appointments/${data.appointmentId}`;
    default:
      return "/dashboard";
  }
}
