import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./appwrite/appwrite";
import { userRoles } from "./constants";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("my-custom-session")?.value;

  const { account } = await createSessionClient();

  const isProtectedRoute = userRoles.some(
    (role) => path.startsWith(`/${role}/`) || path === `/${role}`
  );

  const isAuthRoute = path.startsWith("/auth");

  if (account && token) {
    const credentials = await account.get();

    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(
          `/${credentials?.labels[0]}/${credentials?.$id}/dashboard`,
          request.url
        )
      );
    }

    if (isProtectedRoute) {
       if (!credentials?.emailVerification) {
         return NextResponse.redirect(
           new URL(
             `/${credentials?.labels[0]}/${credentials?.$id}/create-profile`,
             request.url
           )
         );
      }
      
       if (
         !path.startsWith(`/${credentials?.labels[0]}/`) &&
         credentials?.emailVerification
       ) {
         return NextResponse.redirect(
           new URL(
             `/${credentials?.labels[0]}/${credentials?.$id}/dashboard?message=unauthorized`,
             request.url
           )
         );
       }

    }
  }

  if (isProtectedRoute && !token && !account) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("message", "session_expired");
      return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files (extensions)
     * 4. Service workers
     */
    "/((?!api|_next|.*\\.).*)",
  ],
};
