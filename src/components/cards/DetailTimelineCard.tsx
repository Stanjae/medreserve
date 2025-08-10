"use client";
import React from "react";
import { Timeline, Text, Group } from "@mantine/core";
import { PaymentColumnsType } from "@/types/table.types";
import {
  convertToCurrency,
  getTimeFromNow,
  parseResponse,
} from "@/utils/utilsFn";
import { IconPointFilled } from "@tabler/icons-react";

const DetailTimelineCard = ({
  timelineData,
  active,
}: {
  timelineData: PaymentColumnsType[] | undefined;
  active: number;
}) => {
  return (
    <div>
      <Timeline active={active} bulletSize={24} lineWidth={3}>
        {timelineData?.map((item, index) => (
          <Timeline.Item
            key={index}
            title={
              <span className="text-secondary">&#8358; {convertToCurrency(Number(item.amount))}</span>
            }
          >
            <Group justify="start">
              <Text tt="capitalize" c="dimmed" size="sm">
                {parseResponse(item?.type)}
              </Text>
              <IconPointFilled size={12} color="dimmed" stroke={1.5} />
              <Text tt="capitalize" c="dimmed" size="sm">
                #{item?.reference}
              </Text>
            </Group>

            <Text size="xs" mt={4}>
              {getTimeFromNow(item.createdAt)}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default DetailTimelineCard;
