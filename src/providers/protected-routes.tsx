"use client";
import { userRoles } from "@/constants";
import { AdminPermissions, AdminPermissionsTypes, AuthCredentials } from "@/types/store.types";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useMedStore } from "./med-provider";
import { clearCookies } from "@/lib/actions/authActions";

type AuthenticatedRouteProps = {
  auth: {
    credentials: AuthCredentials;
    permissions: AdminPermissions | null;
  } | null;
  children: React.ReactNode;
};

const ProtectedRoutes = ({ children, auth }: AuthenticatedRouteProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    setAuthCredentials,
    clearAuthCredentials,
    setAdminPermissions,
    clearAdminPermissions,
  } = useMedStore((state) => state);

  useEffect(() => {
    const handleProtectedRoutes = async () => {
      const isProtectedRoute = userRoles.some(
        (role) => pathname.startsWith(`/${role}/`) || pathname === `/${role}`
      );
      if (!auth && isProtectedRoute) {
        clearCookies();
        clearAuthCredentials();
        clearAdminPermissions();
        toast.error("Session expired. Redirecting to login...");
        window.location.replace("/auth/login");
        return;
      }

      if (auth) {
        const permissionData = auth.permissions ? JSON.parse(auth.permissions.permissions) : null;
        setAuthCredentials(auth?.credentials);
        setAdminPermissions({...auth.permissions, permissions: permissionData } as AdminPermissionsTypes);
        if (isProtectedRoute && !pathname.includes(auth?.credentials?.role)) {
          router.back();
        }

        if (isProtectedRoute && !auth?.credentials?.emailVerified) {
          router.push(
            `/${auth?.credentials?.role}/${auth?.credentials?.userId}/create-profile`
          );
        }

        if (pathname.includes("auth")) {
          router.push(
            `/${auth?.credentials?.role}/${auth?.credentials?.userId}/dashboard`
          );
        }
      }
    };
    handleProtectedRoutes();
  }, [
    auth,
    pathname,
    setAuthCredentials,
    setAdminPermissions,
    router,
    clearAuthCredentials,
    clearAdminPermissions,
  ]);

  return <div>{children}</div>;
};

export default ProtectedRoutes;
