import type { Metadata } from "next";

import DashboardLayout from "@/components/layout/PatientDashboardLayout";
import { patientDashLinks } from "@/constants/Toplinks";

export const metadata: Metadata = {
  title: "Patient Dashboard",
  description: "...Getting you the best care",
};


export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
   <DashboardLayout role={'patient'} navigation={patientDashLinks}>{children}</DashboardLayout>
  );
}
