"use client";
import { cancel_refundStatusFilter, refundTextStatusInfo,   refundTextStatusInfo2,   statusConfig } from "@/constants";
import { AppointmentColumnsType } from "@/types/table.types";
import {
  checkDateTimeDifferenceFromNow,
  convertToCurrency,
  getAMPWAT,
  getCalendarDateTime,
  parseResponse,
} from "@/utils/utilsFn";
import { Avatar, Badge, Card, Divider, Group, Text, Timeline } from "@mantine/core";
import { IconArrowBackUp, IconCancel, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";

type Props = {
  row: AppointmentColumnsType | undefined;
};

const AppointmentDetails = ({ row }: Props) => {
  const totalAmt = row?.paymentId.reduce(
    (initial, current) => current?.amount + initial,
    0
  );
  const totalRating =
    (row?.rating?.reduce(
      (initial, current) => Number(current) + Number(initial),
      0
    ) as number) ?? 0;
  const ratingCount = (row?.rating?.length as number) ?? 0;

  const avgRating = (totalRating / ratingCount).toFixed(1);

  const initialFee = row?.paymentId?.find(
    (item) => item?.type === "initial-fees"
  );

  const consultationFee = convertToCurrency(initialFee?.amount as number);

  const config =
    statusConfig[row?.appointmentStatus as keyof typeof statusConfig];
  const IconComponent = config.icon;

  const appointmentStatus =
    row?.appointmentStatus == "cancelled"
      ? refundTextStatusInfo
      : row?.appointmentStatus == "refunded" ? refundTextStatusInfo2 : null;
  
  const activeStep = appointmentStatus?.findIndex((step) => step.status == row?.cancelRefund?.status);
  return (
    <div className=" bg-background p-[20px]">
      <div className="space-y-3">
        {/*  Status & Quick Info */}
        <div id="drawer-section">
          <Group justify="space-between" mb={16}>
            <Badge
              leftSection={<IconComponent size={12} />}
              color={config.color}
              variant={config.variant}
            >
              {row?.appointmentStatus}
            </Badge>
            <div className="text-right">
              <Text c="dimmed" size={"12px"}>
                Booked on
              </Text>
              <Text className="text-[14px] font-medium">
                {dayjs(row?.createdAt).format("MMM, DD, YYYY")}
              </Text>
            </div>
          </Group>

          <Group justify="center">
            <Card className=" grow-1 text-center" withBorder>
              <Text size="xl" c="m-orange" fw="bold">
                {checkDateTimeDifferenceFromNow(
                  `${row?.bookingDate}T${row?.startTime}`,
                  "hour"
                ) * -1}{" "}
                H
              </Text>
              <Text size={"13px"} c="dimmed">
                Until appointment
              </Text>
            </Card>

            <Card className=" grow-1 text-center" withBorder>
              <Text size="xl" c="green" fw="bold">
                &#8358; {convertToCurrency(totalAmt as number)}
              </Text>
              <Text size={"13px"} c="dimmed">
                Total Cost
              </Text>
            </Card>
          </Group>
        </div>

        <Divider my="md" variant="dotted" color={"m-cyan"} />
        {/*  <!-- Doctor Information --> */}
        <div className="space-y-2">
          <Text c={"m-blue"} size={"lg"} fw={600}>
            👨‍⚕️ Healthcare Provider
          </Text>

          <Card withBorder p={30} radius={"md"}>
            <Card.Section className="flex items-center gap-x-2 ">
              <Avatar src={row?.profilePicture} size={"lg"} alt="it's me" />
              <section className="flex-1">
                <h4 className="mb-1 text-[16px] capitalize">
                  Dr. {row?.doctorName}
                </h4>
                <Text c="dimmed" tt="capitalize" size={"14px"}>
                  {parseResponse(row?.specialization as string)}
                </Text>
                <Text size={"13px"} c="m-blue" className="mt-1 ">
                  ⭐{avgRating} • {row?.doctorExperience} years experience
                </Text>
              </section>
            </Card.Section>
          </Card>
        </div>

        <Divider my="md" variant="dotted" color={"m-cyan"} />

        {/*  <!-- Appointment Details --> */}
        <div className="space-y-2">
          <Text c={"m-blue"} size={"lg"} fw={600}>
            📅 Appointment Information
          </Text>

          <div className="space-y-3">
            <Group justify="space-between">
              <Text c="m-gray">Booking Code</Text>
              <Text>#{row?.id}</Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Date & Time</Text>
              <Text
                td={
                  cancel_refundStatusFilter.includes(
                    row?.appointmentStatus as string
                  )
                    ? "line-through"
                    : ""
                }
              >
                {getCalendarDateTime(`${row?.bookingDate}T${row?.startTime}`)},
                {dayjs(`${row?.bookingDate}T${row?.startTime}`).format(
                  "MMM, DD, YYYY"
                )}
                ,
                <br />
                {getAMPWAT(`${row?.bookingDate}T${row?.startTime}`)} -{" "}
                {getAMPWAT(`${row?.bookingDate}T${row?.endTime}`)}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Type</Text>
              <Text tt="capitalize">{row?.appointmentType}</Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Duration</Text>
              <Text>1 H</Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Reason</Text>
              <Text tt="capitalize">{row?.reason}</Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Consultation Attendance</Text>
              <Text tt="capitalize">
                {row?.didPatientSeeDoctor ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCancel color="red" />
                )}
              </Text>
            </Group>
          </div>
        </div>

        <Divider my="md" variant="dotted" color={"m-cyan"} />

        {/*   <!-- Payment Information --> */}
        <div className="space-y-2">
          <Text c={"m-blue"} size={"lg"} fw={600}>
            💳 Payment Information
          </Text>
          <div className="space-y-3">
            <Group justify="space-between">
              <Text c="m-gray">Consultation Fee</Text>
              <Text> &#8358; {consultationFee}</Text>
            </Group>

            <Group justify="space-between">
              <Text c="m-gray">Payment Status</Text>
              <Badge color={initialFee?.status == "success" ? "green" : "red"}>
                {initialFee?.status == "success" ? "Paid" : "Failed"}
              </Badge>
            </Group>
          </div>
        </div>

        <Divider my="md" variant="dotted" color={"m-cyan"} />

        {/*   <!-- refund/cancellation Information --> */}
        {appointmentStatus && (
          <div className="space-y-2">
            <Text
              c={"m-blue"}
              component="div"
              className="flex gap-x-2 items-center"
              size={"lg"}
              fw={600}
            >
              <IconArrowBackUp color="red" /> Cancellation/ Refund Information
            </Text>
            <div className="space-y-3 mt-3">
              <Timeline active={activeStep} bulletSize={24} lineWidth={3}>
                {appointmentStatus?.map((item, index) => (
                  <Timeline.Item
                    key={index}
                    title={
                      <span className="text-secondary">
                       {item.title}
                      </span>
                    }
                  >
                    <Group justify="start">
                      <Text tt="capitalize" c="dimmed" size="sm">
                        {item.subtitle}
                      </Text>
                    </Group>

                    <Text size="xs" mt={4}>
                      {item.status}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
