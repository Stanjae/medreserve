import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/PatientDashboardLayout";
import { patientDashLinks } from "@/constants/urls";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "...Getting you the best care",
};

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      role={"doctor"}
      isSecondarySection={false}
      secondaryNavigation={[]}
      navigation={patientDashLinks}
    >
      {children}
    </DashboardLayout>
  );
}
