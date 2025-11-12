"use client";
import { workSchedule } from "@/constants";
import useCheckIfUserBookedASlot from "@/hooks/useCheckIfUserBookedASlot";
import { useMedStore } from "@/providers/med-provider";
import {
  addOrSubtractTime,
  getCalendarDateTime,
  parseResponse,
} from "@/utils/utilsFn";
import { Card, Pill, Rating, Skeleton, Text } from "@mantine/core";
import { IconClockHour5 } from "@tabler/icons-react";
import React from "react";

type Props = {
  fullname: string;
  rating: number;
  count: number;
  doctorId: string;
  specialization: string;
  workingDays: string[] | null;
};

const DoctorBookingProfileStatus = ({
  fullname,
  rating,
  doctorId,
  specialization,
  workingDays,
}: Props) => {
  const { dateTime, credentials } = useMedStore((state) => state);

  const { data, isLoading, isSuccess } = useCheckIfUserBookedASlot(
    doctorId,
    dateTime.date,
    credentials?.databaseId as string
  );

  const newWorkingDays = workSchedule
    .filter((item) => workingDays?.includes(item.value))
    ?.map((item, index) => (
      <Pill key={index} className=" border border-primary text-secondary">
        {item.label}
      </Pill>
    ));

  return (
    <div className=" space-y-4">
      <Card className="rounded-xl" bg="m-cyan.0" px={40} py={27}>
        <Text
          c="m-blue"
          component="h4"
          className=" text-2xl font-extrabold leading-[44px]"
        >
          Dr. {fullname}
        </Text>
        <Pill.Group>{newWorkingDays}</Pill.Group>
        <div className="flex gap-2 items-center">
          <Rating readOnly fractions={2} defaultValue={rating} />
          <Text>
            { rating ? rating.toFixed(1) : 1 }/5
          </Text>
        </div>
        <Text
          c="m-gray"
          className="leading-[30px] capitalize mt-1 text-[16px] font-medium"
        >
          {parseResponse(specialization)}
        </Text>
        {isSuccess && data && (
          <Text
            c="m-gray"
            className="leading-[30px] mt-1 text-[16px] font-medium"
          >
            You&apos;ll be seeing Dr. {fullname}{" "}
            {getCalendarDateTime(
              `${data?.at(0)?.bookingDate} ${data?.at(0)?.startTime}`
            )}
          </Text>
        )}
      </Card>
      {isLoading && isSuccess && <Skeleton radius="xl" height={200} />}
      {isSuccess && data && (
        <Card className="rounded-xl" bg="m-orange.0" px={40} py={27}>
          <div className="flex gap-2 items-center">
            <IconClockHour5 className=" text-primary" size={34} stroke={2.5} />
            <Text
              c="m-blue"
              component="h3"
              className=" text-[34px] font-extrabold leading-[34px]"
            >
              {data &&
                isSuccess &&
                addOrSubtractTime(
                  data?.at(0)?.$createdAt as string,
                  "add",
                  2,
                  "hour",
                  "am-pm"
                )}
            </Text>
          </div>
          <Text
            c="m-gray"
            className="leading-[30px] mt-1 text-[16px] font-medium"
          >
            We&apos;re holding your appointment while you complete your booking.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default DoctorBookingProfileStatus;
