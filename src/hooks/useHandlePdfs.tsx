"use client";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { JSX } from "react";
import { toast } from "sonner";

const useHandlePdfs = ({
  PdfElement,
  email,
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  email: string;
  PdfElement: JSX.Element;
}) => {
  const generatePdf = async (fileType:'pdf'|'zip', fileName: string) => {
    try {
      const pdfBlobs = await generatePdfBlob();
      await createAndDownloadZip(pdfBlobs, fileType, fileName);
    } catch (error) {
      console.error("Error generating PDFs:", error);
    }
  };

  async function generatePdfBlob() {
    const blob = await pdf(PdfElement).toBlob();
    return blob;
  };

  async function sendPdfEmail(endpoint: string) {
    try {
       const pdfBlobs = await generatePdfBlob();
      const base64 = await blobToBase64(pdfBlobs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
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

  async function createAndDownloadZip(pdfBlobs: Blob, fileType:'pdf'|'zip', fileName: string) {
    const zip = new JSZip();
    const agent_name = "Medreserve"; // This can be dynamic for different PDFs.
    const blob = pdfBlobs;
    zip.file(`${agent_name}-${Date.now()}.pdf`, blob);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      if (fileType === 'pdf') {
        saveAs(blob, `${fileName}.pdf`);
      } else {
           saveAs(zipBlob, `${fileName}.zip`);
      }
   
  }

  return { generatePdf, sendPdfEmail };

};

export default useHandlePdfs;
