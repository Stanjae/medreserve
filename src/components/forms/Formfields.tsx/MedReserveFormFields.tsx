/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomCancelBtn from "@/components/CButton/CustomCancelBtn";
import SubmitBtn from "@/components/CButton/SubmitBtn";
import { DropzoneWrapper } from "@/components/dropzone/Dropzone";
import CustomInput from "@/components/inputs/CustomInput";
import useGetMedInfo from "@/hooks/useGetMedId";
import { ROLES } from "@/types/store.types";
import { capitalizeFirst } from "@/utils/utilsFn";
import {
  ActionIcon,
  Button,
  ComboboxData,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Text,
} from "@mantine/core";
import { DateInputProps, getTimeRange, TimePicker } from "@mantine/dates";
import {
  IconCalendar,
  IconCircleXFilled,
  IconPhotoScan,
  IconRosetteDiscountCheckFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect } from "react";

type CardItem = {
  title: string;
  value: string;
  items: (
    | {
        label: string;
        value: string;
        data: string[];
        type?: string;
        fullWidth?: boolean;
        radius?: number | string;
      }
    | {
        label: string;
        value: string;
        data?: ComboboxData | undefined;
        type?: string;
        fullWidth?: boolean;
        radius?: number | string;
      }
  )[];
}[];
type Props = {
  leftCard: CardItem;
  rightCard: { title: string; value: string; items: any[] };
  form: any;
  setOption?: React.Dispatch<React.SetStateAction<string | undefined>>;
  option?: string | undefined;
  isError?: boolean;
  role: ROLES;
  resetActions: () => void;
  submitBtnLabel: string;
  submitBtnDisabled: boolean;
  submitBtnLoading: boolean;
  submitBtnAction: () => void;
  handleDeleteUser?: () => void;
  file: string | File | null;
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>;
  documentFile: string | File | null;
  setDocumentFile: React.Dispatch<React.SetStateAction<string | File | null>>;
};

const MedReserveFormFields = ({
  leftCard,
  rightCard,
  form,
  setOption,
  option,
  role,
  resetActions,
  submitBtnLabel,
  submitBtnDisabled,
  submitBtnLoading,
  submitBtnAction,
  handleDeleteUser,
  setFile,
  file,
  setDocumentFile,
  documentFile,
}: Props) => {
  const { handleMedIdSearch, medInfo, loading } = useGetMedInfo(
    form.getValues().profile.medId
  );
  const dateParser: DateInputProps["dateParser"] = (input) => {
    return dayjs(input, "YYYY MMMM DD").format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (medInfo?.doctorId) {
      form.setFieldValue(
        "profile.fullname",
        medInfo?.firstName + " " + medInfo?.lastName
      );
      form.setFieldValue("profile.medId", medInfo?.doctorId);
    }
  }, [medInfo]);
  return (
    <div>
      <Grid overflow="hidden" gutter={{ md: 24, base: 10 }}>
        <GridCol span={{ base: 12, md: 8 }} className="space-y-4">
          {leftCard.map((item, index) => (
            <Fieldset key={index} legend={item.title} className="space-y-3">
              <Grid>
                {item.items.map((subItem, subIndex) => {
                  if (subItem.type == "select") {
                    if (subItem.value == "stateOfOrigin") {
                      return (
                        <GridCol key={subIndex} span={{ base: 12, md: 6 }}>
                          <CustomInput
                            type="select"
                            label="State Of Origin"
                            placeholder="Pick your state of origin"
                            searchable
                            radius={35}
                            value={option}
                            data={subItem.data}
                            key={form.key("profile.stateOfOrigin")}
                            onChange={(value: string | null) => {
                              if (setOption) setOption(value as string);
                              form.setFieldValue(
                                "profile.stateOfOrigin",
                                value as string
                              );
                            }}
                          />
                        </GridCol>
                      );
                    }
                    if (subItem.value == "prefs") {
                      return (
                        <GridCol key={subIndex} span={{ base: 12, md: 6 }}>
                          <CustomInput
                            type="select"
                            label="Sub role"
                            placeholder="Pick your subrole"
                            radius={35}
                            data={subItem.data}
                            key={form.key("account.prefs.subRoleId")}
                            value={form.getValues()?.account?.prefs?.subRoleId}
                            onChange={(_, option) => {
                              form.setFieldValue("account.prefs", {
                                subRoleId: option.value,
                                subRole: option.label,
                              });
                            }}
                          />
                        </GridCol>
                      );
                    }
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={"select"}
                          label={subItem.label}
                          data={subItem.data}
                          radius={subItem.radius}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "checkbox") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "checkbox"}
                          label={subItem.label}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`,
                            {
                              type: "checkbox",
                            }
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "phone_no") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "phone_no"}
                          label={subItem.label}
                          value={form.values[item.value][subItem.value]}
                          className=" phone-no"
                          onChange={(val: any) => {
                            form.setFieldValue(
                              `${item.value}.${subItem.value}`,
                              val
                            );
                          }}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "multiSelect") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <MultiSelect
                          label={subItem.label}
                          radius={35}
                          {...form.getInputProps(`profile.${subItem.value}`)}
                          key={form.key(`profile.${subItem.value}`)}
                          data={
                            subItem.data as { label: string; value: string }[]
                          }
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "textarea") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "textarea"}
                          label={capitalizeFirst(subItem.label)}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "numberInput") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <NumberInput
                          label={subItem.label}
                          radius={35}
                          min={4}
                          max={6}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "timers") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <TimePicker
                          radius={35}
                          label={subItem.label}
                          min="9:00"
                          max="16:00"
                          key={form.key(`profile.${subItem.value}`)}
                          {...form.getInputProps(`profile.${subItem.value}`)}
                          withDropdown
                          presets={getTimeRange({
                            startTime: "9:00",
                            endTime: "16:00",
                            interval: "01:00",
                          })}
                        />
                      </GridCol>
                    );
                  } else if (subItem.type == "datepicker") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          valueFormat="YYYY MMMM DD"
                          dateParser={dateParser}
                          type={subItem.type as "datepicker"}
                          radius={subItem.radius}
                          label={subItem.label}
                          leftSection={<IconCalendar />}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  } else if (subItem.value == "fullname") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "text"}
                          label={subItem.label}
                          radius={subItem.radius}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                          readOnly={role === "doctor"}
                        />
                      </GridCol>
                    );
                  } else if (subItem.value == "medId") {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "text"}
                          label={subItem.label}
                          radius={subItem.radius}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                          onChange={async (event: any) => {
                            await handleMedIdSearch(event.target.value);
                          }}
                        />
                        <div className=" flex items-center gap-x-3">
                          {loading && <Loader color="blue" size={14} />}
                          {medInfo &&
                            !loading &&
                            form.getValues().profile.medId != "" && (
                              <Text
                                component="div"
                                c="m-gray"
                                className="flex text-[14px] items-center gap-x-1"
                              >
                                <IconRosetteDiscountCheckFilled
                                  color="green"
                                  size={14}
                                />
                                {medInfo?.firstName + " " + medInfo?.lastName}
                              </Text>
                            )}
                          {!medInfo?.doctorId &&
                          form.getValues().profile.medId ? (
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
                      </GridCol>
                    );
                  } else {
                    return (
                      <GridCol
                        key={subIndex}
                        span={{ base: 12, md: subItem.fullWidth ? 12 : 6 }}
                      >
                        <CustomInput
                          type={subItem.type as "text"}
                          label={subItem.label}
                          radius={subItem.radius}
                          {...form.getInputProps(
                            `${item.value}.${subItem.value}`
                          )}
                          key={form.key(`${item.value}.${subItem.value}`)}
                        />
                      </GridCol>
                    );
                  }
                })}
              </Grid>
            </Fieldset>
          ))}
          <Grid></Grid>
        </GridCol>
        <GridCol span={{ base: 12, md: 4 }}>
          <Fieldset legend={rightCard.title} className="space-y-3">
            <Grid>
              {handleDeleteUser && (
                <div className="flex justify-end">
                  <CustomCancelBtn
                    fn={handleDeleteUser}
                    btnText="Delete user"
                    modalHeader="Remove User"
                    btnProps={{
                      size: "sm",
                      variant: "subtle",
                      radius: 30,
                      color: "red",
                      leftSection: <IconTrash size={14} />,
                    }}
                    modalContent="Are you sure you want to delete this user?"
                  />
                </div>
              )}
              {rightCard.items.map((item, subIndex) => {
                if (item.type == "select") {
                  return (
                    <GridCol
                      key={subIndex}
                      span={{ base: 12, md: item.fullWidth ? 12 : 6 }}
                    >
                      <CustomInput
                        type={"select"}
                        label={item.label}
                        data={item.data}
                        {...form.getInputProps(`${item.value}`)}
                        key={form.key(`${item.value}.`)}
                      />
                    </GridCol>
                  );
                } else {
                  return (
                    <GridCol
                      key={subIndex}
                      span={{ base: 12, md: item.fullWidth ? 12 : 6 }}
                    >
                      <CustomInput
                        type={item.type as "text"}
                        label={item.label}
                        {...form.getInputProps(`${item.value}`)}
                        key={form.key(`${item.value}`)}
                      />
                    </GridCol>
                  );
                }
              })}
              <GridCol span={{ base: 12 }}>
                {" "}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-x-3">
                    <div className="relative">
                      {form.getValues().profile.profilePicture ? (
                        <Image
                          src={
                            form.getValues().profile.profilePicture as string
                          }
                          alt="profile picture"
                          width={100}
                          height={100}
                          className=" rounded-full"
                        />
                      ) : (
                        <span className=" flex items-center justify-center rounded-full w-[100px] h-[100px] bg-gray-100">
                          <IconPhotoScan stroke={1.5} width={80} height={80} />
                        </span>
                      )}
                      {form.getValues().profile.profilePicture && (
                        <ActionIcon
                          onClick={() => {
                            setFile(null);
                            form.setFieldValue("profile.profilePicture", "");
                          }}
                          className="absolute top-0 right-0"
                          color="red"
                          variant="filled"
                          size="sm"
                          radius="lg"
                          aria-label="Remove profile picture"
                        >
                          <IconX stroke={1.5} />
                        </ActionIcon>
                      )}
                    </div>

                    <CustomInput
                      label={`${form.getValues().profile.profilePicture ? "Update" : "Upload"} Profile Picture`}
                      type="fileInput"
                      allowPicture
                      file={file}
                      setFile={
                        setFile as React.Dispatch<
                          React.SetStateAction<File | null>
                        >
                      }
                    />
                  </div>

                  {form.getValues().profile.identificationDocument ? (
                    <section>
                      <label className="text-sm">Identification Document</label>
                      <Paper px="md" py="xs" radius="md">
                        <div className="flex items-center justify-between gap-x-3 ">
                          <span className="text-wrap">
                            {form
                              .getValues()
                              .profile.identificationDocument?.split("/")[8] +
                              ".pdf"}
                          </span>
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => {
                              setDocumentFile(null);
                              form.setFieldValue(
                                "profile.identificationDocument",
                                ""
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </Paper>
                    </section>
                  ) : (
                    <DropzoneWrapper
                      maxSize={2 * 1024 * 1024}
                      acceptFiles={[
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                      ]}
                      maxFiles={1}
                      file={documentFile as unknown as File}
                      title="Drag or Upload your Identification Document"
                      subtitle="Attach an identification document. A file should not exceed 2mb"
                      handleDrop={
                        setDocumentFile as React.Dispatch<
                          React.SetStateAction<File | null>
                        >
                      }
                      titleSize="md"
                      titleAlign="center"
                      groupHeight={200}
                    />
                  )}
                </div>
              </GridCol>
            </Grid>
          </Fieldset>

          <Fieldset legend={"Actions"}>
            <Group grow>
              {form.isDirty() && (
                <Button
                  onClick={resetActions}
                  radius={35}
                  size="md"
                  variant="subtle"
                  color=""
                >
                  Reset
                </Button>
              )}
              <SubmitBtn
                radius={35}
                size="md"
                text={submitBtnLabel}
                loading={submitBtnLoading}
                disabled={submitBtnDisabled}
                onClick={submitBtnAction}
              />
            </Group>
          </Fieldset>
        </GridCol>
      </Grid>
    </div>
  );
};

export default MedReserveFormFields;
