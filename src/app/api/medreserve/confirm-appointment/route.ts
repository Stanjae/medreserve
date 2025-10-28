import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Parse JSON body
      const { email, pdfBase64, patientName, doctorName, appointmentDate, appointmentTime } = await request.json();

    if (!email || !pdfBase64) {
      return NextResponse.json(
        { error: "Missing email or PDF data" },
        { status: 400 }
      );
    }

    // Extract base64 string without prefix "data:application/pdf;base64,"
    const base64Data = pdfBase64.split(";base64,").pop();

    if (!base64Data) {
      return NextResponse.json({ error: "Invalid PDF data" }, { status: 400 });
    }

    const pdfBuffer = Buffer.from(base64Data, "base64");

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.RESEND_VERIFIED_DOMAIN_SENDER_EMAIL,
      to: email,
      subject: "Confirmation of Medical Appointment",
      attachments: [
        {
          filename: "document.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">Confirmation of Your Medical Appointment</h2>
          <p>Dear ${patientName},</p>
          <p>We're writing to confirm your upcoming medical appointment with ${doctorName ? `<strong>Dr. ${doctorName}</strong> at ` : ""}<strong>${process.env.COMPANY_NAME}</strong>.</p>
    
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0056b3; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Location:</strong> ${process.env.COMPANY_ADDRESS}</p>
          </div>
    
          <p>Your detailed appointment information, including any necessary preparation instructions or forms, is attached to this email as a PDF document. Please review it carefully before your visit.</p>
    
          <p><strong>What to Bring to Your Appointment:</strong></p>
          <ul>
            <li>Your ID/driver's license</li>
            <li>Insurance card(s)</li>
            <li>A list of any medications you are currently taking</li>
          </ul>
    
          <p>You can always reschedule your appointments in your dashboard in advance. If you have any questions, please don't hesitate to contact us:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:${process.env.COMPANY_PHONE}" style="color: #0056b3; text-decoration: none;">${process.env.COMPANY_PHONE}</a><br>
            <strong>Website:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #0056b3; text-decoration: none;">${process.env.COMPANY_NAME}</a>
          </p>
    
          <p>We look forward to providing you with excellent care.</p>
    
          <p>Sincerely,<br>
          The Team at ${process.env.COMPANY_NAME}</p>
          <p style="font-size: 0.9em; color: #777;">
            ${process.env.COMPANY_PHONE} | <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #0056b3; text-decoration: none;">${process.env.COMPANY_NAME}</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
