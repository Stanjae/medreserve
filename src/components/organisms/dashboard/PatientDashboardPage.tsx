"use client";
import DashboardMetrics from "@/components/boxes/DashboardMetrics";
import DashboardShortCut from "@/components/boxes/DashboardShortCut";
import RecentActivityCard from "@/components/cards/RecentActivityCard";
import DashboardBarChart from "@/components/organisms/charts/DashboardBarChart";
import { patientDashboardMetricsCardInfo } from "@/constants";
import useGetPatientDashboardMetrics from "@/hooks/useGetPatientDashboardMetrics";
import { useMedStore } from "@/providers/med-provider";
import { TMetricCard } from "@/types";
import { Divider, Box, Grid, GridCol } from "@mantine/core";
import { useMemo } from "react";

type Props = {
  patientId: string;
};
const PatientDashboardPage = ({ patientId }: Props) => {
      const { credentials } = useMedStore((store) => store);
      const { data, isLoading } = useGetPatientDashboardMetrics(
        credentials?.databaseId as string
      );

      const patientMetrics:TMetricCard[] = useMemo(
        () =>
          patientDashboardMetricsCardInfo.map((item) => ({
            ...item,
            count: data ? (data[item.value as keyof typeof data] ?? 0) : 0,
            loading:isLoading
          })),
        [data, isLoading]
      );
  return (
      <Box py={20} className=" min-h-screen space-y-5">
        <DashboardMetrics data={patientMetrics} />
        <Divider my="md" variant="dotted" color={"m-cyan"} />
        <Grid overflow="hidden">
          <GridCol span={{ lg: 8 }}>
            <DashboardBarChart />
          </GridCol>
          <GridCol span={{ lg: 4 }}>
            <RecentActivityCard />
          </GridCol>
        </Grid>
        <Divider my="md" variant="dotted" color={"m-cyan"} />
        <DashboardShortCut userId={patientId} />
      </Box>
  );
};

export default PatientDashboardPage;
