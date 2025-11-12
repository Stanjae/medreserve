"use client";
import { ActionIcon, Box, Divider, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CustomFilters from "../molecules/filters/CustomFilters";
import { doctorCategories } from "@/constants";
import CustomInput from "../molecules/inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatDate } from "@/utils/utilsFn";

const BookAppointment = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Controlled form state
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<string | null>("");
  const [date, setDate] = useState<string | null>("");
  const [loading, setLoading] = useState(false);

  // Sync state with URL params on mount or when params change
  useEffect(() => {
    setSpecialty(searchParams.get("specialty") || null);
    setCapacity(searchParams.get("capacity") || null);
    setDate(searchParams.get("date") ?? dayjs().format("YYYY-MM-DD"));
  }, [searchParams]);

  // Build URL params from state
  const buildParams = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (specialty) params.set("specialty", specialty);
    if (capacity) params.set("capacity", capacity);
    if (date) params.set("date", date);
    return params;
  };

  function handleSearch() {
    setLoading(true);
    const params = buildParams();
    router.replace(`${pathname}?${params.toString()}`);
    setLoading(false);
  }

  function clearSearch(key: string) {
    if (key === "specialty") setSpecialty("");
    if (key === "capacity") setCapacity("");
    if (key === "date") setDate(dayjs().format("YYYY-MM-DD"));
    // Remove from URL
    const params = buildParams();
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearAllSearch() {
    setSpecialty(null);
    setCapacity(null);
    setDate(dayjs().format("YYYY-MM-DD"));
    router.replace(`${pathname}`);
  }

  return (
    <Box>
      <Text fz={{md:"38px", base:"30px"}} lh={"43px"} fw={700} c="m-blue" mb="30px">
        Select a Doctor
      </Text>
      <Flex direction={{ base: "column", md: "row" }} align={{ md:"center", base:"flex-start"}} gap={10}>
        <CustomFilters label={"Speciality in"}>
          <CustomInput
            type="select"
            size="lg"
            searchable
            value={specialty}
            onChange={setSpecialty}
            onClear={() => {
              clearSearch("specialty");
            }}
            clearable
            placeholder="Pick Doctor Speciality"
            data={doctorCategories}
            nothingFoundMessage="No Search Results found..."
            styles={{
              root: { width: "100%" },
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
          />
        </CustomFilters>

        <CustomFilters fullWidth label={"for"}>
          <CustomInput
            type="select"
            size="lg"
            value={capacity}
            onChange={setCapacity}
            placeholder="No of persons"
            clearable
            onClear={() => {
              clearSearch("capacity");
            }}
            styles={{
              root: { width: "100%" },
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
            data={[
              { label: "1 Person", value: "1" },
              { label: "2 People", value: "2" },
            ]}
          />
        </CustomFilters>

        <CustomFilters label={"On"}>
          <CustomInput
            type="datepicker"
            size="lg"
            minDate={dayjs().format("YYYY-MM-DD")}
            value={date}
            onChange={setDate}
            styles={{
              root: {},
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
          />
        </CustomFilters>
        <Divider orientation="vertical" />
        {specialty || capacity || date != dayjs().format("YYYY-MM-DD") ? (
          <ActionIcon
            onClick={() => clearAllSearch()}
            size="lg"
            variant="outline"
            aria-label="Settings"
          >
            <IconX />
          </ActionIcon>
        ) : null}
        <SubmitBtn
          radius={"xl"}
          leftSection={<IconSearch />}
          disabled={!(specialty || capacity || date != dayjs().format("YYYY-MM-DD"))}
          size="lg"
          color="m-blue"
          text={"Search"}
          loading={loading}
          type="button"
          onClick={handleSearch}
        />
      </Flex>
      <div className=" my-[36] px-[18px]">
        <Text c="m-gray" className=" font-medium text-[17px] leading-[22.5px]">
          Showing available doctors On{" "}
          <Text className="text-[17px] font-bold" component="span" c="m-blue">
            {formatDate(date || dayjs().format("YYYY-MM-DD"))}
          </Text>
        </Text>
      </div>
    </Box>
  );
};

export default BookAppointment;
