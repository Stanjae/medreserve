import DoctorDetails from "@/components/boxes/DoctorDetails";
import MedReserveLoader from "@/components/loaders/MedReserveLoader";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ doctorId: string }> }) => {
  const { doctorId } = await params;
  return (
    <main className="p-1">
      <section className="p-1">
        <div className=" mx-auto max-w-[calc(100%-316px)]">
          <section className=" mt-[150px]">
            <Suspense key={doctorId} fallback={<div className=" flex items-center justify-center"><MedReserveLoader /></div>}>
              <DoctorDetails doctorId={doctorId} />
            </Suspense>
          </section>

          {/* reviews section */}
          
        </div>
      </section>
    </main>
  );
};

export default page;
