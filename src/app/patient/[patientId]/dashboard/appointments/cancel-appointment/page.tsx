import CancelAppointmentForm from '@/components/forms/CancelAppointmentForm'
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const slotId = (await searchParams).slotId;
    if (!slotId) notFound();
  return (
    <div>
      <CancelAppointmentForm  slotId={slotId as string} />
    </div>
  );
};

export default page