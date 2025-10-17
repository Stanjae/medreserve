import AppoinmentDetailPage from "@/components/boxes/AdminAppoinmentDetailPage";

const Page = async({ params }: { params: Promise<{ slotId: string }> }) => {
    const { slotId } = await params;
  return (
    <div>
          <AppoinmentDetailPage slotId={slotId} />
    </div>
  );
};

export default Page;
