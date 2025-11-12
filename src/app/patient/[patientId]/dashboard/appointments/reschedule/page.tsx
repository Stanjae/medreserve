import RescheduleAppointment from '@/components/forms/RescheduleAppointmentForm'
import React from 'react'

const page = async({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const sloId = (await searchParams).slotId
  return (
      <div>
          <RescheduleAppointment slotId={sloId as string}/>
    </div>
  )
}

export default page