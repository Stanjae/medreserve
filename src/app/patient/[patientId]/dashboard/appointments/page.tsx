import AppointMentsTable from "@/components/dataTable/AppointMentsTable";
import { Paper } from "@mantine/core";
import React from "react";

const page = () => {
  return (
    <Paper p={20} className=" min-h-screen" shadow="md" radius={"md"}>
      <AppointMentsTable />
    </Paper>
  );
};

export default page;
