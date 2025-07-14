'use client'
import { AppointmentColumnsType } from '@/types/table';
import { parseResponse } from '@/utils/utilsFn';
import { Avatar, Group, Rating, Stack, Text } from '@mantine/core';
import React from 'react'

const AppointmentTableHoverCard = ({
  row,
}: {
  row: AppointmentColumnsType;
    }) => {
    const rating = row.rating?.reduce((acc, val) => Number(acc) + Number(val), 0) / row.rating?.length;
  return (
    <div>
      <Group>
        <Avatar src={row?.profilePicture} radius="xl" />
        <Stack gap={5}>
          <Text size="md" fw={700} style={{ lineHeight: 1 }}>
            Dr. {row?.doctorName}
          </Text>
          <Text c="dimmed" tt={"capitalize"} size="sm" fw={700} style={{ lineHeight: 1 }}>
            {parseResponse(row?.specialization)}
          </Text>
        </Stack>
      </Group>
      <Text size="sm" mt="md">
        {row.bio}
          </Text>
          <Rating readOnly fractions={2} value={rating} size={'sm'}/>
    </div>
  );
};

export default AppointmentTableHoverCard