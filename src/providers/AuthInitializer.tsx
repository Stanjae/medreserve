"use client";

import { useEffect, useRef } from "react";
import { useMedStore } from "@/providers/med-provider";
import { AuthCredentials, AdminPermissions, AdminPermissionsTypes } from "@/types/store.types";

type Props = {
  auth: {
    credentials: AuthCredentials;
    permissions: AdminPermissions | null;
  } | null;
};

export default function AuthInitializer({ auth }: Props) {
  const initialized = useRef(false);
    const {
      setAuthCredentials,
      clearAuthCredentials,
      setAdminPermissions,
      clearAdminPermissions,
    } = useMedStore((state) => state);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    if (auth) {
      setAuthCredentials(auth.credentials);

      if (auth.permissions) {
        const permissionData = auth.permissions.permissions ? JSON.parse(auth.permissions.permissions ?? '') : null;
         setAdminPermissions({...auth.permissions, permissions: permissionData } as AdminPermissionsTypes);
      }
    } else {
      clearAuthCredentials();
      clearAdminPermissions();
    }
  }, [auth, setAuthCredentials, clearAuthCredentials, clearAdminPermissions, setAdminPermissions]); 

  return null; // Renders nothing
}