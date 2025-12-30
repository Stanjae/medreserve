"use client";
import { TMetricCard } from "@/types";
import { Card, CardSection, Skeleton, Text } from "@mantine/core";
import React from "react";

type Props = {
  item: TMetricCard;
};

const DashboardMetricCard = ({ item }: Props) => {
  return (
    <Card
      shadow="sm"
      className="bg-card-metrics"
      py="40px"
      pl="40px"
      radius="md"
      withBorder
    >
      <CardSection>
        <Skeleton width={80} height={20} visible={item.loading}>
          <Text size="xl" fw={700}>
            {item?.count} {item?.value == "healthscore" ? "%" : ""}
          </Text>
        </Skeleton>
        <Text tt="capitalize" mt="sm" size="md" fw={500}>
          {item?.label}
        </Text>
        {item?.subLabel && (
          <Text
            tt="capitalize"
            color={
              item?.status == "stable"
                ? "m-gray"
                : item?.status === "improve"
                  ? "green"
                  : "red"
            }
            size="sm"
          >
            {item?.status == 'improve' ? '▲ ' : item?.status == 'decline' ? '▼ ' : ''}
            {item?.subLabel}
          </Text>
        )}
      </CardSection>
    </Card>
  );
};

export default DashboardMetricCard;
