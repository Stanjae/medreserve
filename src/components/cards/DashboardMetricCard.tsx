"use client";
import { Card, CardSection, Skeleton, Text } from "@mantine/core";
import React from "react";

type Props = {
  item: {
    label: string;
    count: number;
    value: string;
  };
  loading: boolean;
};

const DashboardMetricCard = ({ item, loading }: Props) => {
  return (
    <Card
      shadow="sm"
      className="bg-card-metrics"
      p="40px"
      radius="md"
      withBorder
    >
      <CardSection>
        <Skeleton width={50} height={20} visible={loading}>
          <Text size="xl" fw={700}>
            {item?.count} {item?.value == "healthscore" ? "%" : ""}
          </Text>
        </Skeleton>
        <Text tt="capitalize" mt="sm" size="md" fw={500}>
          {item?.label}
        </Text>
      </CardSection>
    </Card>
  );
};

export default DashboardMetricCard;
