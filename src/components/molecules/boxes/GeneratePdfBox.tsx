"use client";
import useHandlePdfs from "@/hooks/useHandlePdfs";
import { IconDownload } from "@tabler/icons-react";
import { Payment } from "../../../../types/appwrite";
import AppointmentReceipt from "@/components/organisms/pdfTemplates/AppointmentReceipt";
import { Button } from "@mantine/core";
import { serviceEndpoints } from "@/lib/queryclient/serviceEndpoints";
import { getAMPWAT } from "@/utils/utilsFn";

type Props = {
  response: Payment | null;
};

const GeneratePdfBox = ({ response }: Props) => {
  const metaData = JSON.parse(response?.metaData || "");
  const { generatePdf } = useHandlePdfs();
  const data = {
    appointmentDate: response?.appointment?.bookingDate as string,
    appointmentTime: getAMPWAT(
      `${response?.appointment?.bookingDate}T${response?.appointment?.startTime}`
    ),
    email: metaData?.email as string,
    doctorName: response?.doctorId?.fullname as string,
    patientName: metaData?.fullname as string,
    PdfElement: <AppointmentReceipt response={response} type="appointment" />,
    endpoint: serviceEndpoints.EMAILS.confirmAppointment,
  };
  return (
    <div>
      <Button
        radius={35}
        rightSection={<IconDownload />}
        onClick={async () =>
          await generatePdf(data, "pdf", "Appointment Receipt", true)
        }
      >
        Download
      </Button>
    </div>
  );
};

export default GeneratePdfBox;
