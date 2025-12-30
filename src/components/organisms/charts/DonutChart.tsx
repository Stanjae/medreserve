"use client";
import { TDonutsChartData } from "@/types";
import { DonutChart } from "@mantine/charts";
import { Paper, Skeleton, Text } from "@mantine/core";

type Props = {
  title: string;
  data: TDonutsChartData[] | undefined;
  loading: boolean;
};

export function DonutChartCard({ title, data, loading }: Props) {
  return (
    <Paper p={20} shadow="md" radius={"md"} className="space-y-4">
      <Text fz={20} lh={"28px"} fw={500}>
        {title}
      </Text>
      <Skeleton visible={loading} radius="md">
        <DonutChart
          data={
            data?.length && data.length > 0 ? (data as TDonutsChartData[]) : []
          }
          withLabelsLine
          labelsType="percent"
          withLabels
          size={180}
          className=" mx-auto"
        />
      </Skeleton>
    </Paper>
  );
}
