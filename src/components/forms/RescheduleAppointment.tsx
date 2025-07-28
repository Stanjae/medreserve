"use client";
import useGetAvailableSlots from "@/hooks/useGetAvailableSlots";
import { UpdateBookingSchema } from "@/lib/schema/zod";
import { RescheduleAppointmentParams } from "@/types/actions.types";
import { AppointmentColumnsType } from "@/types/table.types";
import { addOrSubtractTime, convertToCurrency } from "@/utils/utilsFn";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  LoadingOverlay,
  Stepper,
  Text,
} from "@mantine/core";
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CustomInput from "../inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { IconCircleDottedLetterP } from "@tabler/icons-react";

const RescheduleAppointment = ({ row }: { row: AppointmentColumnsType }) => {
  const [active, setActive] = useState<number>(0);

  const form = useForm<RescheduleAppointmentParams>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: row?.doctorUserId,
      patientId: row?.patientUserId,
      paymentId: row?.paymentId?.$id,
      slotId: row?.id,
      bookingDate: row?.bookingDate,
      startTime: row?.startTime,
      endTime: "",
      notes: row?.notes as string,
      fullname: row?.patientFullname as string,
      email: row?.patientEmail as string,
      address: row?.patientAddress as string,
      rescheduleFees: 15000,
      phone: row?.patientPhone as string,
      capacity: row?.capacity?.toString() as string,
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
      const schema = UpdateBookingSchema;
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

  const { data, isLoading } = useGetAvailableSlots(
    row.bookingDate,
    row.doctorUserId
  );

  const isWeekend = () => {
    const todayDay = dayjs().day();
    return todayDay === 0 || todayDay === 6;
  };

  useEffect(() => {
    if (form.errors?.startTime) {
      toast.error(form.errors?.startTime);
    }
  }, [form.errors]);

  const nextStep = () =>
    setActive((current) => {
      /* if (form.validate().hasErrors) {
        return current;
      } */
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div>
      <Flex align="center" gap="md">
        <Image
          className=" object-cover rounded-full"
          src={row?.profilePicture}
          alt="doctor image"
          width={70}
          height={70}
        />
        <Box>
          <Text fz={"20px"} lh={"26px"} fw={700} c="m-blue">
            {row?.doctorName}
          </Text>
          <Text fz={"15px"} fw={500} c="m-gray">
            {row?.specialization}
          </Text>
          <Text fz={"13px"} fw={400} c="m-gray">
            {row?.bio}
          </Text>
        </Box>
      </Flex>
      <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />
      <form
        onSubmit={form.onSubmit(async (values) =>
          console.log("underhand: ", values)
        )}
      >
        <Stepper active={active}>
          <Stepper.Step label="First step" description="Reschedule Booking">
            <Grid overflow="hidden">
              <GridCol span={6}>
                <Text fz={"20px"} lh={"28px"} fw={700} c="m-blue" mb="20px">
                  Date Slots
                </Text>
                <DatePicker
                  size="md"
                  minDate={dayjs().format("YYYY-MM-DD")}
                  key={form.key("bookingDate")}
                  {...form.getInputProps("bookingDate")}
                  excludeDate={(date) =>
                    !row.doctorAvailability?.includes(
                      new Date(date).getDay().toString()
                    ) as boolean
                  }
                  //onChange={(value) => setDateTime({ ...dateTime, date: value })}
                />
              </GridCol>
              <GridCol span={6}>
                <Text fz={"20px"} lh={"28px"} fw={700} c="m-blue" mb="20px">
                  Time Slots
                </Text>
                <Box pos="relative">
                  <LoadingOverlay
                    visible={isLoading}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                  />
                  <TimeGrid
                    size="md"
                    allowDeselect
                    key={form.key("startTime")}
                    {...form.getInputProps("startTime")}
                    data={getTimeRange({
                      startTime: "10:00",
                      endTime: "16:00",
                      interval: "01:00",
                    })}
                    minTime={
                      isWeekend() ? row.weekendStartTime : row.weekdayStartTime
                    }
                    maxTime={
                      isWeekend() ? row.weekendEndTime : row.weekdayEndTime
                    }
                    disableTime={
                      !data
                        ? []
                        : data?.filter((item) => item !== row.startTime)
                    }
                  />
                </Box>
              </GridCol>
              <GridCol span={12}>
                <Divider color={"m-cyan"} size="md" variant="dotted" />
              </GridCol>
              <GridCol span={12}>
                <CustomInput
                  size="md"
                  withAsterisk
                  placeholder="What may be your reason for booking an Appointment"
                  styles={{ input: { width: "100%" } }}
                  {...form.getInputProps("notes")}
                  key={form.key("notes")}
                  radius={15}
                  type="textarea"
                  label="Reason for Appointment"
                />
              </GridCol>
            </Grid>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Pay and Finish">
            <Text fz={"20px"} lh={"28px"} fw={700} c="m-blue" mb="20px">
              Breakdown & Payment
            </Text>
            <Grid overflow="hidden">
              <GridCol span={{ base: 12, md: 6 }}>
                <CustomInput
                  type="text"
                  label="Full Name"
                  radius={35}
                  withAsterisk
                  readOnly
                  size="md"
                  placeholder="Enter your full name"
                  key={form.key("fullname")}
                  {...form.getInputProps("fullname")}
                />
              </GridCol>

              <GridCol span={{ base: 12, md: 6 }}>
                <CustomInput
                  type="text"
                  withAsterisk
                  label="Email"
                  radius={35}
                  readOnly
                  size="md"
                  placeholder="Enter your email"
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                />
              </GridCol>

              <GridCol span={{ base: 12, md: 6 }}>
                <CustomInput
                  type="phone_no"
                  label="Phone Number"
                  placeholder="Enter your Phone Number"
                  className=" phone-no"
                  value={row?.patientPhone}
                  key={form.key("phone")}
                  {...form.getInputProps("phone")}
                />
              </GridCol>

              <GridCol span={{ base: 12, md: 6 }}>
                <CustomInput
                  type="select"
                  size="md"
                  label="Capacity of persons"
                  placeholder="Capacity of persons"
                  withAsterisk
                  radius={35}
                  data={[
                    { label: "1 Person", value: "1" },
                    { label: "2 Persons", value: "2" },
                  ]}
                  key={form.key("capacity")}
                  {...form.getInputProps("capacity")}
                />
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <CustomInput
                  type="text"
                  label="Home Address"
                  radius={35}
                  size="md"
                  placeholder="Enter your Residential Address"
                  key={form.key("address")}
                  {...form.getInputProps("address")}
                />
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <Box bg="m-gray.0" p="md">
                  <Text fz={"20px"} fw={600} c="m-background.9" mb="md">
                    Payment Summary
                  </Text>

                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Initial Payment Fees
                    </Text>
                    <Text fz={"15px"} td="line-through" fw={500} c="m-blue">
                      &#8358;{" "}
                      {convertToCurrency(Number(row?.paymentId?.amount))}
                    </Text>
                  </Group>

                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Reschedule Fees
                    </Text>
                    <Text fz={"15px"} fw={500} c="m-blue">
                      &#8358;{" "}
                      {convertToCurrency(Number(form.values.rescheduleFees))}
                    </Text>
                  </Group>
                  <Divider color={"m-gray"} size="xs" variant="solid" />
                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Total
                    </Text>
                    <Text fz={"15px"} fw={500} c="m-blue">
                      &#8358;{" "}
                      {convertToCurrency(Number(form.values.rescheduleFees))}
                    </Text>
                  </Group>
                </Box>
              </GridCol>
            </Grid>
            <Group justify="flex-end" mt="lg">
              <SubmitBtn
                type="submit"
                color="m-blue"
                radius={35}
                loading={form.submitting}
                leftSection={<IconCircleDottedLetterP />}
                size="lg"
                text="Pay Now"
              />
            </Group>
          </Stepper.Step>
        </Stepper>

        <Group justify={active !== 1 ? "flex-end" : "space-between"} mt="md">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 1 && <Button onClick={nextStep}>Next step</Button>}
        </Group>
      </form>
    </div>
  );
};

export default RescheduleAppointment;
