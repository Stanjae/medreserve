/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMedStore } from "@/providers/med-provider";
import { addOrSubtractTime } from "@/utils/utilsFn";
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
  Text,
  Transition,
} from "@mantine/core";
import { DatePicker, getTimeRange, TimeGrid } from "@mantine/dates";
import React, { useEffect } from "react";
import SubmitBtn from "../CButton/SubmitBtn";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockHour5,
  IconInfoCircle,
  IconSend2,
} from "@tabler/icons-react";
import CustomInput from "../molecules/inputs/CustomInput";
import useReserveAppointment from "@/hooks/useReserveAppointment";
import { useForm } from "@mantine/form";
import { CreateBookingSchema } from "@/lib/schema/zod";
import { toast } from "sonner";
import { CreateAppointmentParams2 } from "@/types/actions.types";
import CustomModal from "../modals/CustomModal";
import useGetAvailableSlots from "@/hooks/useGetAvailableSlots";
import useCheckIfUserBookedASlot from "@/hooks/useCheckIfUserBookedASlot";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import dayjs from "dayjs";
import { appointmentTypeData } from "@/constants";
import { useRouter } from "next/navigation";

export const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

const CreateAppointmentForm = ({ doctorId }: { doctorId: string }) => {
  const { weekSchedule, dateTime, credentials, setDateTime } = useMedStore(
    (state) => state
  );
  const router = useRouter();
  
  const { createReservation, close, opened, response, cancelReservation } =
    useReserveAppointment();

  const { data, isLoading } = useGetAvailableSlots(dateTime.date, doctorId);

  const {
    data: userBookedSlot,
    isLoading: loading2,
    isSuccess: success,
  } = useCheckIfUserBookedASlot(
    doctorId,
    dateTime.date,
    credentials?.databaseId as string
  );

  const form = useForm<CreateAppointmentParams2>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: "",
      patientId: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      reason: "",
      status: "pending",
      appointmentType: "",
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

  const cancelAppointmentFn = async () => {
    await cancelReservation.mutateAsync(userBookedSlot?.at(0)?.$id as string);
    form.reset();
  };

  const navigateToPayment = () =>
    router.push(
      `/patient/${credentials?.userId}/dashboard/appointments/book-appointment/${doctorId}/step-2?slotId=${userBookedSlot?.at(0)?.$id}`
    );

  return (
    <div className="relative">
      <CustomModal
        size={"lg"}
        closeButtonProps={{ icon: <div></div> }}
        overlayProps={{ blur: 10, backgroundOpacity: 0.55 }}
        closeOnClickOutside={false}
        onClose={close}
        opened={opened}
      >
        <div className="flex justify-center px-4 py-2">
          {createReservation.isPending && <Loader color="m-blue" size={80} />}
          <Transition
            mounted={
              !createReservation.isPending &&
              createReservation?.status == "success"
            }
            transition={scaleY}
            duration={200}
            timingFunction="ease"
            keepMounted
          >
            {(styles) =>
              response?.code == 201 ? (
                <IconCircleCheckFilled
                  style={{ ...styles, zIndex: 1, color: "green" }}
                  size={80}
                />
              ) : (
                <IconCircleXFilled
                  style={{ ...styles, zIndex: 1, color: "red" }}
                  size={80}
                />
              )
            }
          </Transition>
        </div>
        {!createReservation.isPending && response?.status === "success" && (
          <Text
            fz={"28px"}
            ta={"center"}
            lh={"38px"}
            fw={700}
            className="text-black"
            mb="30px"
          >
            {response?.message}
          </Text>
        )}
        {!createReservation.isPending && response?.status === "success" && (
          <Group justify="center">
            <Button variant="outline" size="lg" color="red" onClick={close}>
              Close
            </Button>
            {response.code == 201 && (
              <Button
                radius={35}
                size="lg"
                color="m-blue"
                rightSection={<IconSend2 />}
              onClick={navigateToPayment}
              >
                Continue to Payment
              </Button>
            )}
          </Group>
        )}
      </CustomModal>

      <LoadingOverlay
        visible={loading2}
        zIndex={2000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {!userBookedSlot && (
        <form
          onSubmit={form.onSubmit(
            async (values) => await createReservation.mutateAsync(values)
          )}
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
                onChange={(value) => setDateTime({ ...dateTime, date: value })}
                minDate={dayjs().format("YYYY-MM-DD")}
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
              <CustomInput
                mt={20}
                required
                size="md"
                radius={35}
                type="select"
                data={appointmentTypeData}
                placeholder="Select Type of Appointment"
                label="Type of Appointment"
                key={form.key("appointmentType")}
                {...form.getInputProps("appointmentType")}
              />
            </GridCol>
          </Grid>
          <Divider color={"m-cyan"} my="lg" size="md" variant="dotted" />
          <Box>
            <CustomInput
              size="lg"
              withAsterisk
              placeholder="What may be your reason for booking an Appointment"
              styles={{ input: { width: "100%" } }}
              {...form.getInputProps("reason")}
              key={form.key("reason")}
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
              disabled={!form.isValid()}
              size="lg"
              radius={35}
            />
          </Group>
        </form>
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
              btnText="Cancel Reservation"
              modalHeader="Cancel Reservation"
              fn={cancelAppointmentFn}
              loading={cancelReservation.isPending}
              modalContent="Are you sure you want to cancel this reservation?"
            />
            <Button
              radius={35}
              size="lg"
              color="m-blue"
              rightSection={<IconSend2 />}
              onClick={navigateToPayment}
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
