import CreateAppointmentForm from "@/components/forms/CreateAppointmentForm";
import React from "react";

const page = async ({ params }: { params: Promise<{ doctorId: string }> }) => {
  const { doctorId } = await params;
  return (
    <main>
      <section className=" py-[40px] space-y-5 px-[50px] rounded-xl border border-cyan-200">
        <CreateAppointmentForm doctorId={doctorId}/>
      </section>
    </main>
  );
};

export default page;
