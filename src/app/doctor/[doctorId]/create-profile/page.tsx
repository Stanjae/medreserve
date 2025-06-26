'use client'
import useLogout from '@/hooks/useLogout';
import { useMedStore } from '@/providers/med-provider';
import { Button } from '@mantine/core';
import React from 'react'

const Page = () => {
  const { credentials } = useMedStore((state) => state);
  const {logoutPatient} = useLogout()

  console.log("credentials:", credentials)
  return (
    <div>create profile
      <Button onClick={logoutPatient}>logout</Button>
    </div>
  )
}

export default Page