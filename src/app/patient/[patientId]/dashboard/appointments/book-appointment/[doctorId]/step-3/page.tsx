import AppointmentReferenceCard from '@/components/cards/AppointmentReferenceCard'
import { Skeleton } from '@mantine/core';
import React, { Suspense } from 'react'

const page = async({searchParams}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const paymentreferenceId = (await searchParams).paymentreferenceId;

  return (
    <main>
      <Suspense fallback={<Skeleton/>}>
        <AppointmentReferenceCard  paymentreferenceId={paymentreferenceId as string}/>
      </Suspense>
    </main>
  );
};

export default page