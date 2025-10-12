import type { Metadata } from "next";
import DashboardLayout from "@/components/layout/PatientDashboardLayout";
import { adminDashLinks, adminSecondaryDashLinks } from "@/constants/urls";
import { NavList } from "@/types/table.types";

export const metadata: Metadata = {
  title: "MedReserve Admin",
  description: "...Getting you the best care",
};

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      role={"admin"}
      isSecondarySection
      secondaryNavigation={adminSecondaryDashLinks as NavList[]}
      navigation={adminDashLinks as NavList[]}
    >
      {children}
    </DashboardLayout>
  );
}
