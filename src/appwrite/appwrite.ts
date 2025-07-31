// src/lib/server/appwrite.js
"use server";
import { Client, Account, Users, Storage, Databases } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient(): Promise<{
  account: Account | null;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const sessionCookie = await cookies()
  const session = sessionCookie.get("my-custom-session");
  if (!session || !session.value) {
   return { account: null };
  }

  client.setSession(session?.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}



export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },

    get users() {
      return new Users(client);
    },

    get storage() {
      return new Storage(client);
    },

    get database() {
      return new Databases(client);
    },
  };
}




