/* eslint-disable import/no-anonymous-default-export */
import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const databases = new Databases(client);

   log('Starting cleanup of pending appointments...',);


  try {
    log('Starting cleanup of pending appointments...',);

    // Calculate timestamp for 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const oneHourAgoISO = oneHourAgo.toISOString();

    log(`Looking for appointments created before: ${oneHourAgoISO}`);

    // Query pending appointments created more than 1 hour ago
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_CLUSTER_ID,
      process.env.APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID,
      [
        Query.equal('status', 'pending'),
        Query.lessThan('$createdAt', oneHourAgoISO),
        Query.limit(100), // Process in batches of 100
      ]
    );

    const appointmentsToDelete = response.documents;
    log(`Found ${appointmentsToDelete.length} pending appointments to delete`); 

   if (appointmentsToDelete.length === 0) {
      log('No pending appointments to delete');
      return res.json({
        success: true,
        message: 'No pending appointments found',
        deleted: 0,
      });
    }

    // Delete each appointment
    const deletionPromises = appointmentsToDelete.map(async (appointment) => {
      try {
        await databases.deleteDocument(
          process.env.APPWRITE_DATABASE_CLUSTER_ID,
          process.env.APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID,
          appointment.$id
        );
        log(`Deleted appointment: ${appointment.$id}`);
        return { id: appointment.$id, success: true };
      } catch (err) {
        error(
          `Failed to delete appointment ${appointment.$id}: ${err.message}`
        );
        return { id: appointment.$id, success: false, error: err.message };
      }
    });

    await Promise.all(deletionPromises);
    log(`Cleanup completed:  deleted, failed`);

    return res.json({
      success: true,
      message: 'Cleanup completed',
    });
  } catch (err) {
    error(`Error during cleanup: ${err.message}`);
    return res.json(
      {
        success: false,
        error: err.message,
      }
    );
  }
};
