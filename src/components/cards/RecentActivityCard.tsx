'use client'
import { Card, Divider, Text } from '@mantine/core'
import React from 'react'

const RecentActivityCard = () => {
  return (
    <Card py={20} px={0} className=' h-full' shadow="md" radius={"md"}>
      <Text component='div' px={20} pb={20} fz={20} lh={'28px'} fw={500}>
                Recent Activity
          </Text>
          <Divider/>
    </Card>
  );
}

export default RecentActivityCard