"use client";
import { TPatientAgeDemographics } from "@/types";
import { BarChart } from "@mantine/charts";
import { Paper, Skeleton, Text } from "@mantine/core";

type Props = {
  title: string;
  data: TPatientAgeDemographics[] | undefined;
  loading: boolean;
};

export function HorizontalBarChart({ title, data, loading }: Props) {
  return (
    <Paper p={20} shadow="md" radius={"md"} className="space-y-4">
      <Text fz={20} lh={"28px"} fw={500}>
        {title}
      </Text>
      <Skeleton visible={loading} radius="md">
        <BarChart
          h={260}
          data={
            data?.length && data.length > 0
              ? (data as TPatientAgeDemographics[])
              : []
          }
          dataKey="ageGroup"
          orientation="vertical"
          gridAxis="none"
          yAxisProps={{ width: 80 }}
          barProps={{ radius: 10 }}
          series={[{ name: "count", color: "m-orange.6" }]}
        />
      </Skeleton>
    </Paper>
  );
}
