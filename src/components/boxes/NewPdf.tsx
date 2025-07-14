"use client";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { JSX } from "react";
import { toast } from "sonner";

const GeneratePdfButton = ({
  PdfElement,
  email,
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
  trigger,
}: {
  trigger: JSX.Element;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  email: string;
  PdfElement: JSX.Element;
}) => {
  const generatePdf = async () => {
    try {
      const pdfBlobs = await generatePdfBlob();
      await createAndDownloadZip(pdfBlobs);
      await sendPdfEmail(pdfBlobs);
    } catch (error) {
      console.error("Error generating PDFs:", error);
    }
  };

  const generatePdfBlob = async () => {
    const blob = await pdf(PdfElement).toBlob();
    return blob;
  };

  async function sendPdfEmail(newBlob: Blob) {
    try {
      // Convert Blob to base64 string
      const base64 = await blobToBase64(newBlob);

      const response = await fetch("/api/medreserve/send-pdf-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "stanykhay29@gmail.com",
          pdfBase64: base64,
          patientName,
          doctorName,
          appointmentDate,
          appointmentTime,
        }),
      });

      if (response.ok) {
        toast.success("Email sent successfully! Please check your inbox.");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error, email);
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  async function createAndDownloadZip(pdfBlobs: Blob) {
    const zip = new JSZip();
    const agent_name = "Medreserve"; // This can be dynamic for different PDFs.
    const blob = pdfBlobs;
    zip.file(`${agent_name}-${Date.now()}.pdf`, blob);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "receipt.zip");
  }

  return <div onClick={generatePdf}>{trigger}</div>;
};

export default GeneratePdfButton;
