"use client";
import CustomModal from "@/components/modals/CustomModal";
import { MedicalRecord } from "../../../../types/appwrite";
import {
  IconActivity,
  IconCalendar,
  IconClock,
  IconFileCheck,
  IconFileText,
  IconHeart,
  IconPill,
  IconRuler,
  IconThermometer,
  IconWeight,
} from "@tabler/icons-react";
import { Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Image from "next/image";
import useMarkMedicalPrescription from "@/hooks/useMarkMedicalPrescription";
type Props = {
  opened: boolean;
  onClose: () => void;
  record: MedicalRecord | undefined;
};

const MedicalRecordsDetail = ({ opened, onClose, record }: Props) => {
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false);

  const { markAsCompleted } = useMarkMedicalPrescription();

  const handleConfirm = async () => {
    await markAsCompleted.mutateAsync(record?.$id as string);
  };
  return (
    <CustomModal
      opened={opened}
      withOverlay
      onClose={onClose}
      size="xl"
      title="Medical Record Details"
    >
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Medical Record</h1>
              <div className="flex items-center gap-2">
                <IconCalendar size={18} />
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                  {new Date(record?.$createdAt as string).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-blue-100">Record ID: {record?.$id}</p>
              <p className="text-blue-100 text-sm">
                Created:{" "}
                {new Date(record?.$createdAt as string).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Doctor Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <Image
                src={record?.appointmentId?.doctorId?.profilePicture as string}
                alt="profile"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {record?.appointmentId?.doctorId?.fullname}
                </h2>
                <p className="text-gray-600">
                  {record?.appointmentId?.doctorId?.specialization}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Appointment ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {record?.appointmentId.$id}
                </p>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconActivity className="text-blue-600" size={20} />
                Vital Signs
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <IconActivity className="text-red-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">
                      Blood Pressure
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {record?.vitals?.BloodPressure}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">mmHg</p>
                </div>

                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <div className="flex items-center gap-2 mb-2">
                    <IconHeart className="text-pink-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">
                      Heart Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {record?.vitals?.HeartRate}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">bpm</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <IconThermometer className="text-orange-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">
                      Temperature
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {record?.vitals?.Temperature}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">°F</p>
                </div>

                {record?.vitals?.Weight && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <IconWeight className="text-purple-600" size={18} />
                      <span className="text-sm font-semibold text-gray-700">
                        Weight
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {record.vitals.Weight}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">lbs</p>
                  </div>
                )}

                {record?.vitals?.Height && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <IconRuler className="text-blue-600" size={18} />
                      <span className="text-sm font-semibold text-gray-700">
                        Height
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {record.vitals.Height}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">inches</p>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <IconFileCheck className="text-blue-600" size={20} />
                Diagnosis
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-900 font-semibold">
                  {record?.diagnosis}
                </p>
              </div>
            </div>

            {/* Prescription */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <IconPill className="text-blue-600" size={20} />
                Prescription
              </h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-900 whitespace-pre-line">
                  {record?.prescription}
                </p>
              </div>
            </div>

            {/* Doctor's Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <IconFileText className="text-blue-600" size={20} />
                Doctor&apos;s Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">
                  {record?.notes}
                </p>
              </div>
            </div>

            {/* Follow-up */}
            {record?.isFollowUpRequired && (
              <div className="mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <IconClock
                      className="text-amber-600 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">
                        Follow-up Required
                      </p>
                      {record?.followUpDate && (
                        <p className="text-amber-800 text-sm">
                          Recommended date:{" "}
                          {new Date(record.followUpDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <Group grow>
              <Button onClick={close} variant="light" color="m-blue" size="lg">
                close{" "}
              </Button>

              <Button disabled={record?.isPrescriptionCompleted} onClick={openConfirmation} size="lg">
                Mark as Complete
              </Button>
            </Group>
          </div>
        </div>

        {/* Record Information Footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <IconFileText
              className="text-blue-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">About Your Medical Records</p>
              <p>
                Your medical records are securely stored and accessible only to
                you and your authorized healthcare providers. You can download
                or share this record at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        btnText="Confirm"
        close={closeConfirmation}
        modalContent="Are you sure you want to mark this prescription as completed?"
        modalHeader="Mark Prescription as Completed"
        opened={openedConfirmation}
        loading={markAsCompleted.isPending}
        fn={handleConfirm}
      />
    </CustomModal>
  );
};

export default MedicalRecordsDetail;
