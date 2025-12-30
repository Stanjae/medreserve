"use client";
import { Grid, GridCol } from "@mantine/core";
import DashboardMetricCard from "../molecules/metrics/DashboardMetricCard";
import { TMetricCard } from "@/types";

type Props = {
  data: TMetricCard[];
};

const DashboardMetrics = ({ data }: Props) => {
  return (
    <div className="space-y-3">
      <Grid overflow="hidden">
        {data?.map((item, index) => (
          <GridCol key={index} span={{ base: 12, md: 6, lg: 3 }}>
            <DashboardMetricCard item={item} />
          </GridCol>
        ))}
      </Grid>
    </div>
  );
};

export default DashboardMetrics;
