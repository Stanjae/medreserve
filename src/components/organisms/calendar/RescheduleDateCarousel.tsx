"use client";
import MedReserveCarousel from "@/components/atoms/carousel/MedReserveCarousel";
import { isTodayAfterDateTime, isTodayBeforeDateTime, isTodaySameWithDateTime } from "@/utils/utilsFn";
import { CarouselSlide } from "@mantine/carousel";
import { Indicator } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useCallback, useState } from "react";

type Props = {
  setSelectedDate: (date: string) => void;
  activeDate: string;
  excludeDates?: string[];
};

const RescheduleDateCarousel = ({
  setSelectedDate,
  activeDate,
  excludeDates,
}: Props) => {
  const [value, setValue] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const getDays = useCallback(() => {
    return Array(dayjs(value).daysInMonth())
      .fill(0)
      .map((_, index) => {
        const startDate = `${dayjs(value).year()}-${dayjs(value).month() + 1}-01`;
        const newDate = dayjs(startDate).add(index, "day");
        return {
          value: newDate.format("YYYY-MM-DD"),
          dayOfWeek: newDate.format("ddd"),
          dayNum: newDate.format("DD"),
        };
      });
  }, [value]);

  return (
    <section className="space-y-4">
      <div className=" flex justify-end gap-x-5 items-center">
        <div className="flex items-center gap-x-2">
          <Indicator color="red" />
          <span>Not available</span>
        </div>
        <div className="flex items-center gap-x-2">
          <Indicator color="blue" />
          <span>Today</span>
        </div>
        <MonthPickerInput
          placeholder="Pick a date"
          popoverProps={{ position: "bottom-end" }}
          value={value}
          onChange={setValue}
        />
      </div>
      <MedReserveCarousel
        slideSize={{ base: "10%" }}
        slideGap={{ base: 0, sm: "md" }}
        initialSlide={Math.round(dayjs().date() / dayjs().date()) + 1}
        emblaOptions={{ align: "center", slidesToScroll: 3 }}
      >
        {getDays().map((item, index) => (
          <CarouselSlide key={index}>
            <button
              type="button"
              onClick={() => setSelectedDate(item.value)}
              disabled={
                !excludeDates?.includes(dayjs(item.value).day().toString()) ||
                isTodayAfterDateTime(item.value, "day")
              }
              className={`${activeDate === item.value && "border-primary bg-primary text-white"} relative disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 px-3 py-5 rounded-lg border text-center flex flex-col items-center w-full cursor-pointer`}
            >
              {!excludeDates?.includes(dayjs(item.value).day().toString()) &&
                isTodayBeforeDateTime(
                  item.value,
                  "day"
                ) && (
                  <Indicator color="red" className=" absolute right-3 top-3" />
                )}
              {isTodaySameWithDateTime(item.value, "day") && (
                <Indicator color="blue" className=" absolute right-3 top-3" />
              )}
              <div className="text-xs font-medium">{item.dayOfWeek}</div>
              <div className="text-lg font-bold">{item.dayNum}</div>
            </button>
          </CarouselSlide>
        ))}
      </MedReserveCarousel>
    </section>
  );
};

export default RescheduleDateCarousel;
