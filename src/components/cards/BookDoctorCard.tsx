"use client";
import { Button, Divider, Flex, Group, Rating, Text } from "@mantine/core";
import Image from "next/image";
import React from "react";
import { Doctor } from "../../../types/appwrite";
import { IconArrowRight, IconClockHour5 } from "@tabler/icons-react";
import { getAMPM } from "@/utils/utilsFn";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMedStore } from "@/providers/med-provider";

const BookDoctorCard = ({ item }: { item: Doctor }) => {
    const {setWeekSchedule, setDateTime} = useMedStore(state => state)
  const total =
    item?.rating?.length == 0
      ? 1
      : item?.rating?.reduce((acc:string, val:string) => Number(acc) + Number(val), 0);
  const totalCount = !item?.rating?.length ? 1 : item?.rating?.length;
  const newRating = ((total as number) / totalCount) as number;

  const searchParams = useSearchParams();
  const isWeekdayOrWeekend = searchParams.get("date")
    ? dayjs(searchParams.get("date")).get("day")
        : dayjs().get("day");
    
    console.log('hunter: ', item);

    const handleSettingBookingParams = () => {
      setWeekSchedule(item?.workSchedule);
      setDateTime({
        date: searchParams.get("date") ? searchParams.get("date") as string : dayjs().format('YYYY-MM-DD'),
        minTime: isWeekdayOrWeekend == 0 || isWeekdayOrWeekend == 6 ? item?.weekendStartTime as string : item?.weekdayStartTime as string,
        maxTime: isWeekdayOrWeekend == 0 || isWeekdayOrWeekend == 6 ? item?.weekendEndTime as string : item?.weekdayEndTime as string
      });
    };
  return (
    <div>
      <Flex pt={36} direction={{base:'column', md:'row'}} gap={30} pb={61} align={"center"}>
        <Image
          width={143}
          className=" w-[143px] rounded-full h-[143px]"
          height={143}
          src={item?.profilePicture as string}
          alt="doctor image"
        />
        <div className=" space-y-0.5">
          <Text
            c="m-blue"
            className=" text-[24px] leading-[34px] font-[800]"
            component="h4"
          >
           Dr. {" "} {item?.fullname}
          </Text>
          <div className="flex gap-2 items-center">
            <Rating readOnly fractions={2} defaultValue={newRating} />
            <Text>
              {newRating}/({totalCount})
            </Text>
          </div>
          <Group>
            <Text
              c="m-gray"
              className=" capitalize text-[16px] leading-[34px]"
              fw={500}
            >
              {item?.specialization}
            </Text>
            <Divider orientation="vertical" color="m-gray" size="xs" />
            <Text c="m-gray" className=" text-[16px] leading-[34px]" fw={500}>
              {item?.experience + " years experience"}
            </Text>
          </Group>
          <Group>
            <Text c="m-gray" className=" text-[18px] leading-[34px]" fw={500}>
              Availabilty
            </Text>
            <IconClockHour5 size={16} stroke={1.5} />
            <Text c="m-gray" className=" text-[18px] leading-[34px]" fw={500}>
              {getAMPM(
                isWeekdayOrWeekend == 0 || isWeekdayOrWeekend == 6
                  ? (item?.weekendStartTime as string)
                  : (item?.weekdayStartTime as string)
              )}{" "}
              -{" "}
              {getAMPM(
                isWeekdayOrWeekend == 0 || isWeekdayOrWeekend == 6
                  ? (item?.weekendEndTime as string)
                  : (item?.weekdayEndTime as string)
              )}
            </Text>
            <Divider orientation="vertical" color="m-gray" size="xs" />
            <Text c="m-gray" className=" text-[16px] leading-[34px]" fw={500}>
              On{" "}
              {isWeekdayOrWeekend == 0 || isWeekdayOrWeekend == 6
                ? "Weekends"
                : "Weekdays"}
            </Text>
          </Group>
          <Button
            component={Link}
            href={`/doctor/${item?.userId}`}
            size="md"
            className="pl-0"
            rightSection={<IconArrowRight />}
            variant="transparent"
          >
            Profile and Reviews
          </Button>
        </div>
              <Button onClick={handleSettingBookingParams} component={Link} href={`book-appointment/${item?.$id}/step-1`} radius={35} size="lg" className=" px-[47px] ml-auto">
          Book
        </Button>
      </Flex>
      <Divider color={"m-cyan"} my="sm" size="md" variant="dotted" />
    </div>
  );
};

export default BookDoctorCard;
