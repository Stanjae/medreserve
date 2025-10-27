"use client";
import {
  Card,
  Group,
  Avatar,
  Text,
  Badge,
  Button,
  Stack,
  Divider,
  Stepper,
  Alert,
  NumberFormatter,
  Container,
  Box,
  Flex,
  Grid,
  GridCol,
  Loader,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconAlertTriangle,
  IconCalendarDollar,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  CANCELLATION_REASONS,
  cancellationRate,
  refundTextStatusInfo,
  statusConfig,
} from "@/constants";
import CustomInput from "../molecules/inputs/CustomInput";
import {
  cancelAppointmentResponse,
  RefundAppointmentParams,
} from "@/types/actions.types";
import useCancelAppointment from "@/hooks/useCancelAppointment";
import { useForm } from "@mantine/form";
import { RefundSchema } from "@/lib/schema/zod";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useGetBankAccountDetails from "@/hooks/useGetBankAccountDetails";
import { useState } from "react";
import useGetAllBanks from "@/hooks/useGetAllBanks";

interface CancelAppointmentProps {
  appointment: cancelAppointmentResponse;
}

export default function CancelAppointmentForm({
  appointment,
}: CancelAppointmentProps) {
  const router = useRouter();

  const { data: banks } = useGetAllBanks();

  const { activeStep, showProcessing, handleCancelAction } =
    useCancelAppointment(appointment?.refundStatus);

  const consultationFee = appointment.paymentId?.find(
    (item) => item.type === "initial-fees"
  )?.amount as number;
  const cancellationFee = consultationFee * (cancellationRate / 100);
  const refundAmount = consultationFee - cancellationFee;

  const statusInfo =
    statusConfig[appointment.appointmentStatus as keyof typeof statusConfig];

  const form = useForm<RefundAppointmentParams>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.slotId,
      refundAmount,
      consultationFee,
      cancellationFee,
      status: "pending",
      reason: "",
      type: "cancellation",
      bankCode: "",
      bankName: "",
      bankAccountNumber: "",
    },
    validateInputOnChange: true,
    validate: (values) => {
      const schema = RefundSchema;
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

  const [newBankAccountNumber, setNewBankAccountNumber] = useState<string>();

  form.watch("bankCode", ({ value }) => {
    form.setValues({
      bankName: banks?.find(
        (item: { label: string; value: string }) => item?.value == value
      )?.label as string,
    });
  });

  form.watch("bankAccountNumber", ({ value }) => {
    if (value.length >= 10) {
      setNewBankAccountNumber(value);
    }

    if (value.length == 0 || value == "") {
      setNewBankAccountNumber("");
    }
  });

  const { data, isLoading, isFetching } = useGetBankAccountDetails(
    form.values.bankCode,
    newBankAccountNumber as string
  );

  const handleKeepAppointment = () => {
    router.back();
  };

  const initiateRefund = async () =>
    await handleCancelAction(form.values, "cancelled");

  const submitHandler = form.onSubmit(initiateRefund);

  const handleButtonClick = () => {
    submitHandler(); // Note the double parentheses!
  };

  if (showProcessing || appointment?.refundStatus) {
    return (
      <Container size="xl" py="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xl">
            <Stepper
              active={activeStep}
              orientation="horizontal"
              size="sm"
              color="red"
            >
              <Stepper.Step
                label="Cancelling"
                description="Processing cancellation"
                loading={activeStep === 0}
              />
              <Stepper.Step
                label="Refunding"
                description="Processing refund"
                loading={activeStep === 1}
              />
              <Stepper.Step
                label="Confirming"
                description="Sending confirmation"
                loading={activeStep === 2}
              />
            </Stepper>

            <Box mt="xl" ta="center">
              <Text size="lg" fw={500} mb="xs">
                {refundTextStatusInfo[activeStep - 1]?.title}
              </Text>
              <Text c="dimmed" size="sm">
                {refundTextStatusInfo[activeStep - 1]?.subtitle}
              </Text>
            </Box>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="lg">
          {/* Appointment Header */}
          <Group justify="space-between" pb="md">
            <Group>
              <Avatar
                size={48}
                radius="xl"
                gradient={{ from: "blue", to: "purple", deg: 135 }}
                src={appointment?.doctorProfilePicture}
              />
              <Box>
                <Text size="lg" fw={500}>
                  {appointment?.doctorName}
                </Text>
                <Group gap="md" c="dimmed" fz="sm">
                  <Group gap={4}>
                    <IconCalendar size={14} />
                    <Text>{appointment?.bookingDate}</Text>
                  </Group>
                  <Group gap={4}>
                    <IconClock size={14} />
                    <Text>{appointment?.startTime}</Text>
                  </Group>
                  <Group gap={4}>
                    <IconMapPin size={14} />
                    <Text>{appointment?.doctorSpecialization}</Text>
                  </Group>
                </Group>
              </Box>
            </Group>
            <Badge
              variant={statusInfo.variant}
              color={statusInfo.color}
              size="sm"
            >
              {appointment?.appointmentStatus}
            </Badge>
          </Group>

          <Divider />

          {/* Cancellation Section */}
          <Alert
            icon={<IconAlertTriangle size="1rem" />}
            title="Cancel Appointment"
            color="red"
            variant="light"
            radius="md"
          >
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Please select a reason for cancellation. Refund policies apply
                based on cancellation timing.
              </Text>

              <CustomInput
                type="select"
                radius={35}
                placeholder="Select cancellation reason"
                data={CANCELLATION_REASONS}
                key={form.key("reason")}
                {...form.getInputProps("reason")}
                searchable={false}
              />
              <Grid overflow="hidden" gutter={"md"}>
                <GridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <CustomInput
                    type="select"
                    radius={35}
                    placeholder="Select Bank Name"
                    data={banks}
                    key={form.key("bankCode")}
                    {...form.getInputProps("bankCode")}
                    searchable
                  />
                </GridCol>
                <GridCol span={{ base: 12, md: 6, lg: 3 }}>
                  <CustomInput
                    type="text"
                    placeholder="Enter your bank account number"
                    styles={{ root: { grow: 1 } }}
                    disabled={!form.isDirty("bankCode")}
                    radius={35}
                    key={form.key("bankAccountNumber")}
                    {...form.getInputProps("bankAccountNumber")}
                    onKeyDown={(event) => {
                      // Allow: backspace, delete, tab, escape, enter, arrows
                      if (
                        [8, 9, 27, 13, 46, 37, 38, 39, 40].includes(
                          event.keyCode
                        ) ||
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (event.ctrlKey &&
                          [65, 67, 86, 88].includes(event.keyCode))
                      ) {
                        return;
                      }
                      // Block if not a number
                      if (
                        event.shiftKey ||
                        ((event.keyCode < 48 || event.keyCode > 57) &&
                          (event.keyCode < 96 || event.keyCode > 105))
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <div className=" mt-2 flex items-center">
                    {(isLoading || isFetching) && <Loader size={"xs"} />}
                    {data?.status && (
                      <Text size="xs" fw={700} c="green.7">
                        {data?.data?.account_name}
                      </Text>
                    )}
                  </div>
                </GridCol>
              </Grid>
            </Stack>
          </Alert>

          {/* Refund Information */}
          <Card withBorder padding="md" radius="md" bg="blue.0">
            <Stack gap="xs">
              <Group gap="xs" c="blue.7">
                <IconCalendarDollar size={16} />
                <Text fw={500} size="sm">
                  Refund Details
                </Text>
              </Group>

              <Stack gap={4}>
                <Flex justify="space-between">
                  <Text size="sm">Consultation Fee:</Text>
                  <NumberFormatter
                    prefix="₦"
                    value={consultationFee}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Flex>

                <Flex justify="space-between">
                  <Text size="sm">Booking Fee:</Text>
                  <NumberFormatter
                    prefix="₦"
                    value={0}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Flex>

                <Flex justify="space-between">
                  <Text size="sm">Cancellation Fee:</Text>
                  <Text c="red">
                    <NumberFormatter
                      prefix="₦"
                      allowNegative
                      value={cancellationFee}
                      thousandSeparator
                      decimalScale={2}
                    />
                  </Text>
                </Flex>

                <Divider size="xs" color="blue.2" my={8} />

                <Flex justify="space-between">
                  <Text fw={600}>Refund Amount:</Text>
                  <Text fw={600} c="teal">
                    <NumberFormatter
                      prefix="₦"
                      value={refundAmount}
                      thousandSeparator
                      decimalScale={2}
                    />
                  </Text>
                </Flex>
              </Stack>

              <Text size="xs" c="dimmed" mt="xs">
                Refunds are processed within 3-5 business days
              </Text>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Group justify="flex-end" gap="md" mt="lg">
            <Button
              variant="light"
              color="gray"
              onClick={handleKeepAppointment}
            >
              Keep Appointment
            </Button>
            <CustomCancelBtn
              btnProps={{
                radius: 35,
                size: "md",
                color: "red",
                loading: form.submitting,
              }}
              btnText="Confirm Cancellation"
              modalHeader="Cancel Appointment"
              fn={handleButtonClick}
              modalContent="Are you sure you want to cancel this appointment?"
            />
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
