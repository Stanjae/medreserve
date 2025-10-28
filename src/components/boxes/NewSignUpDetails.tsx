"use client";
import { checkPermission, parseResponse } from "@/utils/utilsFn";
import { ModifiedUser } from "../../../types/appwrite";
import { Avatar, Badge, Card, Divider, Group, Tabs, Text } from "@mantine/core";
import {
  IconBooks,
  IconBuilding,
  IconCircleCheck,
  IconClockHour4,
  IconHomeEco,
  IconId,
  IconMailCheck,
  IconMicroscopeFilled,
  IconPhoneCall,
  IconPointFilled,
  IconSchool,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import useVerifyBlockUser from "@/hooks/useVerifyBlockUser";
import { useMedStore } from "@/providers/med-provider";
import { toast } from "sonner";
import { PermissionsDataType } from "@/types";

type Props = {
  row: ModifiedUser;
  onClose: () => void;
};

const NewSignUpDetails = ({ row, onClose }: Props) => {
  const { adminPermissions } = useMedStore((state) => state);

  const {
    handleBlock: { mutateAsync, isPending },
    handleVerify: {
      mutateAsync: mutateVerifyAsync,
      isPending: isPendingVerify,
    },
  } = useVerifyBlockUser();

  const handleBlockUser = () => {
    const stats = checkPermission(
      adminPermissions?.permissions as PermissionsDataType,
      "users",
      "suspend_user"
    );
    if (!stats) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    mutateAsync({ paramsId: row?.$id, status: !row.status });
    onClose();
  };

  const handleVerifyUser = () => {
    const stats = checkPermission(
      adminPermissions?.permissions as PermissionsDataType,
      "users",
      "verify_user"
    );
    if (!stats) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    mutateVerifyAsync({ paramsId: row?.$id, status: !row.emailVerification });
    onClose();
  };
  const DoctorCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-0">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {row?.profile?.profilePicture ? (
              <Avatar size={"xl"} src={row?.profile?.profilePicture} />
            ) : (
              <Avatar size={"xl"}>{row?.name?.slice(0, 2)}</Avatar>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {row?.labels == "doctor"
                  ? `Dr. ${row?.profile?.fullname}`
                  : `${row?.profile?.fullname}`}
              </h3>
              <div className="flex items-center gap-x-2 capitalize">
                <p className="text-cyan-500 capitalize font-semibold">
                  {row?.labels == "doctor"
                    ? parseResponse(row?.profile?.specialization)
                    : row?.profile?.occupation}
                </p>
                <IconPointFilled size={14} />
                <span>{row?.profile?.cadre}</span>
              </div>

              <div className="flex items-center mt-1 gap-x-1">
                <p className="text-sm text-primary font-medium capitalize">
                  {row?.profile?.gender}
                </p>
                <IconPointFilled size={12} />
                <p className="text-sm text-grayText font-medium capitalize">
                  {dayjs(row.profile?.birthDate).format("DD-MM-YYYY")}
                </p>
                <IconPointFilled size={12} />
                <p className="text-sm text-gray-600 ">
                  {row?.profile?.experience} years of experience
                </p>
              </div>

              <div className="flex items-center mt-2">
                <Badge
                  leftSection={
                    !row?.emailVerification ? (
                      <IconClockHour4 size={14} />
                    ) : (
                      <IconCircleCheck size={14} />
                    )
                  }
                  variant="outline"
                  color={row?.emailVerification ? "green" : "m-gray"}
                >
                  {row?.emailVerification
                    ? "Verified"
                    : "Pending Email Verification"}
                </Badge>
                <span className="ml-3 text-sm text-gray-700">
                  Applied On: {new Date(row.$createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* personal info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">
              Personal Information
            </h4>
            {row?.labels == "doctor" && (
              <div className="flex items-center gap-x-2 text-gray-600">
                <IconHomeEco size={14} />
                <span>
                  {row?.profile?.lga}, {row?.profile?.stateOfOrigin}
                </span>
              </div>
            )}
            {row?.labels == "patient" && (
              <>
                <div className="flex items-center gap-x-2 text-gray-600">
                  <span>Identification Type:</span>
                  <span>{row?.profile?.identificationType || "N/A"}</span>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600">
                  <span>Identification No:</span>
                  <span>{row?.profile?.identificationNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600">
                  <span>Insurance Company:</span>
                  <span>{row?.profile?.insuranceProvider || "N/A"}</span>
                </div>

                <div className="flex items-center gap-x-2 text-gray-600">
                  <span>Insurance No:</span>
                  <span>{row?.profile?.insurancePolicyNumber || "N/A"}</span>
                </div>
              </>
            )}
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold te{xt-gray-900 text-lg">
              {row?.labels == "doctor"
                ? "Work Information"
                : "Medical & Health Information"}
            </h4>
            {row?.labels == "doctor" && (
              <div className="flex items-center gap-x-2 text-gray-600">
                <IconId size={14} />
                <span>#{row?.prefs?.medId}</span>
              </div>
            )}
            {row?.labels == "patient" && (
              <>
                <div className="flex items-center gap-x-2 text-gray-600 capitalize">
                  <span>Blood Group:</span>
                  <span>{row?.profile?.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600 capitalize">
                  <span>Genotype:</span>
                  <span>{row?.profile?.genotype}</span>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600 capitalize">
                  <span>Allergies:</span>
                  <span>{row?.profile?.allergies}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">
              Contact Information
            </h4>
            <div className="flex items-center gap-x-2 text-base text-gray-600">
              <IconMailCheck size={14} />
              <span>{row.email}</span>
            </div>
            <div className="flex items-center gap-x-2 text-gray-600">
              <IconPhoneCall size={14} />
              <span>{row.profile?.phone}</span>
            </div>
            <div className="flex items-start gap-x-2 text-gray-600 text-wrap">
              <IconBuilding size={14} />
              <span>{row.profile?.address}</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">
              {row?.labels == "doctor" ? "Education" : "Emergency Contact"}
            </h4>
            {row?.labels == "patient" && (
              <>
                <div className="flex items-center gap-x-2 text-gray-600 capitalize">
                  <span>Emergency Name:</span>
                  <span>{row?.profile?.emergencyContactName}</span>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600 capitalize">
                  <span>Emergency Phone:</span>
                  <span>{row?.profile?.emergencyContactNumber}</span>
                </div>
              </>
            )}
            {row?.labels == "doctor" && (
              <div className="flex items-center gap-x-2 text-gray-600">
                <IconSchool size={14} />
                <span>{row?.profile?.university}</span>
              </div>
            )}
            {row?.labels == "doctor" && (
              <div className="flex gap-x-2 items-center text-gray-600">
                <IconMicroscopeFilled size={14} />
                <span>{row?.profile?.courseOfStudy}</span>
              </div>
            )}
            {row?.labels == "doctor" && (
              <div className="flex gap-x-2 items-center text-gray-600">
                <IconBooks size={14} />
                <span>{row?.profile?.degree}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Bio */}
        {row?.labels == "doctor" && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Professional Bio
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-pretty text-gray-700 leading-relaxed">
                {row.profile?.bio || "N/A"}
              </p>
            </div>
          </div>
        )}

        {row?.labels == "patient" && (
          <>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Current Medication
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-pretty text-gray-700 leading-relaxed">
                  {row.profile?.currentMedication || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Past Medical History
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-pretty text-gray-700 leading-relaxed">
                  {row.profile?.pastMedicalHistory || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Family Medical History
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-pretty text-gray-700 leading-relaxed">
                  {row.profile?.familyMedicalHistory || "N/A"}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Documents Section */}
        {row.labels == "doctor" && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Submitted Documents ( {row?.emailVerification ? 2 : 0}/ 2{" "}
              {row.emailVerification ? "verified" : "pending"} )
            </h4>
            <div className="flex flex-wrap">
              <Badge
                leftSection={
                  row?.emailVerification ? (
                    <IconCircleCheck size={14} />
                  ) : (
                    <IconClockHour4 size={14} />
                  )
                }
                variant="light"
                color={row?.emailVerification ? "green" : "yellow"}
              >
                {row?.profile?.identificationType}
              </Badge>

              <Badge
                leftSection={
                  row?.emailVerification ? (
                    <IconCircleCheck size={14} />
                  ) : (
                    <IconClockHour4 size={14} />
                  )
                }
                variant="light"
                color={row?.emailVerification ? "green" : "yellow"}
              >
                Medical Certificate
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DocumentsCard = () => (
    <div className="px-3">
      <h3 className="font-semibold text-gray-900 text-lg">
        Personal Information
      </h3>
      <p>Uploaded documents will appear here</p>

      <Card withBorder shadow="sm" my="md" radius="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Text fw={500}>
            {row?.labels == "patient" ? "ID Card" : "Medical Certificate"}
          </Text>
          <Divider my="sm" />
          <div>
            {row?.profile?.identificationDocument && (
              <Image
                src={row?.profile?.identificationDocument as string}
                width={500}
                height={300}
                alt="document"
              />
            )}
          </div>
        </Card.Section>
      </Card>
    </div>
  );

  return (
    <div className="relative">
      <Tabs defaultValue="profile" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="documents">Verification Documents</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <DoctorCard />
        </Tabs.Panel>
        <Tabs.Panel value="documents">
          <DocumentsCard />
        </Tabs.Panel>
      </Tabs>
      <Group
        gap="1px"
        grow
        className="fixed bottom-0 left-0 w-full pt-1 z-50 bg-background"
      >
        <CustomCancelBtn
          modalContent={`Are you sure you want to ${row?.status ? "block" : "unblock"} this user?`}
          btnProps={{ radius: "xs", color: "m-background.9", size: "md" }}
          modalHeader={row?.status ? "Block a User" : "Unblock a User"}
          btnText={row?.status ? "Block" : "Unblock"}
          fn={handleBlockUser}
          loading={isPending}
        />
        <CustomCancelBtn
          modalContent={`Are you sure you want to ${row?.emailVerification ? "unverify" : "verify"} this user?`}
          btnProps={{
            radius: "xs",
            size: "md",
            color: row?.emailVerification ? "green" : "m-orange",
            rightSection: row?.emailVerification ? (
              <IconCircleCheck />
            ) : (
              <IconClockHour4 />
            ),
          }}
          modalHeader={
            row?.emailVerification ? "Unverify a User" : "Verify a User"
          }
          btnText={row?.emailVerification ? "Verified" : "Verify User"}
          fn={handleVerifyUser}
          loading={isPendingVerify}
        />
      </Group>
    </div>
  );
};

export default NewSignUpDetails;
