'use client'
import { Box, Text } from '@mantine/core'
import React from 'react'

const CustomFilters = ({label, children}:{label:string; children:React.ReactNode}) => {
  return (
    <Box bg="m-cyan.0" className={' gap-x-3 pl-[30px] items-center flex rounded-3xl py-0 text-[18px] leading-[22.5px]'}>
        <Text c="m-gray" className="text-[16px]">{label}</Text>
        {children}
    </Box>
  )
}

export default CustomFilters