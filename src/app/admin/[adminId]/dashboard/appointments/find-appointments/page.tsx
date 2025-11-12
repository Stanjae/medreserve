import SearchAppointments from "@/components/appointments/SearchAppointments";
import FilterableAppointmentList from "@/components/organisms/lists/FilterableAppointmentsList";
import { Divider, Paper } from "@mantine/core";

const Page = () => {
  return (
    <Paper p={20} className=" min-h-screen" shadow="md" radius={"md"}>
      <SearchAppointments />
      <Divider color={"m-cyan"} my="sm" size="md" variant="dotted" />
      <FilterableAppointmentList />
    </Paper>
  );
};

export default Page;
