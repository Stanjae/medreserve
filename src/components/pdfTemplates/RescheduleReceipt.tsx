/* eslint-disable jsx-a11y/alt-text */
import { Image, Text, View } from "@react-pdf/renderer";
import { getAMPWAT } from "@/utils/utilsFn";
import { styles } from "./style";
import { RescheduleAppointmentParams } from "@/types/actions.types";

export type ExtendedParams = {
  reference: string;
  status: string;
  authorization: string;
  paidOn: string;
  metaData: string;
};
type AppointmentReceiptProps = {
  response: RescheduleAppointmentParams & ExtendedParams;
};

const RescheduleReceipt = ({ response }: AppointmentReceiptProps) => {
  const authorization = JSON.parse(response?.authorization ?? "");
  return (
    <section className="pr-3">
      <View style={styles.container}>
        <Image
          src={
            "https://fra.cloud.appwrite.io/v1/storage/buckets/684c089700291c6d4e3e/files/686d02810007f24001a1/view?project=684b3c5600261b4fa7ca&mode=admin"
          }
          style={styles.logo}
        />
        <Text style={styles.title}>MedReverse Hospital INC.</Text>
      </View>

      <div style={styles.divider} />

      <Text style={styles.heading}>Reschedule Appointment</Text>

      <Text style={styles.heading2}>Dear, {response?.fullname}</Text>

      <Text style={styles.description}>
        Your appointment with Dr. {response?.doctorName} has been rescheduled
        sucessfully . Bring this document on your day of appointment.
      </Text>
      <View style={styles.margin}>
        <View style={styles.flex}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{response?.fullname}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Booking For:</Text>
          <Text style={styles.value}>
            {response?.capacity + "  "}
            {response?.capacity == "1" ? "Person" : "Persons"}
          </Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{response?.email}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{response?.bookingDate}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {getAMPWAT(`${response?.bookingDate}T${response?.startTime}Z`)}
          </Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Doctor&apos;s Name:</Text>
          <Text style={styles.value}>Dr. {response?.doctorName}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Booking Code:</Text>
          <Text style={styles.value}>{response?.slotId}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={styles.flex}>
          <Text style={styles.label}>Payment Reference:</Text>
          <Text style={styles.value}>{response?.reference}</Text>
        </View>
        <div style={styles.divider2} />
        <View style={{ ...styles.flex }}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>
            {authorization?.card_type + " " + authorization?.channel}
          </Text>
        </View>
        <div style={styles.divider2} />
      </View>
    </section>
  );
};

export default RescheduleReceipt;
