"use client";
import useCheckIfUserBookedASlot from "@/hooks/useCheckIfUserBookedASlot";
import { useMedStore } from "@/providers/med-provider";
import { addOrSubtractTime, getCalendarDateTime, parseResponse} from "@/utils/utilsFn";
import { Card, Rating, Skeleton, Text } from "@mantine/core";
import { IconClockHour5 } from "@tabler/icons-react";
import React from "react";

const DoctorBookingProfileStatus = ({
  fullname,
  rating,
  doctorId,
  specialization
}: {
  fullname: string;
  rating: string[];
    doctorId: string;
  specialization: string
}) => {
  const { dateTime, credentials } = useMedStore((state) => state);
  const total =
    rating?.length == 0
      ? 1
      : rating?.reduce((acc, val) => Number(acc) + Number(val), 0);
  const totalCount = rating?.length ? rating?.length : 1;
  const newRating = ((total as number) / totalCount) as number;

  const { data, isLoading, isSuccess } = useCheckIfUserBookedASlot(
    doctorId,
    dateTime.date,
    credentials?.databaseId as string
  );

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
        <div className="flex gap-2 items-center">
          <Rating readOnly fractions={2} defaultValue={newRating} />
          <Text>
            {newRating.toFixed(1)}/({totalCount})
          </Text>
        </div>
        <Text c="m-gray" className="leading-[30px] capitalize mt-1 text-[16px] font-medium">{parseResponse(specialization)}</Text>
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
