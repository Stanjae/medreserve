'use client'
import useLogout from '@/hooks/useLogout'
import { Button } from '@mantine/core'
import React from 'react'

const Page = () => {
  const { logoutPatient} = useLogout()
  return (
    <div>
        <h2>patient dashboard page</h2>
        <Button onClick={logoutPatient}>Logout</Button>
    </div>
  )
}

export default Page