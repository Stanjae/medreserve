import EditProfileForm from "@/components/forms/EditProfileForm";

const page = async ({ params }: { params: Promise<{ patientId: string }> }) => {
  const { patientId } = await params;
  return (
    <div>
      <EditProfileForm userId={patientId} />
    </div>
  );
};

export default page;
