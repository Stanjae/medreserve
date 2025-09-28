"use client";
import usePageButtons from "@/hooks/usePageButtons";
import { useMedStore } from "@/providers/med-provider";
import { checkPermission } from "@/utils/utilsFn";
import { useMemo } from "react";
import AUsersTable from "../dataTable/AUsersTable";
import { usePathname, useRouter } from "next/navigation";

const UsersBox = () => {
  const { adminPermissions } = useMedStore((state) => state);
  const router = useRouter();
  const pathname = usePathname();
  const isAllowed = useMemo(
    () =>
      checkPermission(
        adminPermissions?.permissions &&
          JSON.parse((adminPermissions?.permissions as string) ?? ""),
        "users",
        "add_user"
      ),
    [adminPermissions]
  );
  usePageButtons(
    !isAllowed
      ? null
      : [
          {
            type: "menu",
            label: "Create User",
            triggerProps: { size: "md", radius: 35 },
            items: [
              {
                label: "Patient",
                action: () => router.push(`${pathname}/create#patient`),
              },
              {
                label: "Doctor",
                action: () => router.push(`${pathname}/create#doctor`),
              },
              {
                label: "Admin",
                action: () => router.push(`${pathname}/create#admin`),
              },
            ],
          },
        ]
  );
  return (
    <div>
      <AUsersTable />
    </div>
  );
};

export default UsersBox;
