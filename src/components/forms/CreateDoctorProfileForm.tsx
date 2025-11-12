"use client";
import {
  Box,
  Button,
  Fieldset,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Paper,
  Stepper,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import dayjs from "dayjs";
import {
  DateInputProps,
  getTimeRange,
  TimePicker,
  YearPickerInput,
} from "@mantine/dates";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  medicalCourses,
  cadresData,
  genderData,
  IdentificationTypes,
  schoolGrades,
  doctorCategories,
  workSchedule,
} from "@/constants";
import { DoctorStepFormValidation } from "@/lib/schema/zod";
import { useMedStore } from "@/providers/med-provider";
import { CreateDoctorProfileParams } from "@/types/actions.types";
import { handleFileUpload } from "@/utils/utilsFn";
import { DropzoneWrapper } from "../dropzone/Dropzone";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import { createDoctorAction } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useNgaStates from "@/hooks/useNgaStates";
import { simulateFetchNin } from "@/utils/utilsFn";
import useGetUniversities from "@/hooks/useGetUniversities";
import { CustomMultiSelectCheckbox } from "../molecules/inputs/CustomMultiSelect";
import { useHash } from "@/hooks/useHash";
import AwaitingVerification from "../boxes/AwaitingVerification";
import { InitialDoctorProfile } from "@/constants/formInitialValues";

dayjs.extend(customParseFormat);

const CreateDoctorProfileForm = () => {
  const [active, setActive] = useState(0);
  const { credentials } = useMedStore((state) => state);
  const [file, setFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const { ngaStates, lgas, setOption, option, isError } = useNgaStates();
  const { universities } = useGetUniversities();

  const [workScheduleData, setWorkScheduleData] = useState<string[]>([]);

  const hash = useHash();

  const router = useRouter();
  const isAvailableOnWeekends = ["0", "6"].some((item) =>
    workScheduleData.includes(item)
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: InitialDoctorProfile,
    validate: (values) => {
      const schema = DoctorStepFormValidation[active];
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
        return errors;
      }
    },
  });

  useEffect(() => {
    if (credentials?.emailVerified && credentials?.databaseId) {
      router.push(`/${credentials?.role}/${credentials?.userId}/dashboard`);
      return;
    }

    if (!credentials?.emailVerified && credentials?.databaseId) {
      window.location.hash = "awaiting-account-verification";
      return;
    }
    async function fillExistingData() {
      const { data } = await simulateFetchNin(
        credentials?.medId as string,
        1000
      );
      form.setValues({
        email: credentials?.email,
        fullname: data?.firstName + " " + data?.lastName,
        gender: data?.gender,
        medId: credentials?.medId as string,
      });
      form.setFieldValue("userId", credentials?.userId);
    }
    fillExistingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  const nextStep = () => {
    const validationErrors = form.validate();
    if (!validationErrors.hasErrors) {
      setActive((current) => (current < 4 ? current + 1 : current));
      return;
    }
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };
  const dateParser: DateInputProps["dateParser"] = (input) => {
    return dayjs(input, "YYYY MMMM DD").format("YYYY-MM-DD");
  };

  const handleSubmit = async (values: CreateDoctorProfileParams) => {
    const photoUrl = await handleFileUpload(file!);
    const documentUrl = await handleFileUpload(documentFile!);
    const data = {
      userId: credentials?.userId,
      ...values,
      profilePicture: photoUrl,
      identificationDocument: documentUrl,
      workSchedule: workScheduleData,
    };
    const response = await createDoctorAction(data);
    if (response?.code !== 200) {
      toast.error(response?.message);
      return;
    }
    toast.success(response?.message);
    window.location.hash = "awaiting-account-verification";
  };

  return (
    <Paper
      shadow="md"
      className=" card py-[46px] space-y-4 px-[70px] w-full max-w-[992px]"
    >
      {hash == "#awaiting-account-verification" ? (
        <AwaitingVerification />
      ) : (
        <Box
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          component="form"
        >
          <Stepper active={active}>
            <Stepper.Step label="First step" description="Personal information">
              <Grid overflow="hidden">
                <GridCol span={{ base: 12 }}>
                  <CustomInput
                    type="text"
                    label="Full Name"
                    radius={35}
                    withAsterisk
                    disabled
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
                    disabled
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
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="Gender"
                    withAsterisk
                    disabled
                    placeholder="Pick your Gender"
                    radius={35}
                    size="md"
                    data={genderData}
                    key={form.key("gender")}
                    {...form.getInputProps("gender")}
                  />
                </GridCol>

                {/* yyyy-mm-dd */}
                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="datepicker"
                    label="Date of Birth"
                    placeholder="Pick your Date of Birth"
                    valueFormat="YYYY MMMM DD"
                    dateParser={dateParser}
                    radius={35}
                    size="md"
                    key={form.key("birthDate")}
                    {...form.getInputProps("birthDate")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
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
                    {...form.getInputProps("stateOfOrigin")}
                    type="select"
                    label="State Of Origin"
                    placeholder="Pick your state of origin"
                    radius={35}
                    size="md"
                    value={option}
                    data={!isError && ngaStates}
                    key={form.key("stateOfOrigin")}
                    onChange={(value: string | null) => {
                      setOption(value as string);
                      form.setFieldValue("stateOfOrigin", value as string);
                    }}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="LGA of origin"
                    placeholder="Pick your LGA"
                    radius={35}
                    size="md"
                    data={lgas && lgas}
                    key={form.key("lga")}
                    {...form.getInputProps("lga")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="text"
                    label="Zip Code"
                    radius={35}
                    size="md"
                    placeholder="Enter your Zip Code"
                    key={form.key("zipcode")}
                    {...form.getInputProps("zipcode")}
                  />
                </GridCol>

                <GridCol span={{ base: 12 }}>
                  <CustomInput
                    type="textarea"
                    label="Bio"
                    size="md"
                    placeholder="Say something about yourself"
                    key={form.key("bio")}
                    {...form.getInputProps("bio")}
                  />
                </GridCol>
              </Grid>
            </Stepper.Step>

            <Stepper.Step
              label="Second step"
              description="Academic Information"
            >
              <Grid overflow="hidden">
                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="Tertiary Institution"
                    placeholder="Select your Tertiary Institution"
                    radius={35}
                    size="md"
                    searchable
                    clearable
                    nothingFoundMessage="Nothing found..."
                    data={universities?.data || []}
                    key={form.key("university")}
                    {...form.getInputProps("university")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    {...form.getInputProps("courseOfStudy")}
                    type="select"
                    label="Course of Study"
                    withAsterisk
                    placeholder="Select your Course of Study"
                    radius={35}
                    size="md"
                    data={medicalCourses || []}
                    key={form.key("courseOfStudy")}
                    onChange={(value: string | null) => {
                      const degree = medicalCourses?.find(
                        (course) => course.value === value
                      )?.degree_awarded;
                      form.setFieldValue("courseOfStudy", value as string);
                      form.setFieldValue("degree", degree as string);
                      form.setValues({
                        courseOfStudy: value as string,
                        degree: degree as string,
                      });
                    }}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="text"
                    label="degree"
                    readOnly
                    radius={35}
                    size="md"
                    placeholder="Enter your Degree"
                    key={form.key("degree")}
                    {...form.getInputProps("degree")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Course Duration"
                    radius={35}
                    min={4}
                    max={6}
                    size="md"
                    placeholder="Enter your Course duration"
                    key={form.key("courseDuration")}
                    {...form.getInputProps("courseDuration")}
                  />
                </GridCol>

                {/* year of graduation & grade */}

                <GridCol span={{ base: 12, md: 6 }}>
                  <YearPickerInput
                    label="Year of Graduation"
                    radius={35}
                    placeholder="Enter your Year of Graduation"
                    size="md"
                    value={year}
                    onChange={(item) => {
                      setYear(item);
                      form.setFieldValue(
                        "yearOfGraduation",
                        dayjs(item).format("YYYY")
                      );
                    }}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="Grade"
                    placeholder="Select your Grade"
                    radius={35}
                    size="md"
                    data={schoolGrades}
                    key={form.key("grade")}
                    {...form.getInputProps("grade")}
                  />
                </GridCol>
              </Grid>
            </Stepper.Step>

            <Stepper.Step label="Third step" description="Work Information">
              <Grid overflow="hidden">
                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="text"
                    label="Medical ID"
                    radius={35}
                    withAsterisk
                    disabled
                    size="md"
                    placeholder="Enter your medical ID"
                    key={form.key("medId")}
                    {...form.getInputProps("medId")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    {...form.getInputProps("specialization")}
                    type="select"
                    label="Specialization"
                    withAsterisk
                    placeholder="Select area of expertise"
                    radius={35}
                    size="md"
                    data={doctorCategories}
                    key={form.key("specialization")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="Cadre"
                    data={cadresData}
                    radius={35}
                    size="md"
                    placeholder="Enter your Cadre"
                    key={form.key("cadre")}
                    {...form.getInputProps("cadre")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Work Experience"
                    radius={35}
                    min={1}
                    max={50}
                    size="md"
                    placeholder="Enter your years of Work Experience"
                    key={form.key("experience")}
                    {...form.getInputProps("experience")}
                  />
                </GridCol>

                {/* work schedule */}

                <GridCol span={{ base: 12 }}>
                  <CustomMultiSelectCheckbox
                    label="Work Schedule"
                    size="md"
                    radius={35}
                    value={workScheduleData}
                    setValue={setWorkScheduleData}
                    data={workSchedule}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <Fieldset legend="Working Hours on Weekdays">
                    <TimePicker
                      radius={35}
                      size="md"
                      label="Start time"
                      min="9:00"
                      max="16:00"
                      key={form.key("weekdayStartTime")}
                      {...form.getInputProps("weekdayStartTime")}
                      withDropdown
                      presets={getTimeRange({
                        startTime: "9:00",
                        endTime: "16:00",
                        interval: "01:00",
                      })}
                    />
                    <TimePicker
                      radius={35}
                      size="md"
                      label="End time"
                      min="15:00"
                      max="16:00"
                      key={form.key("weekdayEndTime")}
                      {...form.getInputProps("weekdayEndTime")}
                      withDropdown
                      presets={getTimeRange({
                        startTime: "15:00",
                        endTime: "16:00",
                        interval: "01:00",
                      })}
                    />
                  </Fieldset>
                </GridCol>

                {isAvailableOnWeekends && (
                  <GridCol span={{ base: 12, md: 6 }}>
                    <Fieldset
                      className="gap-3"
                      legend="Working Hours on Weekends"
                    >
                      <TimePicker
                        radius={35}
                        size="md"
                        label="Start time"
                        min="9:00"
                        max="16:00"
                        withDropdown
                        key={form.key("weekendStartTime")}
                        {...form.getInputProps("weekendStartTime")}
                        presets={getTimeRange({
                          startTime: "9:00",
                          endTime: "16:00",
                          interval: "01:00",
                        })}
                      />
                      <TimePicker
                        radius={35}
                        size="md"
                        label="End time"
                        min="12:00"
                        max="16:00"
                        withDropdown
                        key={form.key("weekendEndTime")}
                        {...form.getInputProps("weekendEndTime")}
                        presets={getTimeRange({
                          startTime: "12:00",
                          endTime: "16:00",
                          interval: "01:00",
                        })}
                      />
                    </Fieldset>
                  </GridCol>
                )}
              </Grid>
            </Stepper.Step>

            <Stepper.Step
              label="Final step"
              description="Identification and Verfication"
            >
              {/* identificationType, identificationNumber, identificationDocument, profilePicture, privacyConsent: false */}
              <Grid overflow="hidden">
                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="select"
                    label="Identification Type"
                    placeholder="Select your type of Identification"
                    radius={35}
                    size="md"
                    data={IdentificationTypes}
                    key={form.key("identificationType")}
                    {...form.getInputProps("identificationType")}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    type="text"
                    label="Identification Number"
                    radius={35}
                    size="md"
                    placeholder="Enter your Identification Number"
                    key={form.key("identificationNumber")}
                    {...form.getInputProps("identificationNumber")}
                  />
                </GridCol>

                <GridCol
                  className=" items-end flex justify-center"
                  span={{ base: 12, md: 6 }}
                >
                  <CustomInput
                    label="Upload Profile Picture"
                    type="fileInput"
                    allowPicture
                    file={file}
                    setFile={setFile}
                  />
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <CustomInput
                    className=" text-graytext"
                    radius={"xl"}
                    label="I agree to Privacy Policy"
                    key={form.key("privacyConsent")}
                    {...form.getInputProps("privacyConsent")}
                    size="md"
                    type="checkbox"
                  />
                </GridCol>

                <GridCol span={{ base: 12 }}>
                  <DropzoneWrapper
                    maxSize={2 * 1024 * 1024}
                    acceptFiles={["application/pdf", "image/jpeg", "image/png"]}
                    maxFiles={1}
                    file={documentFile}
                    title="Drag or Upload your Identification Document"
                    subtitle="Attach an identification document. A file should not exceed 2mb"
                    handleDrop={setDocumentFile}
                  />
                </GridCol>
              </Grid>
            </Stepper.Step>
            <Stepper.Completed>
              <Box className=" flex flex-col items-center justify-center space-y-5">
                <Text c="m-blue" fw="700" size="40px">
                  Completed!:
                </Text>
                <IconRosetteDiscountCheckFilled
                  className=" text-primary"
                  width={150}
                  height={150}
                />
              </Box>
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
            {true && (
              <Button loading={form.submitting} type="submit">
                Submit
              </Button>
            )}
          </Group>
        </Box>
      )}
    </Paper>
  );
};

export default CreateDoctorProfileForm;
