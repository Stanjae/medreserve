/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Divider, Group, Input, Menu } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconArrowRight, IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useState } from "react";


type Props = {
  placeholder?: string;
    setNewDateRange: any;
    isLoading?: boolean;
    refetch?: any;
};
const CustomDateRangeFilter = ({ placeholder, setNewDateRange, isLoading}: Props) => {
    const today = dayjs();
     const [dateRange, setDateRange] = useState<[string | null, string | null]>([
       null,
       null,
     ]);

     const handleDateChange = (dates: [string | null, string | null]) => {
       setDateRange(dates);
     };
const clearFilter = () => {
  setDateRange([null, null]);
  setNewDateRange([null, null]);
};

    const handleDateSubmit = async() => { 
        const dates = [
          dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        ];
        setNewDateRange(dates);
    }
  return (
    <div>
      <Menu
        position="bottom-end"
        withArrow
        closeOnClickOutside={false}
        shadow="md"
      >
        <Menu.Target>
          <Button
            radius="sm"
            variant="light"
            size="md"
            type="button"
            color="m-gray"
            leftSection={<IconCalendar stroke={1.0} />}
          >
            {placeholder}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <div className=" p-4">
            <div className="flex gap-2 px-3 mb-3 mt-2 items-center  ">
              <Input
                leftSection={<IconCalendar stroke={1.0} />}
                className="grow"
                defaultValue={dateRange[0] || ""}
              />
              <IconArrowRight stroke={1.5} className="text-gray-700" />
              <Input
                leftSection={<IconCalendar stroke={1.0} />}
                className=" grow"
               defaultValue={dateRange[1] || ""}
              />
            </div>
            <DatePicker
              size="md"
              type="range"
              value={dateRange}
              onChange={handleDateChange}
              presets={[
                {
                  value: [
                    today.subtract(2, "day").format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD"),
                  ],
                  label: "Last two days",
                },
                {
                  value: [
                    today.subtract(7, "day").format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD"),
                  ],
                  label: "Last 7 days",
                },
                {
                  value: [
                    today.startOf("month").format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD"),
                  ],
                  label: "This month",
                },
                {
                  value: [
                    today
                      .subtract(1, "month")
                      .startOf("month")
                      .format("YYYY-MM-DD"),
                    today
                      .subtract(1, "month")
                      .endOf("month")
                      .format("YYYY-MM-DD"),
                  ],
                  label: "Last month",
                },
                {
                  value: [
                    today
                      .subtract(1, "year")
                      .startOf("year")
                      .format("YYYY-MM-DD"),
                    today
                      .subtract(1, "year")
                      .endOf("year")
                      .format("YYYY-MM-DD"),
                  ],
                  label: "Last year",
                },
              ]}
            />
            <Divider my="sm" />
            <Group justify="flex-end">
              <Button onClick={clearFilter} size="md" radius={"xl"} variant="light">
                Reset
              </Button>
              <Button loading={isLoading} onClick={handleDateSubmit} size="md" radius={"xl"}>
                Apply
              </Button>
            </Group>
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default CustomDateRangeFilter;
