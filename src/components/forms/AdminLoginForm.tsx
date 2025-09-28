"use client";
import { Box, PinInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import CustomInput from "../inputs/CustomInput";
import SubmitBtn from "../CButton/SubmitBtn";
import { zodResolver } from "mantine-form-zod-resolver";
import { AdminLoginSchema } from "@/lib/schema/zod";
import CountdownTimer from "../animated/CountdownTimer";
import useAdminLogin from "@/hooks/useAdminLogin";
import { useHash } from "@/hooks/useHash";

const AdminLoginForm = () => {
  const { loginAdmin , isOtpActive, handleOtpVerificationAdmin} = useAdminLogin();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "", username: "" },
    validate: zodResolver(AdminLoginSchema),
    validateInputOnChange: true, // validate on every change
  });

  // Check if form is valid (no errors)
  const isFormValid = Object.keys(form.errors).length === 0;

  const hash = useHash();

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
      ? JSON.parse(localStorage.getItem("adminToken") as string)
      : null;
    if (token) {
      form.initialize(token);
    }
  }, []);

  return (
    <div>
      {hash != "#awaiting-otp-verification" ? (
        <Box
          className=" space-y-3"
          onSubmit={form.onSubmit(async (values) => await loginAdmin(values))}
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

          <CustomInput
            radius={35}
            label="Password"
            size="md"
            type="password"
            placeholder="Enter your password"
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
            text="Sign in"
          />
        </Box>
      ) : (
        <Box className="flex flex-col  gap-3 justify-center items-center">
          <PinInput type={"number"} size="lg" onComplete={async(value) => await handleOtpVerificationAdmin(form.values, value)} />
          <CountdownTimer data={form.values} isOtpActive={isOtpActive} />
        </Box>
      )}
    </div>
  );
};

export default AdminLoginForm;
