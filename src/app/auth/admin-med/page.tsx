import AdminLoginForm from '@/components/forms/AdminLoginForm'
import { Group, Paper, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <Paper
      shadow="md"
      className=" py-[46px] space-y-4  px-[20px] md:px-[35px]  lg:px-[70px] w-full md:max-w-[486px]"
    >
      <h4 className=" text-2xl font-extrabold leading-[30px] mt-[3px] mb-[20px] text-center text-secondary">
        Admin Login
      </h4>
      <AdminLoginForm />
      <Stack>
        <Group justify="center">
          <Text c="m-gray">Forgot Password</Text>
          <Link
            className=" text-primary no-underline"
            href={"/auth/forgot-password"}
          >
            Click Here
          </Link>
        </Group>
        <Group justify="center">
          <Text c="m-gray">Back to Patient Login</Text>
          <Link className=" text-primary no-underline" href={"/auth/login"}>
            Click Here
          </Link>
        </Group>
      </Stack>
    </Paper>
  );
}

export default page