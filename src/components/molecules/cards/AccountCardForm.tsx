/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge, Card, Divider, Grid } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CustomInput from "../inputs/CustomInput";
import { AccountFieldsType, AccountSettingsSectionType } from "@/types";
import SubmitBtn from "@/components/CButton/SubmitBtn";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { UseMutationResult } from "@tanstack/react-query";

type AccountCardFormProps = {
  section: AccountFieldsType;
  currentAccount: AccountSettingsSectionType | undefined;
  schema: any;
  onSubmit?: UseMutationResult<
    {
      code: number;
      status: string;
      message: string;
    },
    Error,
    any,
    unknown
  >;
};

const AccountCardForm = ({
  section,
  currentAccount,
  schema,
  onSubmit,
}: AccountCardFormProps) => {
  const initialValues = Object.fromEntries(
    section.fields.map((item) => [
      item.value,
      currentAccount
        ? (currentAccount[item.value as keyof AccountSettingsSectionType] ?? "")
        : "",
    ])
  );
  const form = useForm({
    initialValues,
    mode: "uncontrolled",
    validate: zodResolver(schema),
  });

  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (!currentAccount) return;
    form.initialize(initialValues);
    if (section.key === "phone") {
      const phoneNo = currentAccount?.phone as string;
      setPhone(phoneNo);
    }
  }, [currentAccount]);

  const handleSubmit = async (values: any) => {
    if (onSubmit) {
      await onSubmit?.mutateAsync(values as any);

      if (section.key === "email") {
        form.setFieldValue("password", "");
      }
      form.resetDirty();
    }
  };

  const isDisabled = form.isDirty();
  return (
    <Card
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
      shadow="sm"
      radius="md"
      withBorder
      px="0"
    >
      <Card.Section p={25}>
        <Grid
          gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
          overflow="hidden"
        >
          <Grid.Col span={4}>
            <div className="flex items-center space-x-3">
              <h3 className="font-medium text-[20px]">{section.title}</h3>
              {section.key == "email" && (
                <Badge
                  variant="light"
                  color={currentAccount?.emailVerification ? "green" : "red"}
                >
                  {currentAccount?.emailVerification
                    ? "Verified"
                    : "Not Verified"}
                </Badge>
              )}
            </div>
          </Grid.Col>
          <Grid.Col span="auto">
            <div className="space-y-4">
              {section.fields.map((field) => {
                if (field.type === "phone_no") {
                  return (
                    <CustomInput
                      key={field.type}
                      label={field.label}
                      value={phone}
                          onChange={(val) => {
                              setPhone(val);
                              form.setFieldValue(field.value as string, val);
                          }}
                      type="phone_no"
                    />
                  );
                } else {
                  return (
                    <CustomInput
                      radius={30}
                      label={field.label}
                      key={form.key(field.value as string)}
                      {...form.getInputProps(field.value as string)}
                      type={field.type as any}
                    />
                  );
                }
              })}
            </div>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Divider />
      <div className="text-right px-[25px] pb-1 pt-3">
        <SubmitBtn
          disabled={!isDisabled}
          loading={onSubmit?.isPending}
          type="submit"
          radius={30}
          size="md"
          text="Update"
        />
      </div>
    </Card>
  );
};

export default AccountCardForm;
