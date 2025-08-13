"use client";
import { userRoles } from "@/constants";
import { AuthCredentials } from "@/types/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useMedStore } from "./med-provider";
import { clearCookies } from "@/lib/actions/actions";

const ProtectedRoutes = ({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: AuthCredentials | null;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const { setAuthCredentials, clearAuthCredentials } = useMedStore(
    (state) => state
  );

  useEffect(() => {
    const handleProtectedRoutes = async () => {
      const isProtectedRoute = userRoles.some(
        (role) => pathname.startsWith(`/${role}/`) || pathname === `/${role}`
      );
      if (!auth && isProtectedRoute) {
        clearCookies();
        clearAuthCredentials();
        toast.error("Session expired. Redirecting to login...");
        window.location.replace ("/auth/login");
        return;
      }

      if (auth) {
        setAuthCredentials(auth);
        if (
          isProtectedRoute &&
          !pathname.includes(auth?.role)
        ) {
          router.back();
        }

        if (pathname.includes("auth")) {
          router.push(`/${auth?.role}/${auth?.userId}/dashboard`);
        }
      }
    };
    handleProtectedRoutes();
  }, [auth, pathname]);

  return <div>{children}</div>;
};

export default ProtectedRoutes;
