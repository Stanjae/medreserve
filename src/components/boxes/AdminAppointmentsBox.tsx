"use client";
import React, { useState } from "react";
import MedReserveCalendar from "../calendar/MedReserveCalendar";
import useGetMonthYearAppointments from "@/hooks/admin/useGetMonthYearAppointments";
import { LoadingOverlay } from "@mantine/core";

const AdminAppointmentsBox = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data, isLoading } = useGetMonthYearAppointments(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  );

  return (
    <div>
      <section className="relative">
        <LoadingOverlay visible={isLoading} />
        <MedReserveCalendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          data={data}
        />
      </section>
    </div>
  );
};

export default AdminAppointmentsBox;
