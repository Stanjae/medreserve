import PatientDashboardPage from "@/components/organisms/dashboard/PatientDashboardPage";

const Page = async ({ params }: { params: Promise<{ patientId: string }> }) => {
  const { patientId } = await params;
  return <PatientDashboardPage patientId={patientId} />;
};

export default Page;
