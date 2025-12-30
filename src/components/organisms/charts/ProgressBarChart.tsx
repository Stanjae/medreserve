"use client";
import ProgressBar from "@/components/atoms/progress bar/ProgressBar";
import { TDonutsChartData } from "@/types";
import { Paper, Text, Skeleton } from "@mantine/core";

type Props = {
  title: string;
  data: { total: number; data: TDonutsChartData[] } | undefined;
  loading: boolean;
};
const ProgressBarChart = ({ title, data, loading }: Props) => {
  const total = data?.total ?? 0;
  return (
    <Paper p={20} shadow="md" radius={"md"} className="space-y-4 h-full">
      <Text fz={20} lh={"28px"} fw={500}>
        {title}
      </Text>
     { loading && <Skeleton radius="md" height={250} />}
        <section className=" space-y-6">
          {Array.isArray(data?.data) &&
            data.data.length > 0 &&
            data.data.map((item) => {
              const percentage =
                total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <ProgressBar
                  key={item.name}
                  item={item}
                  percentage={percentage}
                />
              );
            })}
        </section>
    </Paper>
  );
};

export default ProgressBarChart;
