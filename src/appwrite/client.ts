import { Client, Account, Databases, Storage, Functions } from "appwrite";

/* const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setDevKey(process.env.NEXT_APPWRITE_DEV_KEY!); */

export async function accountClient()  {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setDevKey(process.env.NEXT_APPWRITE_DEV_KEY!);
  return {
    get account() {
      return new Account(client);
    },

    get storage() {
      return new Storage(client);
    },

    get database() {
      return new Databases(client);
      },
    
      get functions() {
        return new Functions(client);
       }
  };
}
export { ID } from "appwrite";