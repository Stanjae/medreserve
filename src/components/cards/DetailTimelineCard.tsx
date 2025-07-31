"use client";
import React from "react";
import { Timeline, Text } from "@mantine/core";
import { PaymentColumnsType } from "@/types/table.types";
import { convertToCurrency, getTimeFromNow } from "@/utils/utilsFn";

const DetailTimelineCard = ({
    timelineData,
    active
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
              <span>&#8358; {convertToCurrency(Number(item.amount))}</span>
            }
          >
            <Text c="dimmed" size="sm">
              You&apos;ve created new branch{" "}
              <Text variant="link" component="span" inherit>
                fix-notifications
              </Text>{" "}
              from master
            </Text>
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
