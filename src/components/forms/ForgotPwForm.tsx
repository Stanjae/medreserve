"use client";
import { Box } from "@mantine/core";
import React, { useState } from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import SubmitBtn from "../CButton/SubmitBtn";
import useForgotPw from "@/hooks/useForgotPw";
import { ForgotPasswordSchema } from "@/lib/schema/zod";

const ForgotPwForm = () => {
  const { forgotPasswordPatient } = useForgotPw();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: zodResolver(ForgotPasswordSchema),
    validateInputOnChange: true, // validate on every change
  });

  const handleForgotPwSubmit = async (values: { email: string }) => {
    setHasSubmitted(true);
    await forgotPasswordPatient(values);
  };
  const isFormValid = Object.keys(form.errors).length === 0;
  return (
    <Box
      className=" space-y-3"
      onSubmit={form.onSubmit(
        async (values) => await handleForgotPwSubmit(values)
      )}
      component="form"
    >
      <CustomInput
        radius={35}
        label="Email"
        size="md"
        type="text"
        placeholder="Enter your email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <SubmitBtn
        type="submit"
        disabled={!isFormValid || hasSubmitted}
        radius={35}
        size="md"
        fullWidth
        loading={form.submitting}
        color="m-orange"
        text="Submit"
      />
    </Box>
  );
};

export default ForgotPwForm;
