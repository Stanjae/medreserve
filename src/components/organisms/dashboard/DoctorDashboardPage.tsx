"use client";
import DashboardMetrics from "@/components/boxes/DashboardMetrics";
import RecentActivityCard from "@/components/cards/RecentActivityCard";
import { doctorDashboardMetricsCardInfo } from "@/constants";
import useGetDoctorDashboardMetrics from "@/hooks/doctor/useGetDoctorDashboardMetrics";
import { useMedStore } from "@/providers/med-provider";
import { TMetricCard } from "@/types";
import { Divider, Box, Grid, GridCol } from "@mantine/core";
import { useMemo } from "react";
import DoctorDashboardBarChart from "../charts/DoctorDashboardBarChart";
import { HorizontalBarChart } from "../charts/HorizontalBarChart";
import useGetPatientsAgeDemograph from "@/hooks/doctor/useGetPatientsAgeDemograph";
import { DonutChartCard } from "../charts/DonutChart";
import useGetPatientsTopDiagnosis from "@/hooks/doctor/useGetPatientsTopDiagnosis";
import ProgressBarChart from "../charts/ProgressBarChart";
import useGetPatientAppointmentTypeDistribution from "@/hooks/doctor/useGetPatientAppointmentTypeDistribution";

type Props = {
  doctorId: string;
};
const DoctorDashboardPage = ({ doctorId }: Props) => {
  const { credentials } = useMedStore((store) => store);
  const { data, isLoading } = useGetDoctorDashboardMetrics(
    credentials?.databaseId as string
  );

  const { data: ageData, isLoading: ageLoading } = useGetPatientsAgeDemograph();

  const { data: diagnosisData, isLoading: diagnosisLoading } = useGetPatientsTopDiagnosis();

  const {data: appointmentData, isLoading: appointmentLoading} = useGetPatientAppointmentTypeDistribution()

  const doctorMetrics: TMetricCard[] = useMemo(
    () =>
      doctorDashboardMetricsCardInfo.map((item) => {
        const payload = data && data[item.value as keyof typeof data];
        return {
          ...item,
          count: payload?.count,
          status: payload?.status,
          subLabel: payload?.subLabel,
          loading: isLoading,
        };
      }),
    [data, isLoading]
  );

  console.log('doctorId', doctorId);
  return (
    <Box py={20} className=" min-h-screen space-y-5">
      <DashboardMetrics data={doctorMetrics} />
      <Divider my="md" variant="dotted" color={"m-cyan"} />
      <Grid overflow="hidden">
        <GridCol span={{ base: 12, lg: 8 }}>
          <DoctorDashboardBarChart
            doctorDbId={credentials?.databaseId as string}
          />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <RecentActivityCard />
        </GridCol>
      </Grid>
      <Divider my="md" variant="dotted" color={"m-cyan"} />
      <Grid overflow="hidden">
        <GridCol span={{ base: 12, lg: 4 }}>
          <HorizontalBarChart
            title="Patients Age Demographics"
            data={ageData}
            loading={ageLoading}
          />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <DonutChartCard
            title="Patients Top Diagnosis"
            data={diagnosisData}
            loading={diagnosisLoading}
          />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <ProgressBarChart
            title="Appointment Type Distribution"
            data={appointmentData}
            loading={appointmentLoading}
          />
        </GridCol>
      </Grid>
      <Divider my="md" variant="dotted" color={"m-cyan"} />
    </Box>
  );
};

export default DoctorDashboardPage;
