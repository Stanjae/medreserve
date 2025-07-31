import { createAdminClient } from "@/appwrite/appwrite";
import { Query } from "node-appwrite";
import type { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
  // Verify the request is from your cron service (optional)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

    try {
      const { database } = await createAdminClient();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const expiredAppointments = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
      process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
      [
        Query.equal("status", "pending"),
        Query.lessThanEqual("$createdAt", oneHourAgo),
      ]
    );

    const deletePromises = expiredAppointments.documents.map((appointment) =>
      database.deleteDocument(
         process.env.NEXT_APPWRITE_DATABASE_CLUSTER_ID!,
    process.env.NEXT_APPWRITE_DATABASE_COLLECTION_APPOINTMENT_ID!,
        appointment.$id
      )
    );

    await Promise.all(deletePromises);

    return Response.json({
      success: true,
      deleted: expiredAppointments.documents.length,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
