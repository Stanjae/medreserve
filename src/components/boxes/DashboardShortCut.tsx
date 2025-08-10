import { dashboardShortCutLinks } from "@/constants/Toplinks";
import React from "react";
import DashboardShortCutCard from "../cards/DashboardShortCutCard";
import { Grid, GridCol } from "@mantine/core";

const DashboardShortCut = ({ userId }: { userId: string }) => {
  return (
    <Grid overflow="hidden">
          {dashboardShortCutLinks.map((item, index) => (
          <GridCol key={index} span={{ base: 12, md: 6, lg: 3 }}>
                  <DashboardShortCutCard item={ item} userId={userId} />
          </GridCol>
        
      ))}
    </Grid>
  );
};

export default DashboardShortCut;
