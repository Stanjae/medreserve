/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useGetDashboardBarchartAnalytics from "@/hooks/useGetDashboardBarchartAnalytics";
import { useMedStore } from "@/providers/med-provider";
import { ComboboxItem, Group, Paper, Text } from "@mantine/core";
import  { useState } from "react";
import { BarChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { barChartData } from "@/constants";
import dayjs from "dayjs";
import CustomInput from "@/components/molecules/inputs/CustomInput";

const DashboardBarChart = () => {
  const [value, setValue] = useState<ComboboxItem>(() =>
    dayjs().month() > 5 ? barChartData[1] : barChartData[0]
  );
  const { credentials } = useMedStore((state) => state);
  const { data } = useGetDashboardBarchartAnalytics(
    credentials?.databaseId as string,
    value?.value
  );
  return (
    <Paper p={20} shadow="md" radius={"md"}>
      <Group mb={10} justify="space-between">
        <Text fz={20} lh={"28px"} fw={500}>
          Appointments Summary
        </Text>
        <CustomInput
          type="select"
          radius="xl"
          value={value ? value.value : null}
          className=" w-[150px]"
          data={barChartData}
          onChange={(_value, option) => setValue(option)}
        />
      </Group>
      <BarChart
        h={400}
        data={data ? (data as Record<string, any>[]) : []}
        dataKey="month"
        withLegend
        series={[
          { name: "followUp", color: "violet.6" },
          { name: "consultation", color: "blue.6" },
          { name: "emergency", color: "teal.6" },
        ]}
        tickLine="y"
      />
    </Paper>
  );
};

export default DashboardBarChart;
