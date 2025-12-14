"use client";
import {
  profileEditArrangeFields,
  profileFormInitials,
} from "@/constants/formInitialValues";
import { ProfileModified, profileSchema } from "@/lib/schema/zod";
import {
  handleFileUpload,
  rectifyFields,
  rectifyRightCardProfileFields,
} from "@/utils/utilsFn";
import {
  ActionIcon,
  Button,
  ComboboxData,
  LoadingOverlay,
  Paper,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ROLES } from "@/types/store.types";
import { toast } from "sonner";
import MedReserveLoader from "../loaders/MedReserveLoader";
import { z } from "zod";
import useNgaStates from "@/hooks/useNgaStates";
import useGetUniversities from "@/hooks/useGetUniversities";
import NotFound404 from "../boxes/NotFound";
import { medicalCourses } from "@/constants";
import { useMedStore } from "@/providers/med-provider";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import MedReserveFormFieldsT from "./Formfields.tsx/MedReserveFormFieldsT";
import Image from "next/image";
import { IconCamera, IconPhotoScan } from "@tabler/icons-react";
import { DropzoneWrapper } from "../dropzone/Dropzone";
import { useGetUserProfileForUpdate } from "@/hooks/form/useGetUserProfileUpdate";
import { EditProfileType } from "@/types";
import useHandleAccountProfileUpdate from "@/hooks/form/useHandleProfileUpdate";

type Props = {
  userId?: string | undefined;
};
const EditProfileForm = ({ userId }: Props) => {
  const { credentials } = useMedStore((store) => store);

  const form = useForm<EditProfileType>({
    mode: "uncontrolled",
    initialValues: profileFormInitials(credentials?.role as ROLES),
    validate: zodResolver(
      profileSchema(credentials?.role as ROLES) as z.ZodSchema<ProfileModified>
    ),
  });

  const {
    updateProfile: { mutateAsync },
  } = useHandleAccountProfileUpdate();

  const [file, setFile] = useState<File | null | string>(null);
  const [documentFile, setDocumentFile] = useState<File | string | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const {
    data,
    isLoading: isLoadingUser,
    error: isErrorUser,
    isSuccess,
  } = useGetUserProfileForUpdate(credentials?.role as ROLES, userId as string);

  const { ngaStates, lgas, setOption, option, isError } = useNgaStates();
  const { universities } = useGetUniversities();

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        form.initialize({
          profile: data?.profile as unknown as EditProfileType["profile"],
        });
        setFile(data?.profile?.profilePicture as string);
        setDocumentFile(data?.profile?.identificationDocument as string);
        setOption(data?.profile?.stateOfOrigin as string);
      } catch (error) {
        toast.error(`Error loading user data: ${error}`);
      }
    };
    if (data && isSuccess && userId) {
      loadUser();
    }
  }, [userId, data]);

  form.watch("profile.courseOfStudy", ({ value }) => {
    const degree = medicalCourses?.find(
      (course) => course.value === value
    )?.degree_awarded;
    form.setFieldValue("profile.degree", degree);
  });

  const handleSubmit = async () => {
    if (!form.isValid()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    try {
      setIsFormSubmitting(true);
      const changes = form.getValues();
      if (file instanceof File || documentFile instanceof File) {
        const uploads = [];

        if (file instanceof File) {
          uploads.push(handleFileUpload(file));
        }

        if (documentFile instanceof File) {
          uploads.push(handleFileUpload(documentFile));
        }

        const results = await Promise.all(uploads);
        changes.profile.profilePicture =
          results[0] ?? data?.profile?.profilePicture;
        changes.profile.identificationDocument =
          results[1] ?? data?.profile?.identificationDocument;
      }

      await mutateAsync({
        profile: changes.profile,
        profileId: data?.profile?.$id,
        scheduleId:
          credentials?.role === "doctor" ? data?.profile?.scheduleId : null,
        role: credentials?.role as ROLES,
      });
      form.resetDirty();
    } catch (error) {
      toast.error(`Error occurred: ${error}`);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const leftCard = rectifyFields(
    profileEditArrangeFields(credentials?.role as ROLES),
    "Information",
    {
      profile: ["profilePicture", "identificationDocument", "userId"],
    },
    {
      profile: ["address"],
      schedule: ["workSchedule"],
    },
    false,
    (universities?.data as unknown as ComboboxData) || [],
    (lgas as unknown as ComboboxData) || [],
    (ngaStates as unknown as ComboboxData) || [],
    []
  );

  const rightCard = rectifyRightCardProfileFields("Other Information", {}, {});

  const ExtraFields = (
    <div className="flex flex-col gap-4">
      <div>
        <div className="relative">
          {file ? (
            <Image
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : (file as string)
              }
              alt="profile picture"
              width={400}
              height={400}
              className=" rounded-full w-full object-cover"
            />
          ) : (
            <span className=" flex items-center justify-center rounded-full w-[300px] h-[300px] bg-gray-100">
              <IconPhotoScan stroke={1.5} width={80} height={80} />
            </span>
          )}
          {form.getValues().profile.profilePicture && (
            <ActionIcon
              className="absolute bottom-[5%] right-[12%] p-1 cursor-pointer"
              color=""
              variant="default"
              size="lg"
              radius="lg"
            >
              <input
                type="file"
                title=""
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files ? e.target.files[0] : null);
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <IconCamera stroke={1.5} />
            </ActionIcon>
          )}
        </div>
      </div>

      {documentFile ? (
        <section>
          <label className="text-sm">Identification Document</label>
          <Paper px="md" py="xs" radius="md">
            <div className="flex items-center justify-between gap-x-3 ">
              <span className="text-wrap">
                {documentFile instanceof File
                  ? documentFile.name
                  : documentFile.split("/")[8] + ".pdf"}
              </span>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  setDocumentFile(null);
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
          acceptFiles={["application/pdf", "image/jpeg", "image/png"]}
          maxFiles={1}
          file={documentFile as unknown as File}
          title="Drag or Upload your Identification Document"
          subtitle="Attach an identification document. A file should not exceed 2mb"
          handleDrop={
            setDocumentFile as React.Dispatch<React.SetStateAction<File | null>>
          }
          titleSize="md"
          titleAlign="center"
          groupHeight={200}
        />
      )}
    </div>
  );

  const isButtonDisabled = !(
    (form.isValid() && form.isDirty()) ||
    file instanceof File ||
    documentFile instanceof File
  );

  const isFormReset =
    form.isDirty() || file instanceof File || documentFile instanceof File;

  const handleResetFields = () => {
    form.reset();
    setFile(data?.profile?.profilePicture as string);
    setDocumentFile(data?.profile?.identificationDocument as string);
  };

  if (isErrorUser) {
    return <NotFound404 pageType="content" errorCode="404" />;
  }

  return (
    <Paper p={20} radius="md" shadow="sm" className="relative">
      <LoadingOverlay
        visible={isLoadingUser}
        loaderProps={{ children: <MedReserveLoader /> }}
      />
      <MedReserveFormFieldsT
        setOption={setOption}
        role={credentials?.role as ROLES}
        option={option}
        isError={isError}
        leftCard={leftCard}
        form={form}
        rightCard={rightCard}
        resetActions={handleResetFields}
        resetState={isFormReset}
        submitBtnLabel="Save Changes"
        submitBtnDisabled={isButtonDisabled}
        submitBtnLoading={isFormSubmitting}
        submitBtnAction={handleSubmit}
        extraFields={ExtraFields}
      />
    </Paper>
  );
};

export default EditProfileForm;
