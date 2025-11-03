"use client";
import { Box } from "@mantine/core";
import React from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { useForm } from "@mantine/form";
import { ResetPasswordSchema } from "@/lib/schema/zod";
import { zodResolver } from "mantine-form-zod-resolver";
import useResetPw from "@/hooks/useResetPw";
import { useParams, useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {
  const params = useParams<{ uid: string }>();
   const searchParams = useSearchParams();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { password: "" },
    validate: zodResolver(ResetPasswordSchema),
    validateInputOnChange: true, // validate on every change
  });

  // Check if form is valid (no errors)
  const isFormValid = Object.keys(form.errors).length === 0;
  const { resetPasswordPatient } = useResetPw();
  return (
    <Box
      className=" space-y-3"
      onSubmit={form.onSubmit(
        async (values) =>
          await resetPasswordPatient({ ...values, userId: params?.uid, token: searchParams.get("token") || "" })
      )}
      component="form"
    >
      <CustomInput
        radius={35}
        label="New Password"
        size="md"
        type="password"
        placeholder="Enter your new password"
        key={form.key("password")}
        {...form.getInputProps("password")}
      />

      <SubmitBtn
        type="submit"
        disabled={!isFormValid}
        radius={35}
        size="md"
        fullWidth
        loading={form.submitting}
        color="m-orange"
        text="Reset Password"
      />
    </Box>
  );
};

export default ResetPasswordForm;
