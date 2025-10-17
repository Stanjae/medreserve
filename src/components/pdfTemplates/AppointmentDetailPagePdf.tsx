/* eslint-disable jsx-a11y/alt-text */
"use client";
import {
  View,
  Image,
  Text,
  Document,
  Page,
} from "@react-pdf/renderer";
import { styles } from "./style";
import {
  getAMPM,
  getAppointmentLocation,
  getTimeFromNow,
} from "@/utils/utilsFn";
import { searchAppointmentDetailsResponse } from "@/types";
import { durationOfVisit } from "@/constants";

type Props = {
  data?: searchAppointmentDetailsResponse | undefined;
};

const AppointmentDetailPagePdf = ({ data}: Props) => {

  const InfoCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      {children}
    </View>
  );

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
    showIcon?: boolean;
  }) => (
    <View
      style={{
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={{ paddingVertical: 40, paddingHorizontal: 30 }}>
        {/* Header */}
        <View style={styles.container}>
          <Image
            src="https://fra.cloud.appwrite.io/v1/storage/buckets/684c089700291c6d4e3e/files/686d02810007f24001a1/view?project=684b3c5600261b4fa7ca&mode=admin"
            style={styles.logo}
          />
          <Text style={styles.title}>MedReverse Hospital INC.</Text>
        </View>

        <View style={styles.divider} />

        {/* Main Content */}
        <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
          {/* Left Column */}
          <View style={{ flex: 2, gap: 20 }}>
            {/* Appointment Details */}
            <InfoCard title="Appointment Details">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <View style={{ width: "45%" }}>
                  <InfoRow label="Date" value={data?.bookingDate as string} />
                </View>
                <View style={{ width: "45%" }}>
                  <InfoRow
                    label="Time"
                    value={`${getAMPM(data?.startTime as string)} - ${getAMPM(data?.endTime as string)}`}
                  />
                </View>
                <View style={{ width: "45%" }}>
                  <InfoRow label="Duration" value={durationOfVisit} />
                </View>
                <View style={{ width: "45%" }}>
                  <InfoRow label="Type" value={data?.appointmentType as string} />
                </View>
                <View style={{ width: "45%" }}>
                  <InfoRow
                    label="Location"
                    value={getAppointmentLocation(data?.doctorId.specialization as string)}
                  />
                </View>
              </View>
            </InfoCard>

            {/* Doctor Information */}
            <InfoCard title="Doctor Information">
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                <Image
                  src={data?.doctorId.profilePicture}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                  >
                    {data?.doctorId.fullname}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#6B7280" }}>
                    {data?.doctorId.specialization}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ width: "45%" }}>
                  <InfoRow label="Email" value={data?.doctorId.email as string} />
                </View>
                <View style={{ width: "45%" }}>
                  <InfoRow label="Phone" value={data?.doctorId.phone as string} />
                </View>
              </View>
            </InfoCard>

            {/* Reason & Notes */}
            <InfoCard title="Reason for Visit">
              <Text
                style={{ fontSize: 11, color: "#374151", marginBottom: 12 }}
              >
                {data?.reason}
              </Text>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                  paddingTop: 12,
                }}
              >
                <Text
                  style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}
                >
                  Medical Notes
                </Text>
                <Text style={{ fontSize: 11, color: "#374151" }}>
                  {data?.notes}
                </Text>
              </View>
            </InfoCard>
          </View>

          {/* Right Column */}
          <View style={{ flex: 1, gap: 20 }}>
            {/* Patient Summary */}
            <InfoCard title="Patient Summary">
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                <Image
                  src={data?.patientId.profilePicture}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {data?.patientId.fullname}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#6B7280" }}>
                    {data?.patientId.userId}
                  </Text>
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <InfoRow
                  label="Age"
                  value={getTimeFromNow(data?.patientId.birthDate as string, true)}
                />
                <InfoRow label="Gender" value={data?.patientId.gender as string} />
                <InfoRow label="Blood Type" value={data?.patientId.bloodGroup as string} />
              </View>
            </InfoCard>

            {/* Appointment Info */}
            <View
              style={{
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}
              >
                Appointment Created
              </Text>
              <Text style={{ fontSize: 9, color: "#4B5563", marginBottom: 2 }}>
                {data?.$createdAt}
              </Text>
              <Text style={{ fontSize: 9, color: "#4B5563" }}>
                By: {data?.patientId.fullname}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AppointmentDetailPagePdf;
