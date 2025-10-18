"use client";
import {
  userEditFormArrange,
  userFormInitials,
} from "@/constants/formInitialValues";
import { useMedReserveForm } from "@/hooks/form/useMedReserveForm";
import { userSchema } from "@/lib/schema/zod";
import {
  handleFileUpload,
  rectifyFields,
  rectifyRightCardFields,
} from "@/utils/utilsFn";
import { ComboboxData, LoadingOverlay, Paper } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import MedReserveFormFields from "./Formfields.tsx/MedReserveFormFields";
import { useHash } from "@/hooks/useHash";
import { ROLES } from "@/types/store.types";
import {
  useFetchUserForEdit,
  useFetchRolesrForEdit,
} from "@/hooks/form/useFetchUserForEdit";
import { toast } from "sonner";
import {
  EditAccountSubSectionType,
  EditUserModified,
  EditUserParams,
} from "@/types/actions.types";
import MedReserveLoader from "../loaders/MedReserveLoader";
import useHandleEditProfile from "@/hooks/form/useHandleEditProfile";
import { z } from "zod";
import useNgaStates from "@/hooks/useNgaStates";
import useGetUniversities from "@/hooks/useGetUniversities";
import NotFound404 from "../boxes/NotFound";
import { medicalCourses } from "@/constants";
import { useRouter } from "next/navigation";
import { useMedStore } from "@/providers/med-provider";

type Props = {
  userId?: string | string[] | undefined;
};
const EditUserForm = ({ userId }: Props) => {
  const hash = useHash()?.replace("#", "");
  const router = useRouter();
  const { credentials } = useMedStore((store) => store);

  const { form, loadData, saveChanges, hasChanges, isLoading, reset } =
    useMedReserveForm<EditUserModified>({
      initialValues: userFormInitials(hash as ROLES, userId as string),
      schema: userSchema(
        hash as ROLES,
        userId as string
      ) as z.ZodSchema<EditUserModified>,
      ignoreFields: [
        "$id",
        "account.$id",
        "$createdAt",
        "$updatedAt",
        "profile.$permissions",
        "phone",
        "profile.reviewsId",
        "profile.rating",
        "profile.$id",
        "profile.userId",
      ],
    });

  const {
    updateProfile: { mutateAsync },
    deleteProfile: { mutateAsync: deleteMutateAsync },
  } = useHandleEditProfile();

  const [file, setFile] = useState<File | null | string>(null);
  const [documentFile, setDocumentFile] = useState<File | string | null>(null);
  const {
    data,
    isLoading: isLoadingUser,
    error: isErrorUser,
    isSuccess,
  } = useFetchUserForEdit(hash as ROLES, userId as string);

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
    const loadUser = async () => {
      try {
        loadData({
          account: data?.account as EditAccountSubSectionType,
          profile: data?.profile as unknown as EditUserModified["profile"],
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

  useEffect(() => {
    if (form.errors["profile.profilePicture"]) {
      toast.error("Profile picture is required");
      return;
    }
  }, [form.errors]);

  if (isErrorUser) {
    return <NotFound404 pageType="content" errorCode="404" />;
  }

  form.watch("profile.courseOfStudy", ({ value }) => {
    const degree = medicalCourses?.find(
      (course) => course.value === value
    )?.degree_awarded;
    form.setFieldValue("profile.degree", degree);
  });

  const handleSubmit = async () => {
    await saveChanges(async (changes) => {
      return await mutateAsync({
        ...changes,
        accountId: data?.account?.$id,
        profileId: data?.profile?.$id,
        scheduleId: hash === "doctor" ? data?.profile?.scheduleId : null,
        role: hash,
      } as EditUserModified & EditUserParams);
    });
  };

  const handleDelete = async () => {
    const response = await deleteMutateAsync({
      accountId: data?.account?.$id,
      profileId: data?.profile?.$id,
      scheduleId: hash === "doctor" ? data?.profile?.scheduleId : null,
      role: hash,
    });
    if (response.code === 200) {
      router.push(`/admin/${credentials?.userId}/dashboard/users`);
    }
  };

  const leftCard = rectifyFields(
    userEditFormArrange(hash as ROLES, userId as string),
    "Information",
    {
      account: ["status"],
      profile: ["profilePicture", "identificationDocument", "userId"],
    },
    {
      account: ["username"],
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
      <LoadingOverlay
        visible={isLoadingUser}
        loaderProps={{ children: <MedReserveLoader /> }}
      />
      <MedReserveFormFields
        setOption={setOption}
        role={hash as ROLES}
        option={option}
        isError={isError}
        leftCard={leftCard}
        form={form}
        rightCard={rightCard}
        resetActions={reset}
        submitBtnLabel="Save Changes"
        submitBtnDisabled={!hasChanges()}
        submitBtnLoading={isLoading}
        submitBtnAction={handleSubmit}
        handleDeleteUser={handleDelete}
        setFile={setFile}
        file={file}
        setDocumentFile={setDocumentFile}
        documentFile={documentFile}
      />
    </Paper>
  );
};

export default EditUserForm;
