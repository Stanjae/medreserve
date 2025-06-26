import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setDevKey(process.env.NEXT_APPWRITE_DEV_KEY!);

export const accountClient = new Account(client);
export {ID} from "appwrite";