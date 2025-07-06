'use client'
import { Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import React from 'react'

const headerData = [
    {slug:'step-1',title:'Make Reservation'},
    { slug: 'step-2', title: 'Book Appointment' },
    { slug: 'step-3', title: 'Make Payment' },
]
const CustomHeaders = () => {
    const pathname = usePathname();
    const newheader = pathname.split("/")[pathname.split("/").length - 1];
  return (
    <Text fz={"38px"} lh={"43px"} fw={700} c="m-blue" mb="30px">
      {headerData.find((item) => item.slug === newheader)?.title}
    </Text>
  );
}

export default CustomHeaders
