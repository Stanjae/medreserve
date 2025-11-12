import React from "react";
import PaymentForm from "@/components/forms/PaymentForm";
import { fetchCurrentBookingSlot } from "@/lib/actions/patientGetActions";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ doctorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { doctorId } = await params;
  const slotId = (await searchParams).slotId;

  const response = await fetchCurrentBookingSlot(slotId as string);

  return (
    <main>
      <section className=" py-[40px] space-y-5 px-[25px] md:px-[50px] rounded-xl border border-cyan-200">
        <PaymentForm slotId={slotId as string} response={response} doctorId={doctorId} />
      </section>
    </main>
  );
};

export default page;
