import UserDoctorRegistrationForm from '@/components/forms/UserDoctorRegistration'
import UserRegistrationForm from '@/components/forms/UserPatientRegistrationForm'
import { Group, Paper, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <Tabs defaultValue="patient">
      <TabsList grow justify="center">
        <TabsTab c={'m-blue'} className=" text-lg font-semibold" value="patient">Patient</TabsTab>
        <TabsTab c={'m-blue'} className=" text-lg font-semibold" value="doctor">Doctor</TabsTab>
      </TabsList>

      <TabsPanel value="patient" pt="xs">
        <Paper shadow="md" className=" space-y-4  md:py-[46px] px-[20px] md:px-[70px] w-full max-w-[486px]">
            <h4 className=' text-2xl font-extrabold leading-[30px] mt-[3px] mb-[20px] text-center text-secondary'>Register</h4>
            <UserRegistrationForm/>
            <Stack>
              <Group justify="center">
                <Text c="m-gray">Already have an account?</Text>
                <Link className=' text-primary no-underline' href={'/auth/login'}>Sign In</Link>
              </Group>
            </Stack>
        </Paper>
      </TabsPanel>

      <TabsPanel value="doctor" pt="xs">
        <Paper shadow="md" className=" space-y-4  md:py-[46px] px-[20px] md:px-[70px] w-full max-w-[486px]">
            <h4 className=' text-2xl font-extrabold leading-[30px] mt-[3px] mb-[20px] text-center text-secondary'>Doctor Registration</h4>
            <UserDoctorRegistrationForm/>
            <Stack>
              <Group justify="center">
                <Text c="m-gray">Already have an account?</Text>
                <Link className=' text-primary no-underline' href={'/auth/login'}>Sign In</Link>
              </Group>
            </Stack>
        </Paper>
      </TabsPanel>
    </Tabs>
    
  )
}

export default page