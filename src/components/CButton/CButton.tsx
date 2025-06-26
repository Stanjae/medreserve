'use client'
import { Button, ButtonProps } from '@mantine/core'
import React from 'react'

const CButton = ({children, ...props}:{children:React.ReactNode, props?:ButtonProps}) => {
  return (
    <Button {...props}>{children}</Button>
  )
}

export default CButton