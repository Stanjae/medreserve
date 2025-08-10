"use client";
import React, { useState } from "react";
import {
  Container,
  Card,
  Group,
  Text,
  Badge,
  Avatar,
  Alert,
  List,
  Button,
  Stack,
  Divider,
  Paper,
  Timeline,
  NumberFormatter,
  Grid,
  GridCol,
  Loader,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconAlertCircle,
  IconCheck,
  IconCalculator,
  IconEye,
  IconFlagDollar,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  cancelAppointmentResponse,
  RefundAppointmentParams,
} from "@/types/actions.types";
import { getAMPM, getAMPWAT } from "@/utils/utilsFn";
import dayjs from "dayjs";
import { useForm } from "@mantine/form";
import { RefundSchema } from "@/lib/schema/zod";
import { adminFee, refundRate, refundReasons } from "@/constants";
import CustomInput from "../inputs/CustomInput";
import useGetAllBanks from "@/hooks/useGetAllBanks";
import useGetBankAccountDetails from "@/hooks/useGetBankAccountDetails";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useCancelAppointment from "@/hooks/useCancelAppointment";

interface RefundAppointmentProps {
  appointment: cancelAppointmentResponse;
}

const RefundAppointmentForm = ({ appointment }: RefundAppointmentProps) => {
  const [explanation, setExplanation] = useState("");
  const [newBankAccountNumber, setNewBankAccountNumber] = useState<string>();

  const { data: banks } = useGetAllBanks();

  const consultationFee = appointment.paymentId?.find(
    (item) => item.type === "initial-fees"
  )?.amount as number;
  const cancellationFee = consultationFee * (refundRate / 100);
  const adminFees = consultationFee * (adminFee / 100);
  const refundAmount = consultationFee - cancellationFee - adminFees;

  const form = useForm<RefundAppointmentParams>({
    mode: "uncontrolled",
    initialValues: {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.slotId,
      refundAmount: 0,
      consultationFee,
      cancellationFee,
      status: "pending",
      reason: "",
      type: "refund",
      bankCode: "",
      bankName: "",
      bankAccountNumber: "",
      },
    transformValues: (values) => ({
      ...values,
      reason: `${values.reason} - ${explanation}`,
    }),
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

  const {  showProcessing, handleCancelAction } =
    useCancelAppointment(appointment?.refundStatus);

  form.watch("reason", ({ value }) => {
    if (value === "medical_emergency" || value === "hospitalization") {
      const resolvedvalue = refundAmount - (5 / 100) * consultationFee;
      form.setValues({ refundAmount: resolvedvalue });
    } else {
      const resolvedvalue = refundAmount - (7.5 / 100) * consultationFee;
      form.setValues({ refundAmount: resolvedvalue });
    }
  });

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
    
    const activeStep = appointment?.refundStatus == "pending" ? 1 : appointment?.refundStatus == "approved" ? 2 : 0;

  const submitHandler = form.onSubmit(async(vals) => await handleCancelAction(vals, "refunded"));

  const handleButtonClick = () => {
    submitHandler(); // Note the double parentheses!
  };

  if (showProcessing || appointment?.refundStatus) {
    return (
      <Container size="md" py="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Text size="xl" fw={600} mb="xl">
            Refund Request Status
          </Text>

          <Timeline active={activeStep} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              bullet={<IconCheck size={12} />}
              title="Request Submitted"
            >
              <Text c="dimmed" size="sm">
                Aug 15, 2024 - 2:30 PM
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconEye size={12} />}
              title="Under Review"
              color="gray"
            >
              <Text c="dimmed" size="sm">
                Pending review completion
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconFlagDollar size={12} />}
              title="Refund Processing"
              color="gray"
            >
              <Text c="dimmed" size="sm">
                If approved: 5-7 business days
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        {/* Appointment Header */}
        <Group justify="space-between" mb="lg">
          <Group>
            <Avatar
              color="grape"
              src={appointment?.doctorProfilePicture}
              radius="xl"
              size="lg"
            />
            <div>
              <Text fw={600} size="lg">
                {appointment?.doctorName}
              </Text>
              <Group gap="md" c="dimmed" fz="sm">
                <Group gap={4}>
                  <IconCalendar size={14} />
                  <Text>{appointment?.bookingDate}</Text>
                </Group>
                <Group gap={4}>
                  <IconClock size={14} />
                  <Text>
                    {getAMPWAT(
                      `${appointment?.bookingDate}T${appointment?.startTime}`
                    )}{" "}
                    -{" "}
                    {getAMPWAT(
                      `${appointment?.bookingDate}T${appointment?.endTime}`
                    )}
                  </Text>
                </Group>
                <Group gap={4}>
                  <IconMapPin size={14} />
                  <Text>{appointment?.doctorSpecialization}</Text>
                </Group>
              </Group>
            </div>
          </Group>
          <Badge color="red" variant="light">
            Missed
          </Badge>
        </Group>

        <Divider mb="lg" />

        {/* Missed Appointment Notice */}
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Appointment Missed"
          color="yellow"
          mb="lg"
        >
          You did not attend your scheduled appointment on{" "}
          {dayjs(appointment?.bookingDate).format("MMM DD, YYYY")} at{" "}
          {getAMPM(appointment?.startTime)}. You may be eligible for a refund if
          you have a valid reason.
        </Alert>

        {/* Refund Eligibility */}
        <Alert
          icon={<IconCheck size={16} />}
          title="Refund Eligibility Criteria"
          color="green"
          mb="lg"
        >
          <List spacing={4} size="sm" mt="xs">
            <List.Item icon={<IconCheck size={14} color="green" />}>
              Medical emergency with documentation
            </List.Item>
            <List.Item icon={<IconCheck size={14} color="green" />}>
              Family emergency with proof
            </List.Item>
            <List.Item icon={<IconCheck size={14} color="green" />}>
              Transportation issues (weather, accidents)
            </List.Item>
            <List.Item icon={<IconCheck size={14} color="green" />}>
              Hospital admission
            </List.Item>
          </List>
        </Alert>

        {/* Refund Application Form */}
        <Paper p="lg" radius="md" bg="gray.0" mb="lg">
          <Text fw={600} mb="lg">
            Apply for Refund
          </Text>

          <Stack gap="md">
            <CustomInput
              type="select"
              label="Reason for Missing Appointment"
              placeholder="Select reason"
              data={refundReasons}
              key={form.key("reason")}
              {...form.getInputProps("reason")}
              radius={35}
              withAsterisk
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

            <CustomInput
              type="textarea"
              label="Detailed Explanation"
              placeholder="Please provide detailed explanation of your situation..."
              value={explanation}
              maxLength={300}
              onChange={(e) => setExplanation(e.target.value)}
              minRows={4}
              radius={35}
              withAsterisk
            />
          </Stack>
        </Paper>

        {/* Refund Calculation */}
        {form.values.reason && (
          <Alert
            icon={<IconCalculator size={16} />}
            title="Estimated Refund"
            color="blue"
            mb="lg"
          >
            <Stack gap={8} mt="sm">
              <Group justify="space-between">
                <Text size="sm">Original Amount:</Text>
                <NumberFormatter
                  prefix="₦"
                  value={consultationFee}
                  thousandSeparator
                  decimalScale={2}
                />
              </Group>

              <Group justify="space-between">
                <Text size="sm">Administrative Fee:</Text>
                <NumberFormatter suffix="%" value={5} decimalScale={2} />
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={600}>Estimated Refund:</Text>
                <Text fw={600} c="green">
                  <NumberFormatter
                    prefix="₦"
                    value={form.values.refundAmount}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Text>
              </Group>
            </Stack>

            <Alert
              icon={<IconInfoCircle size={14} />}
              color="yellow"
              mt="sm"
              variant="outline"
            >
              <Text size="xs">
                Final refund amount depends on approval and verification of
                submitted documents.
              </Text>
            </Alert>
          </Alert>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <CustomCancelBtn
            btnProps={{
              radius: 35,
              size: "md",
              color: "red",
              loading: form.submitting,
            }}
            btnText="Confirm Refund"
            modalHeader="Initiate Refund"
            fn={handleButtonClick}
            modalContent="Are you sure you want to request for a refund?"
          />
        </Group>
      </Card>
    </Container>
  );
};

export default RefundAppointmentForm;
