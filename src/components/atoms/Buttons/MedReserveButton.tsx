'use client'
import { Button, ButtonProps } from '@mantine/core'
import React from 'react'

const MedReserveButton = ({children, ...props}:{children:React.ReactNode} & ButtonProps) => {
  return (
    <Button {...props}>{children}</Button>
  )
}

export default MedReserveButton