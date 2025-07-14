/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Grid, GridCol, Group, NumberInput } from "@mantine/core";
import CustomInput from "../inputs/CustomInput";
import { useForm } from "@mantine/form";
import { initialPaymentForm, newPrices } from "@/constants";
import { PaymentFormSchema } from "@/lib/schema/zod";
import SubmitBtn from "../CButton/SubmitBtn";
import { IconCircleDottedLetterP } from "@tabler/icons-react";
import { useMedStore } from "@/providers/med-provider";
import useHandlePayments from "@/hooks/useHandlePayments";

type response = {
  doctorSpecialization: string;
  patientFullname: string;
  address: string;
  phone: string;
};
const PaymentForm = ({
  doctorId,
  response,
  slotId,
}: {
  doctorId: string;
  response: response;
  slotId: string;
}) => {
  const { credentials } = useMedStore((state) => state);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialPaymentForm,
    validate: (values) => {
      const schema = PaymentFormSchema;
      if (!schema) return {};

      // Parse the current values with the schema
      const result = schema.safeParse(values);

      if (result.success) {
        return {};
      } else {
        // Map Zod errors to Mantine form error format
        const errors: { [key: string]: string } = {};
        for (const err of result.error.errors) {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        }
        console.log("theme: ", errors);
        return errors;
      }
    },
  });

  useEffect(() => {
    const yun = newPrices.find(
      (item) => item.value === response?.doctorSpecialization
    );
    form.setValues({
      doctorId,
      patientId: credentials?.databaseId as string,
      fullname: response.patientFullname,
      email: credentials?.email as string,
      address: response?.address,
      amount: yun?.price,
      slotId,
    });
      form.setFieldValue("phone", response?.phone);
  }, [credentials, doctorId]);
    
    const {handleTransaction} = useHandlePayments()
 
  return (
    <form
      onSubmit={form.onSubmit(async (values) => handleTransaction(values))}
    >
      <Grid overflow="hidden">
        <GridCol span={{ base: 12 }}>
          <CustomInput
            type="text"
            label="Full Name"
            radius={35}
            withAsterisk
            readOnly
            size="md"
            placeholder="Enter your full name"
            key={form.key("fullname")}
            {...form.getInputProps("fullname")}
          />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <CustomInput
            type="text"
            withAsterisk
            label="Email"
            radius={35}
            readOnly
            size="md"
            placeholder="Enter your email"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <CustomInput
            type="phone_no"
            label="Phone Number"
            placeholder="Enter your Phone Number"
            className=" phone-no"
            value={response?.phone}
            key={form.key("phone")}
            {...form.getInputProps("phone")}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <CustomInput
            type="text"
            label="Home Address"
            radius={35}
            size="md"
            placeholder="Enter your Residential Address"
            key={form.key("address")}
            {...form.getInputProps("address")}
          />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <CustomInput
            type="select"
            size="md"
            label="Capacity of persons"
                      placeholder="Capacity of persons"
                      withAsterisk
            radius={35}
            data={[
              { label: "1 Person", value: "1" },
              { label: "2 Persons", value: "2" },
            ]}
            key={form.key("capacity")}
            {...form.getInputProps("capacity")}
          />
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Amount"
            placeholder="Amount"
            radius={35}
            size="md"
            prefix="&#8358;"
            hideControls
            defaultValue={20000}
            allowNegative={false}
            allowDecimal={false}
            decimalScale={2}
            thousandSeparator=","
            readOnly
            key={form.key("amount")}
            {...form.getInputProps("amount")}
          />
        </GridCol>
      </Grid>
      <Group justify="flex-end" mt="lg">
        <SubmitBtn
          type="submit"
          color="m-blue"
          radius={35}
          loading={form.submitting}
          leftSection={<IconCircleDottedLetterP />}
          size="lg"
          text="Pay Now"
        />
      </Group>
    </form>
  );
};

export default PaymentForm;
