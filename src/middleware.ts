import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./appwrite/appwrite";
import { userRoles } from "./constants";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define route types
  const isProtectedRoute = userRoles.some(
    (role) => path.startsWith(`/${role}/`) || path === `/${role}`
  );
  const isAuthRoute = path.startsWith("/auth");
  const isOnCreateProfile = path.includes("/create-profile");

  // Try to get the current user session
  let credentials = null;
  let hasSession = false;

  try {
    const { account } = await createSessionClient();
    credentials = await account?.get();
    hasSession = true;
  } catch (error) {
    // No valid session - user is not authenticated
    console.error(error);
    hasSession = false;
  }

  // Handle authenticated users
  if (hasSession && credentials) {
    const userRole = credentials.labels?.[0];
    const userId = credentials.$id;
    const isEmailVerified = credentials.emailVerification;

    // Redirect authenticated users away from auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(`/${userRole}/${userId}/dashboard`, request.url)
      );
    }

    // Handle protected routes for authenticated users
    if (isProtectedRoute) {
      // Force email verification by redirecting to create-profile
      if (!isEmailVerified && !isOnCreateProfile) {
        return NextResponse.redirect(
          new URL(`/${userRole}/${userId}/create-profile`, request.url)
        );
      }

      // Redirect verified users away from create-profile
      if (isEmailVerified && isOnCreateProfile) {
        return NextResponse.redirect(
          new URL(`/${userRole}/${userId}/dashboard`, request.url)
        );
      }

      // Check if user is accessing their own role's routes
      if (!path.startsWith(`/${userRole}/`) && isEmailVerified) {
        return NextResponse.redirect(
          new URL(
            `/${userRole}/${userId}/dashboard?message=unauthorized`,
            request.url
          )
        );
      }
    }
  }

  // Handle unauthenticated users
  if (!hasSession) {
    // Redirect to login if trying to access protected routes
    if (isProtectedRoute) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("message", "session_expired");
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files (extensions)
     * 4. Root path "/"
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
