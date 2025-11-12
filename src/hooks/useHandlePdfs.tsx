"use client";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { JSX } from "react";
import useHandleEmails from "./useHandleEmails";

type Props = {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  email: string;
  PdfElement: JSX.Element;
  endpoint: string;
};

const useHandlePdfs = () => {
  const { sendEmailAction } = useHandleEmails();
  const generatePdf = async (
    data: Props,
    fileType: "pdf" | "zip",
    fileName: string,
    sendEmail?: boolean
  ) => {
    try {
      const pdfBlobs = await generatePdfBlob(data.PdfElement);
      await createAndDownloadZip(pdfBlobs, fileType, fileName);
      if (sendEmail) {
        const base64 = await blobToBase64(pdfBlobs);
        await sendEmailAction({
          method: "POST",
          endpoint:data.endpoint,
          showToast: true,
          data: {
            email: data.email,
            pdfBase64: base64,
            patientName: data.patientName,
            doctorName: data.doctorName,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
          },
        });
      }
    } catch (error) {
      console.error("Error generating PDFs:", error);
    }
  };

  async function generatePdfBlob(PdfElement: JSX.Element) {
    const blob = await pdf(PdfElement).toBlob();
    return blob;
  }

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  async function createAndDownloadZip(
    pdfBlobs: Blob,
    fileType: "pdf" | "zip",
    fileName: string
  ) {
    const zip = new JSZip();
    const agent_name = "Medreserve"; // This can be dynamic for different PDFs.
    const blob = pdfBlobs;
    zip.file(`${agent_name}-${Date.now()}.pdf`, blob);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    if (fileType === "pdf") {
      saveAs(blob, `${fileName}.pdf`);
    } else {
      saveAs(zipBlob, `${fileName}.zip`);
    }
  }

  return { generatePdf };
};

export default useHandlePdfs;
