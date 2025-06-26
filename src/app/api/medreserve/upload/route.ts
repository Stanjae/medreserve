import { createAdminClient } from "@/appwrite/appwrite";
import { NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file"

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Initialize Appwrite client
  const {storage} = await createAdminClient()

  // Upload to Appwrite Storage
  try {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      ID.unique(),
      InputFile.fromBuffer(buffer, file.name),
      [
        // Set public read permission
        Permission.read(Role.any())
      ]
    );
    const urlResolved = `https://fra.cloud.appwrite.io/v1/storage/buckets/${response?.bucketId}/files/${response?.$id}/view?project=684b3c5600261b4fa7ca`
    return NextResponse.json({ ok: true, fileUrl: urlResolved });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
