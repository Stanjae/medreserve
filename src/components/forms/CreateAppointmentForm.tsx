/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMedStore } from "@/providers/med-provider";
import { addOrSubtractTime, isbBeforeDateTime } from "@/utils/utilsFn";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  LoadingOverlay,
  Skeleton,
  Text,
  Transition,
} from "@mantine/core";
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates";
import React, { useEffect } from "react";
import SubmitBtn from "../CButton/SubmitBtn";
import {
  IconCircleCheckFilled,
  IconClockHour5,
  IconInfoCircle,
  IconSend2,
} from "@tabler/icons-react";
import CustomInput from "../inputs/CustomInput";
import useReserveAppointment from "@/hooks/useReserveAppointment";
import { useForm } from "@mantine/form";
import { CreateBookingSchema } from "@/lib/schema/zod";
import { toast } from "sonner";
import { CreateAppointmentParams2 } from "@/types/actions.types";
import CustomModal from "../modals/CustomModal";
import useGetAvailableSlots from "@/hooks/useGetAvailableSlots";
import useCheckIfUserBookedASlot from "@/hooks/useCheckIfUserBookedASlot";
import Link from "next/link";
import CustomCancelBtn from "../CButton/CustomCancelBtn";

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

const CreateAppointmentForm = ({ doctorId }: { doctorId: string }) => {
  const { weekSchedule, dateTime, credentials, setDateTime } = useMedStore(
    (state) => state
  );

  const { createAppointment, close, opened, response, cancelAppointment } =
    useReserveAppointment();

  const { data, isLoading } = useGetAvailableSlots(dateTime.date, doctorId);

  const form = useForm<CreateAppointmentParams2>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: "",
      patientId: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      notes: "",
      status: "pending",
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

  useEffect(() => {
    form.setValues({
      doctorId: doctorId,
      patientId: credentials?.databaseId as string,
      bookingDate: dateTime.date,
    });
  }, [dateTime, doctorId]);

  useEffect(() => {
    if (form.errors?.startTime) {
      toast.error(form.errors?.startTime);
    }
  }, [form.errors]);

  const {
    data: userBookedSlot,
    isLoading: loading2,
    isSuccess: success,
  } = useCheckIfUserBookedASlot(
    doctorId,
    dateTime.date,
    credentials?.databaseId as string
  );

  const cancelAppointmentFn = async () =>
    await cancelAppointment.mutateAsync(userBookedSlot?.at(0)?.$id as string);
  return (
    <div>
      <CustomModal
        size={"lg"}
        closeButtonProps={{ icon: <div></div> }}
        overlayProps={{ blur: 10, backgroundOpacity: 0.55 }}
        closeOnClickOutside={false}
        onClose={() => ""}
        opened={opened}
      >
        <div className="flex justify-center px-4 py-2">
          {(createAppointment.isPending || cancelAppointment.isPending) && (
            <Loader color="m-blue" size={80} />
          )}
          <Transition
            mounted={
              !(createAppointment.isPending || cancelAppointment.isPending) &&
              (createAppointment?.status == "success" ||
                cancelAppointment?.status == "success")
            }
            transition={scaleY}
            duration={200}
            timingFunction="ease"
            keepMounted
          >
            {(styles) => (
              <IconCircleCheckFilled
                style={{ ...styles, zIndex: 1, color: "green" }}
                size={80}
              />
            )}
          </Transition>
        </div>
        {!(createAppointment.isPending || cancelAppointment.isPending) &&
          response?.status === "success" && (
            <Text
              fz={"28px"}
              ta={"center"}
              lh={"38px"}
              fw={700}
              c="m-blue"
              mb="30px"
            >
              {response?.message}
            </Text>
          )}
        {!(createAppointment.isPending || cancelAppointment.isPending) &&
          response?.status === "success" && (
            <Group justify="center">
              <Button variant="outline" size="lg" color="red" onClick={close}>
                Close
              </Button>
              <Button
                radius={35}
                size="lg"
                color="m-blue"
                rightSection={<IconSend2 />}
                component={Link}
                href={`/patient/${credentials?.userId}/dashboard/appointments/book-appointment/${doctorId}/step-2?slotId=${userBookedSlot?.at(0)?.$id}`}
              >
                Continue to Payment
              </Button>
            </Group>
          )}
      </CustomModal>
      {loading2 ? (
        <Skeleton height={400} radius="lg" />
      ) : (
        !userBookedSlot && (
          <form
            onSubmit={form.onSubmit(async (values) => {
              if (
                isbBeforeDateTime(`${values.bookingDate} ${values.startTime}`)
              ) {
                toast.error("You cannot book an appointment in the past.");
                return;
              }
              await createAppointment.mutateAsync(values);
            })}
          >
            <Grid gutter={{ base: 10, sm: 30 }}>
              <GridCol span={{ base: 12, sm: 6 }}>
                <Text fz={"28px"} lh={"38px"} fw={700} c="m-blue" mb="30px">
                  Date Slots
                </Text>
                <DatePicker
                  size="md"
                  key={form.key("bookingDate")}
                  {...form.getInputProps("bookingDate")}
                  excludeDate={(date) =>
                    !weekSchedule?.includes(
                      new Date(date).getDay().toString()
                    ) as boolean
                  }
                  onChange={(value) =>
                    setDateTime({ ...dateTime, date: value })
                  }
                />
              </GridCol>
              <GridCol span={{ base: 12, sm: 6 }}>
                <Text fz={"28px"} lh={"38px"} fw={700} c="m-blue" mb="30px">
                  Time Slots
                </Text>
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
                    minTime={dateTime.minTime}
                    maxTime={dateTime.maxTime}
                    disableTime={!data ? [] : data}
                  />
                </Box>
              </GridCol>
            </Grid>
            <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />
            <Box>
              <CustomInput
                size="lg"
                withAsterisk
                placeholder="What may be your reason for booking an Appointment"
                styles={{ input: { width: "100%" } }}
                {...form.getInputProps("notes")}
                key={form.key("notes")}
                radius={15}
                type="textarea"
                label="Reason for Appointment"
              />
            </Box>
            <Group mt="lg" justify="flex-end">
              <SubmitBtn
                type="submit"
                leftSection={<IconClockHour5 />}
                text="Make Reservation"
                size="lg"
                radius={35}
              />
            </Group>
          </form>
        )
      )}
      {success && userBookedSlot && (
        <div>
          <Alert
            variant="light"
            color="blue"
            title="An Existing reservation exists"
            styles={{ label: { fontSize: "18px" } }}
            icon={<IconInfoCircle size={20} />}
          >
            You have an existing reservation. Click on the buttons below to
            either complete the appointment by proceeding to payment or cancel
            reservation.
          </Alert>
          <Group mt="lg" justify="flex-end">
            <CustomCancelBtn
              btnProps={{
                radius: 35,
                size: "lg",
                color: "red",
                variant: "subtle",
              }}
              btnText="Cancel Appointment"
              modalHeader="Cancel Appointment"
              fn={cancelAppointmentFn}
              modalContent="Are you sure you want to cancel this appointment?"
            />
            <Button
              radius={35}
              size="lg"
              color="m-blue"
              rightSection={<IconSend2 />}
              component={Link}
              href={`/patient/${credentials?.userId}/dashboard/appointments/book-appointment/${doctorId}/step-2?slotId=${userBookedSlot?.at(0)?.$id}`}
            >
              Continue to Payment
            </Button>
          </Group>
        </div>
      )}
    </div>
  );
};

export default CreateAppointmentForm;
