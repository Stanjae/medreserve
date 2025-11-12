export const dynamic = "force-dynamic";
export const revalidate = 0;
import DashboardMetrics from "@/components/boxes/DashboardMetrics";
import DashboardShortCut from "@/components/boxes/DashboardShortCut";
import RecentActivityCard from "@/components/cards/RecentActivityCard";
import DashboardBarChart from "@/components/organisms/charts/DashboardBarChart";
import { Divider, Box, Grid, GridCol } from "@mantine/core";
import React from "react";

const Page = async ({ params }: { params: Promise<{ patientId: string }> }) => {
  const { patientId } = await params;
  return (
    <div>
      <Box py={20} className=" min-h-screen space-y-5">
        <DashboardMetrics />
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
    </div>
  );
};

export default Page;
