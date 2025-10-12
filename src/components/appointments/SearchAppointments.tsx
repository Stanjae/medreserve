"use client";
import { ActionIcon, Box, Divider, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CustomFilters from "../filters/CustomFilters";
import CustomInput from "../inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatDate } from "@/utils/utilsFn";
import { appointmentTypeData } from "@/constants";

const SearchAppointments = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Controlled form state
  const [appointmentId, setAppointmentId] = useState<string | null>('');
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>("");
  const [loading, setLoading] = useState(false);

  // Sync state with URL params on mount or when params change
  useEffect(() => {
    setAppointmentId(searchParams.get("appointmentId") || '');
    setAppointmentType(searchParams.get("type") || null);
    setDate(searchParams.get("date") || null);
  }, [searchParams]);

  // Build URL params from state
  const buildParams = () => {
      const params = new URLSearchParams();
      params.set("page", "1");
    if (appointmentId) params.set("appointmentId", appointmentId);
    if (appointmentType) params.set("type", appointmentType);
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
    if (key === "appointmentId") setAppointmentId("");
    if (key === "type") setAppointmentType("");
    if (key === "date") setDate(dayjs().format("YYYY-MM-DD"));
    const params = buildParams();
    params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearAllSearch() {
    setAppointmentId('');
    setAppointmentType(null);
    setDate("");
    router.replace(`${pathname}`);
  }

  return (
    <Box>
      <Text fz={"38px"} lh={"43px"} fw={700} c="m-blue" mb="30px">
        Find Appointments
      </Text>
      <Flex direction={{ base: "column", md: "row" }} align={"center"} gap={10}>
        <CustomFilters label={"Appointment ID"} fullWidth>
          <CustomInput
            type="text"
                      size="lg"
            value={appointmentId as string}
            onChange={(event) => setAppointmentId(event.currentTarget.value)}
            placeholder="Search by ID"
            styles={{
              //root: { flexShrink: 1, flexBasis: "0%", flexGrow: 1, width:'100%' },
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
          />
        </CustomFilters>

        <CustomFilters label={"for"}>
          <CustomInput
            type="select"
            size="lg"
            value={appointmentType}
            onChange={setAppointmentType}
            placeholder="Pick Type"
            clearable
            onClear={() => {
              clearSearch("type");
            }}
            styles={{
              root: { width: "150px" },
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
            data={appointmentTypeData}
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
              root: { width: "180px" },
              input: {
                border: "1px solid cyan",
              },
            }}
            radius={"xl"}
          />
        </CustomFilters>
        <Divider orientation="vertical" />
        {appointmentId || appointmentType || date ? (
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
          size="lg"
          color="m-blue"
          text={"Search"}
          loading={loading}
          type="button"
          onClick={handleSearch}
        />
      </Flex>
      <div className=" my-[36] px-[18px]">
        {date &&<Text c="m-gray" className=" font-medium text-[17px] leading-[22.5px]">
          Showing available appointments On{" "}
          <Text className="text-[17px] font-bold" component="span" c="m-blue">
            {formatDate(date || dayjs().format("YYYY-MM-DD"))}
          </Text>
        </Text>}
      </div>
    </Box>
  );
};

export default SearchAppointments;
