"use client";
import { Box, Loader, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { zodResolver } from "mantine-form-zod-resolver";
import { DoctorRegistrationSchema } from "@/lib/schema/zod";
import useRegistration from "@/hooks/useRegistration";
import useGetMedInfo from "@/hooks/useGetMedId";
import {
  IconCircleXFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";

const UserDoctorRegistrationForm = () => {
  const { registerClient } = useRegistration();
  const { handleMedIdSearch, medInfo, loading } = useGetMedInfo();

  const [monitor, setMonitor] = useState("");
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      medId: "",
      email: "",
      password: "",
      username: "",
      terms_and_conditions: false,
    },
    validate: zodResolver(DoctorRegistrationSchema),
    validateInputOnChange: true, // validate on every change
  });

  // Check if form is valid (no errors)
  const isFormValid = Object.keys(form.errors).length === 0;

  return (
    <Box
      className=" space-y-3"
      onSubmit={form.onSubmit(
        async (values) =>
          await registerClient(
            { ...values, medId: medInfo?.doctorId },
            "doctor"
          )
      )}
      component="form"
    >
      <div>
        <CustomInput
          radius={35}
          label="Medical ID"
          size="md"
          type="text"
          placeholder="Enter your medical ID"
          key={form.key("medId")}
          {...form.getInputProps("medId")}
          onChange={async (event) => {
            setMonitor(event.target.value);
            await handleMedIdSearch(event.target.value);
          }}
        />
        <div className=" flex items-center gap-x-3">
          {loading && <Loader color="blue" size={14} />}
          {medInfo && !loading && monitor != "" && (
            <Text
              component="div"
              c="m-gray"
              className="flex text-[14px] items-center gap-x-1"
            >
              <IconRosetteDiscountCheckFilled color="green" size={14} />
              {medInfo?.firstName + " " + medInfo?.lastName}
            </Text>
          )}
          {!loading && !medInfo && monitor != "" ? (
            <Text
              component="div"
              c="m-gray"
              className="flex text-[14px] items-center gap-x-1"
            >
              <IconCircleXFilled color="red" size={14} />
              {"Invalid Medical ID"}
            </Text>
          ) : (
            ""
          )}
        </div>
      </div>

      <CustomInput
        radius={35}
        label="Username"
        size="md"
        type="text"
        placeholder="Enter your username"
        key={form.key("username")}
        {...form.getInputProps("username")}
      />

      <CustomInput
        radius={35}
        label="Email"
        size="md"
        type="text"
        placeholder="Enter your email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <CustomInput
        radius={35}
        label="Password"
        size="md"
        type="password"
        placeholder="Enter your password"
        key={form.key("password")}
        {...form.getInputProps("password")}
      />

      <CustomInput
        className=" text-graytext"
        radius={"xl"}
        label="I agree to Terms of Use and Privacy Policy"
        key={form.key("terms_and_conditions")}
        {...form.getInputProps("terms_and_conditions")}
        size="md"
        type="checkbox"
      />

      <SubmitBtn
        type="submit"
        disabled={!isFormValid}
        radius={35}
        size="md"
        fullWidth
        loading={form.submitting}
        color="m-orange"
        text="Sign Up"
      />
    </Box>
  );
};

export default UserDoctorRegistrationForm;
