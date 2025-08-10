import CancelAppointmentForm from '@/components/forms/CancelAppointmentForm'
import { getCurrentAppointmentForCancelSlot } from '@/lib/actions/getActions';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const slotId = (await searchParams).slotId;
    if (!slotId) notFound();
    const response = await getCurrentAppointmentForCancelSlot(slotId as string);
  return (
    <div>
      <CancelAppointmentForm appointment={response} />
    </div>
  );
};

export default page