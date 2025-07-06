import BookAppointment from '@/components/appointments/BookAppointment'
import FilterableDoctorList from '@/components/lists/FilterableDoctorList';
import { Divider, Paper } from '@mantine/core'
import React from 'react'

const page = () => {
  return (
    <Paper p={20} className=' min-h-screen' shadow="md" radius={"md"}>
      <BookAppointment />
      <Divider color={'m-cyan'} my="sm" size="md" variant="dotted" />
      <FilterableDoctorList/>
    </Paper>
  );
}

export default page