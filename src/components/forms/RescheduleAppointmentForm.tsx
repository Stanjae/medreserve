"use client";
import useGetAvailableSlots from "@/hooks/useGetAvailableSlots";
import { UpdateBookingSchema } from "@/lib/schema/zod";
import { RescheduleAppointmentParams } from "@/types/actions.types";
import {
  addOrSubtractTime,
  formatCurrency,
  getAMPM,
  getAppointmentLocation,
  parseResponse,
} from "@/utils/utilsFn";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  LoadingOverlay,
  Paper,
  Stepper,
  Text,
} from "@mantine/core";
import { getTimeRange, TimeGrid } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import {
  IconAlertCircle,
  IconCalendar,
  IconCircleCheckFilled,
  IconClock,
  IconHome,
  IconX,
} from "@tabler/icons-react";
import useRescheduleAppointment from "@/hooks/useRescheduleAppointment";
import useFetchAppointment from "@/hooks/useFetchAppointment";
import { rescheduleAppointmentInitialValues } from "@/constants/formInitialValues";
import { transformToRescheduleData } from "@/utils/transformHelpers";
import { useMedStore } from "@/providers/med-provider";
import { Rescheduling_Policy } from "@/constants/policies";
import MedReserveLoader from "../loaders/MedReserveLoader";
import RescheduleDateCarousel from "../organisms/calendar/RescheduleDateCarousel";
import { useRouter } from "next/navigation";
import { administrationFee, capacityData } from "@/constants";

type Props = {
  slotId: string;
};

const RescheduleAppointment = ({ slotId }: Props) => {
  const [active, setActive] = useState<number>(0);
  const { credentials } = useMedStore((store) => store);
  const router = useRouter();
  const { data, isLoading } = useFetchAppointment(slotId);

    const consultationFee = data?.paymentId?.find(
      (item) => item.type === "initial-fees"
    )?.amount as number;

  const form = useForm<RescheduleAppointmentParams>({
    mode: "uncontrolled",
    initialValues: rescheduleAppointmentInitialValues,
    validateInputOnChange: false,
    transformValues: (values) => ({
      ...values,
      endTime: addOrSubtractTime(
        `1970-01-01 ${values.startTime}`,
        "add",
        1,
        "hour",
        "h-m-s"
      ),
      amount: (Number(values.amount) * Number(values.capacity)) + (Number(consultationFee) * (administrationFee / 100)),
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
        console.error("Validation errors:", errors);
        return errors;
      }
    },
  });

  useEffect(() => {
    if (data) {
      const transformedData = transformToRescheduleData(data);
      form.setInitialValues(transformedData);
      form.setValues(transformedData);
    }
  }, [data]);

  const { handleTransaction, message } = useRescheduleAppointment(setActive);

  const handleSelectedDate = (date: string) => {
    form.setValues({ bookingDate: date });
  };

  const { data: availableSlots, isLoading: isLoadingSlots } =
    useGetAvailableSlots(
      form.getValues().bookingDate,
      form.getValues().doctorId
    );

  const isWeekend = () => {
    const todayDay = dayjs().day();
    return todayDay === 0 || todayDay === 6;
  };

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const isFormValid = () =>
    form.getValues().bookingDate &&
    form.getValues().startTime &&
    form.getValues().reasonForReschedule &&
    form.getValues().isReschedueledPolicyConfirm;


  const reviewCard = (
    date: string,
    time: string,
    doctorName: string,
    type: "Current" | "New"
  ) => (
    <div
      className={`${type === "Current" ? "bg - red - 50 border border-red-200" : "bg-green-50 border border-green-200"} rounded-lg p-4`}
    >
      <h3
        className={`${type === "Current" ? "text-red-900" : "text-green-900"} mb-3 flex items-center font-semibold`}
      >
        {type === "Current" ? (
          <IconX className="w-4 h-4 mr-2" />
        ) : (
          <IconCircleCheckFilled className="w-4 h-4 mr-2" />
        )}
        {type} Appointment
      </h3>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Date:</span> {date}
        </p>
        <p>
          <span className="font-medium">Time:</span> {time}
        </p>
        <p>
          <span className="font-medium">Doctor:</span> {doctorName || "N/A"}
        </p>
      </div>
    </div>
  );

  if (isLoading)
    return (
      <div className=" flex justify-center items-center h-screen">
        <MedReserveLoader />
      </div>
    );
  return (
    <Box className=" space-y-6">
      <Paper radius="md" className=" space-y-2 p-6">
        <Text fw={700} fz={24} lh={"28px"} c="m-blue">
          Hello, {credentials?.username}
        </Text>
        <Text c="m-gray" lh={"24px"}>
          Follow the steps below to reschedule your appointment
        </Text>
      </Paper>

      <form
        onSubmit={form.onSubmit(
          async (values) => await handleTransaction(values, "reschedule-fees")
        )}
      >
        <Stepper active={active}>
          <Stepper.Step
            label="Current details"
            description="Your current appointment details"
          >
            <Paper className="p-6">
              <div className=" mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Current Appointment Details
                </h2>

                <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Image
                      src={data?.doctorId.profilePicture as string}
                      width={50}
                      height={50}
                      className=" rounded-full"
                      alt="profile picture"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-lg">
                        {data?.doctorId.fullname}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data?.doctorId.specialization &&
                          parseResponse(
                            data?.doctorId.specialization as string
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <IconCalendar className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {data?.bookingDate}
                      </p>
                      <p className="text-sm text-gray-600">Scheduled date</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <IconClock className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {getAMPM(`${data?.startTime}`)} -
                        {getAMPM(`${data?.endTime}`)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data?.doctorId?.specialization &&
                          getAppointmentLocation(
                            data?.doctorId?.specialization as string
                          )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rescheduling Policy */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <IconAlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">
                        Rescheduling Policy
                      </h3>
                      <ul className="text-sm text-amber-800 space-y-1">
                        {Rescheduling_Policy.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {data?.paymentId.length === 4 ? (
                  <Alert
                    variant="light"
                    color="red"
                    title="Maximum Reschedule Limit Reached"
                    icon={<IconX size={16} />}
                  >
                    Your appointment cannot be rescheduled because it has been
                    rescheduled for a maximum of 3 times.
                  </Alert>
                ) : (
                  <Button
                    type="button"
                    size="md"
                    onClick={() => setActive(1)}
                    fullWidth
                  >
                    Continue to Reschedule
                  </Button>
                )}
              </div>
            </Paper>
          </Stepper.Step>

          {/* Step 2 */}

          <Stepper.Step
            label="Select Date & Time"
            description="Select a new date and time for your appointment"
          >
            <Paper className="p-6">
              <div className=" mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select New Date & Time
                </h2>

                <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />

                <section className="space-y-12">
                  <div id="rescheduleWrapper">
                    <Text fz={"20px"} lh={"28px"} fw={700} c="m-blue" mb="20px">
                      Date Slots
                    </Text>
                    <RescheduleDateCarousel
                      setSelectedDate={handleSelectedDate}
                      activeDate={form.getValues().bookingDate}
                      excludeDates={
                        data?.doctorId?.doctorAvailability
                          ?.workSchedule as string[]
                      }
                    />
                  </div>

                  {form.getValues().bookingDate && (
                    <div className="relative">
                      <LoadingOverlay
                        visible={isLoadingSlots}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                      />
                      <Text
                        fz={"20px"}
                        lh={"28px"}
                        fw={700}
                        c="m-blue"
                        mb="20px"
                      >
                        Time Slots
                      </Text>
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
                          isWeekend()
                            ? (data?.doctorId?.doctorAvailability
                                ?.weekendStartTime as string)
                            : (data?.doctorId?.doctorAvailability
                                ?.weekdayStartTime as string)
                        }
                        maxTime={
                          isWeekend()
                            ? (data?.doctorId?.doctorAvailability
                                ?.weekendEndTime as string)
                            : (data?.doctorId?.doctorAvailability
                                ?.weekdayEndTime as string)
                        }
                        disableTime={
                          !data
                            ? []
                            : availableSlots?.filter(
                                (item) => item !== form.getValues().startTime
                              )
                        }
                      />
                    </div>
                  )}

                  <CustomInput
                    size="md"
                    withAsterisk
                    placeholder="What may be your reason for rescheduling an Appointment"
                    styles={{ input: { width: "100%" } }}
                    {...form.getInputProps("reasonForReschedule")}
                    key={form.key("reasonForReschedule")}
                    radius={15}
                    type="textarea"
                    label="Reason for Rescheduling Appointment"
                  />

                  <Checkbox
                    key={form.key("isReschedueledPolicyConfirm")}
                    {...form.getInputProps("isReschedueledPolicyConfirm", {
                      type: "checkbox",
                    })}
                    label="I understand and agree to the rescheduling policy. I acknowledge that rescheduling an appointment  may incur additional fees."
                  />
                </section>
                <Group grow mt="xl">
                  <Button
                    variant="subtle"
                    size="lg"
                    onClick={prevStep}
                    type="button"
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!isFormValid() as boolean}
                    size="lg"
                    onClick={nextStep}
                    type="button"
                  >
                    Continue to Reschedule
                  </Button>
                </Group>
              </div>
            </Paper>
          </Stepper.Step>

          {/* Step 3 */}
          <Stepper.Step
            label="Payment Details & Summary"
            description="Review and Make Payments"
          >
            <Paper className="p-6">
              <div className=" mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>

                <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />

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
                      value={form.getValues().phone}
                      className=" phone-no"
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
                      data={capacityData}
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
                </Grid>

                <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />

                <Box className="space-y-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Review Changes
                  </h2>
                  {reviewCard(
                    data?.bookingDate as string,
                    data?.startTime as string,
                    data?.doctorId.fullname as string,
                    "Current"
                  )}
                  {reviewCard(
                    form.getValues().bookingDate as string,
                    form.getValues().startTime as string,
                    data?.doctorId.fullname as string,
                    "New"
                  )}
                </Box>

                <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />

                <Box bg="m-gray.0" px="md" py="lg" mt="lg">
                  <Text fz={"20px"} fw={600} c="m-background.9" mb="md">
                    Payment Summary
                  </Text>

                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Initial Consultation Fees
                    </Text>
                    <Text fz={"15px"} td="line-through" fw={500} c="m-blue">
                      {formatCurrency(Number(consultationFee))}
                    </Text>
                  </Group>

                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Reschedule Fees
                    </Text>
                    <Text fz={"15px"} fw={500} c="m-blue">
                      {formatCurrency(Number(form.getValues().amount))} x{" "}
                      {form.getValues().capacity}
                    </Text>
                  </Group>

                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Administrative Fees
                    </Text>
                    <Text fz={"15px"} fw={500} c="m-blue">
                      {formatCurrency(Number(consultationFee) * (administrationFee / 100))}
                    </Text>
                  </Group>
                  <Divider color={"m-gray"} size="xs" variant="solid" />
                  <Group justify="space-between" mb="md">
                    <Text fz={"15px"} fw={500} c="m-gray">
                      Total
                    </Text>
                    <Text fz={"15px"} fw={500} c="m-blue">
                      {formatCurrency(
                        Number(form.getValues().amount) *
                          Number(form.getValues().capacity) +
                          Number(consultationFee) * (administrationFee / 100)
                      )}
                    </Text>
                  </Group>
                </Box>

                <Group grow mt="xl">
                  <Button
                    variant="subtle"
                    size="lg"
                    onClick={prevStep}
                    type="button"
                  >
                    Back
                  </Button>
                  <Button size="lg" type="submit" loading={form.submitting}>
                    Checkout Now
                  </Button>
                </Group>
              </div>
            </Paper>
          </Stepper.Step>

          <Stepper.Completed>
            <div className="bg-white rounded-lg p-8  w-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconCircleCheckFilled className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Rescheduled!
              </h3>
              <h2 className=" text-xl font-bold text-center my-4 text-secondary">
                Ref: {message?.reference}
              </h2>
              <p className="text-gray-600 mb-4">
                Your appointment has been successfully rescheduled. A
                confirmation email has been sent to your registered email
                address.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-lg text-gray-700 mb-1">
                  <span className="font-medium">New Date:</span>{" "}
                  {new Date(message?.date as string).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-medium">New Time:</span> {message?.time}
                </p>
              </div>
            </div>
            <Group grow mt="xl">
              <Button
                variant="subtle"
                size="lg"
                onClick={() => {
                  form.reset();
                  setActive(0);
                }}
                type="button"
              >
                Reschedule Again
              </Button>
              <Button
                size="lg"
                type="button"
                leftSection={<IconHome/>}
                onClick={() =>
                  router.push(
                    `/patient/${credentials?.userId}/dashboard/appointments`
                  )
                }
              >
                Return Home
              </Button>
            </Group>
          </Stepper.Completed>
        </Stepper>
      </form>
    </Box>
  );
};

export default RescheduleAppointment;
