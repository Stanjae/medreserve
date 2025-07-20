"use client";
import useGetAvailableSlots from "@/hooks/useGetAvailableSlots";
import { CreateBookingSchema } from "@/lib/schema/zod";
import { CreateAppointmentParams2 } from "@/types/actions.types";
import { AppointmentColumnsType } from "@/types/table";
import { addOrSubtractTime } from "@/utils/utilsFn";
import { Box, Divider, Grid, GridCol, LoadingOverlay, Text } from "@mantine/core";
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "sonner";

const RescheduleAppointment = ({ row }: { row: AppointmentColumnsType }) => {
  const form = useForm<CreateAppointmentParams2>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: "",
      patientId: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      notes: "",
      status: "approved",
    },
    validateInputOnChange: true,
    transformValues: (values) => ({
      ...values,
      endTime: addOrSubtractTime(
        `1970-01-01 ${values.startTime}`,
        "add",
        1,
        "hour",
        "h-m-s"
      ),
    }),
    validate: (values) => {
      const schema = CreateBookingSchema;
      if (!schema) return {};

      // Parse the current values with the schema
      const result = schema.safeParse(values);

      if (result.success) {
        return {};
      } else {
        // Map Zod errors to Mantine form error format
        const errors: { [key: string]: string } = {};
        for (const err of result.error.errors) {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        }
        return errors;
      }
    },
  });

  const { data, isLoading } = useGetAvailableSlots(row.bookingDate, row.doctorUserId);

  console.log('available:',data);
  const isWeekend = () => {
    const todayDay = dayjs().day();
    return todayDay === 0 || todayDay === 6;
  }

  

  useEffect(() => {
    form.setValues({
      doctorId: row?.doctorUserId,
      patientId: row?.patientUserId as string,
      bookingDate: row.bookingDate,
    });
  }, []);

  useEffect(() => {
    if (form.errors?.startTime) {
      toast.error(form.errors?.startTime);
    }
  }, [form.errors]);
  return (
    <div>
      <Grid overflow="hidden">
        <GridCol span={4}>
          <Image
            className=" object-cover rounded-full"
            src={row?.profilePicture}
            alt="doctor image"
            width={150}
            height={150}
          />
        </GridCol>
        <GridCol span={8}>
          <form>
            <Text fz={"20px"} lh={"28px"} fw={700} c="m-blue" mb="20px">
              Date Slots
            </Text>
            <DatePicker
              size="md"
              key={form.key("bookingDate")}
              {...form.getInputProps("bookingDate")}
              excludeDate={(date) =>
                !row.doctorAvailability?.includes(
                  new Date(date).getDay().toString()
                ) as boolean
              }
              //onChange={(value) => setDateTime({ ...dateTime, date: value })}
            />
                      <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />
                      <Box pos="relative">
                                        <LoadingOverlay
                                          visible={isLoading}
                                          zIndex={1000}
                                          overlayProps={{ radius: "sm", blur: 2 }}
                                        />
                                        <TimeGrid
                                          size="lg"
                                          allowDeselect
                                          key={form.key("startTime")}
                                          {...form.getInputProps("startTime")}
                                          data={getTimeRange({
                                            startTime: "10:00",
                                            endTime: "16:00",
                                            interval: "01:00",
                                          })}
                                          minTime={isWeekend() ? row.weekendStartTime : row.weekdayStartTime}
                                          maxTime={isWeekend() ? row.weekendEndTime : row.weekdayEndTime}
                                          disableTime={!data ? [] : data}
                                        />
                                      </Box>
          </form>
        </GridCol>
      </Grid>
    </div>
  );
};

export default RescheduleAppointment;
