"use client";
import { Badge, Divider, Group, Indicator, Paper } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React, { useState } from "react";
import CustomInput from "../../molecules/inputs/CustomInput";
import { getAllAppointmentsActionWithinYearAndMonthResponse } from "@/types";
import { timeStringtoHoursAndMinutes } from "@/utils/utilsFn";
import { daysOfWeek, monthsOfYear, statusConfig } from "@/constants";
import CustomModal from "../../modals/CustomModal";
import { useDisclosure } from "@mantine/hooks";
import AppointmentDetailCard from "../../cards/AppointmentDetailCard";

type Props = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  data: getAllAppointmentsActionWithinYearAndMonthResponse[] | undefined;
};

const MedReserveCalendar = ({ currentDate, setCurrentDate, data }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<getAllAppointmentsActionWithinYearAndMonthResponse | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    console.log("firstDayOfMonth", firstDayOfMonth);
    console.log("daysInMonth", daysInMonth);
    console.log("month", month);
    console.log("year", year);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleMonthChange = (e: string) => {
    const selectedMonth = monthsOfYear.findIndex((month) => month === e);
    const newDate = new Date(currentDate.getFullYear(), selectedMonth, 1);
    setCurrentDate(newDate);
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(
      currentDate.getFullYear() + increment,
      currentDate.getMonth(),
      1
    );
    setCurrentDate(newDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  const handleSessionClick = (appointmentId: string) => {
    const appointment = data?.find((app) => app.id === appointmentId) || null;
    setSelectedAppointment(appointment);
    open();
  };

  return (
    <div>
      <Paper shadow="md" py="md" radius="md">
        <Group px="md" justify="space-between">
          <h2 className="text-xl font-bold text-gray-800">Calendar View</h2>
          <div className=" flex items-center gap-x-3">
            <CustomInput
              type="select"
              radius="md"
              data={monthsOfYear}
              defaultValue={monthsOfYear[currentDate.getMonth()]}
              onChange={(val) => handleMonthChange(val as string)}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleYearChange(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous year"
              >
                <IconChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-gray-800">
                  {currentDate.getFullYear()}
                </span>
              </div>

              <button
                onClick={() => handleYearChange(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next year"
              >
                <IconChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </Group>
        <Divider my="sm" />

        <div className="px-4">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-lg font-semibold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-3">
            {days.map((day, index) => {
              const dateCurrent = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${day}`;
              const apointmentsOnThisDay = data?.filter(
                (appointment) => appointment.bookingDate == dateCurrent
              );
              return (
                <div
                  key={index}
                  className={` p-2  text-sm rounded-md cursor-pointer transition-all duration-200 h-48
              ${
                day === null
                  ? ""
                  : isToday(day)
                    ? " text-white font-bold shadow-lg ring-2 ring-primary ring-opacity-50 transform scale-105"
                    : "hover:bg-blue-50 hover:text-blue-700 text-secondary hover:scale-105 border border-gray-500"
              } 
            `}
                >
                  <Indicator
                    size={6}
                    position="top-end"
                    disabled={(day !== null && !isToday(day)) || !day}
                  >
                    <span className=" text-secondary">{day}</span>
                  </Indicator>
                  <div className=" w-full mt-5">
                    {apointmentsOnThisDay &&
                      apointmentsOnThisDay.map((appointment) => {
                        const statusOfAppointment =
                          statusConfig[appointment.status];
                        const IconDay = statusOfAppointment.icon;
                        return (
                          <Badge
                            leftSection={<IconDay className="w-4 h-4" />}
                            className="cursor-pointer"
                            fullWidth
                            color={statusOfAppointment.color}
                            onClick={() => handleSessionClick(appointment.id)}
                            key={appointment.id}
                          >
                            {timeStringtoHoursAndMinutes(appointment.startTime)}{" "}
                            - {timeStringtoHoursAndMinutes(appointment.endTime)}
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with current date info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
            <span className="text-xs text-gray-500 font-medium">Today</span>
          </div>
          <p className="text-center text-sm text-gray-600 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Paper>
      <CustomModal
        size={"lg"}
        opened={opened}
        onClose={close}
        title="Appointment Details"
        centered
      >
        <AppointmentDetailCard data={selectedAppointment} onClose={close} />
      </CustomModal>
    </div>
  );
};

export default MedReserveCalendar;
