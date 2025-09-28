"use client";
import {
  userEditFormArrange,
  userFormInitials,
} from "@/constants/formInitialValues";
import { userSchema } from "@/lib/schema/zod";
import {
  handleFileUpload,
  rectifyFields,
  rectifyRightCardFields,
} from "@/utils/utilsFn";
import { ComboboxData, Paper } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import MedReserveFormFields from "./Formfields.tsx/MedReserveFormFields";
import { useHash } from "@/hooks/useHash";
import { ROLES } from "@/types/store";
import { useFetchRolesrForEdit } from "@/hooks/form/useFetchUserForEdit";
import { toast } from "sonner";
import { EditUserModified } from "@/types/actions.types";
import useHandleEditProfile from "@/hooks/form/useHandleEditProfile";
import { z } from "zod";
import useNgaStates from "@/hooks/useNgaStates";
import useGetUniversities from "@/hooks/useGetUniversities";
import { medicalCourses } from "@/constants";
import { useRouter } from "next/navigation";
import { useMedStore } from "@/providers/med-provider";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

const CreateUserForm = () => {
  const hash = useHash()?.replace("#", "");
  const router = useRouter();
  const { credentials } = useMedStore((store) => store);

  const form = useForm<EditUserModified>({
    mode: "uncontrolled",
    initialValues: userFormInitials(hash as ROLES),
    validate: zodResolver(
      userSchema(hash as ROLES) as z.ZodSchema<EditUserModified>
    ),
  });

  const {
    createProfile: { mutateAsync: createMutateAsync },
  } = useHandleEditProfile();

  const [file, setFile] = useState<File | string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | string | null>(null);

  const { data: roles } = useFetchRolesrForEdit(hash as ROLES);

  const { ngaStates, lgas, setOption, option, isError } = useNgaStates();
  const { universities } = useGetUniversities();

  const handleFiles = useCallback(async () => {
    try {
      const uploads = [];

      if (file instanceof File) {
        uploads.push(handleFileUpload(file));
      }

      if (documentFile instanceof File) {
        uploads.push(handleFileUpload(documentFile));
      }

      const results = await Promise.all(uploads);

      const photoUrl = file instanceof File ? results[0] : file;
      const documentUrl =
        documentFile instanceof File
          ? file instanceof File
            ? results[1]
            : results[0]
          : documentFile;

      if (photoUrl && photoUrl !== file) {
        form.setFieldValue("profile.profilePicture", photoUrl);
      }

      if (documentUrl && documentUrl !== documentFile) {
        form.setFieldValue("profile.identificationDocument", documentUrl);
      }
    } catch (error) {
      toast.error("Failed to upload files");
      console.error("File upload error:", error);
    }
  }, [file, documentFile, form]);

  // Handle file uploads when files change
  useEffect(() => {
    if (!(file instanceof File) && !(documentFile instanceof File)) return;
    handleFiles();
  }, [file, documentFile]);

  // Load user data

  useEffect(() => {
    if (form.errors["profile.profilePicture"]) {
      toast.error("Profile picture is required");
      return;
    }
  }, [form.errors]);

  form.watch("profile.courseOfStudy", ({ value }) => {
    const degree = medicalCourses?.find(
      (course) => course.value === value
    )?.degree_awarded;
    form.setFieldValue("profile.degree", degree);
  });

  const handleSubmit = async () => {
    form.onSubmit(async (values) => {
      console.log("values", values);
      const response = await createMutateAsync({
        ...values,
        role: hash,
      } as EditUserModified & { role: ROLES });

      if (response.code === 200) {
        router.push(
          `/admin/${credentials?.userId}/dashboard/users/edit?userId=${response.userId}#${response.role}`
        );
      }
    })();
  };

  const leftCard = rectifyFields(
    userEditFormArrange(hash as ROLES),
    "Information",
    {
      account: ["status"],
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
    (roles as unknown as ComboboxData) || []
  );

  const rightCard = rectifyRightCardFields(
    userFormInitials(hash as ROLES),
    "Other Information",
    { account: ["status"] },
    { account: ["status"] }
  );

  return (
    <Paper p={20} radius="md" shadow="sm" className="relative">
      <MedReserveFormFields
        setOption={setOption}
        role={hash as ROLES}
        option={option}
        isError={isError}
        leftCard={leftCard}
        form={form}
        rightCard={rightCard}
        resetActions={form.reset}
        submitBtnDisabled={!form.isValid()}
        submitBtnLabel="Create User"
        submitBtnLoading={form.submitting}
        submitBtnAction={handleSubmit}
        setFile={setFile}
        file={file}
        setDocumentFile={setDocumentFile}
        documentFile={documentFile}
      />
    </Paper>
  );
};

export default CreateUserForm;
