"use client";
import { Flex, MultiSelect, Paper, Text } from "@mantine/core";
import React, { useState } from "react";
import CustomFilters from "../filters/CustomFilters";
import { doctorCategories } from "@/constants";
import CustomInput from "../inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";

const BookAppointment = () => {
  const [searchValue, setSearchValue] = useState("");

  console.log("gyum: ", searchValue);
  return (
    <div suppressHydrationWarning>
      <Paper p={20} shadow="md" radius={"md"}>
        <Text
          fz={"40px"}
          lh={"45px"}
          fw={700}
          c="m-blue"
          mb="30px"
          className=""
        >
          Select a Doctor
        </Text>
        <Flex gap={10}>
          <CustomFilters label={"Showing Doctors in"}>
            <MultiSelect
              size="lg"
              searchable
              searchValue={searchValue}
              clearable
              maxValues={2}
              onSearchChange={setSearchValue}
              placeholder="Pick Doctor Speciality"
              data={doctorCategories}
              nothingFoundMessage="No Search Results found..."
              styles={{
                input: {
                  border: "1px solid cyan",
                },
              }}
              radius={"xl"}
            />
          </CustomFilters>

          <CustomFilters label={"On"}>
            <CustomInput
              type="datepicker"
              size="lg"
              styles={{
                input: {
                  border: "1px solid cyan",
                },
              }}
              radius={"xl"}
            />
          </CustomFilters>

          <CustomFilters label={"At"}>
            <CustomInput
              type="timepicker"
              min="09:00"
              max="18:00"
              size="lg"
              styles={{
                input: {
                  border: "1px solid cyan",
                },
              }}
              radius={"xl"}
            />
          </CustomFilters>

          <SubmitBtn
            radius={"xl"}
            size="lg"
            color="m-blue"
            text={"Book Appointment"}
            type="submit"
          />
        </Flex>
        <div>
          <Text c="m-gray" className="  px-[18px] text-[18px] leading-[22.5px]">Showing available doctors on Decmber 21, 2020</Text>
        </div>
      </Paper>
    </div>
  );
};

export default BookAppointment;
