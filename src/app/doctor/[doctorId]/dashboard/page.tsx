import DoctorDashboardPage from "@/components/organisms/dashboard/DoctorDashboardPage";

const Page = async ({ params }: { params: Promise<{ doctorId: string }> }) => {
  const { doctorId } = await params;
  return <DoctorDashboardPage doctorId={doctorId} />;
};

export default Page;
