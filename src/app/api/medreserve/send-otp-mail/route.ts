import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const { email, otpCode, username } = await request.json();

    if (!email || !otpCode || !username) {
      return NextResponse.json(
        { message: "Missing email, OTP code, or username" },
        { status: 400 }
      );
    }

    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      /*service: "gmail",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      } */
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
      from: process.env.RESEND_VERIFIED_DOMAIN_SENDER_EMAIL, //process.env.EMAIL_USER,
      to: email,
      subject: "MedReserve OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hello ${username},</p>
          <p style="margin-bottom: 10px; margin-top: 5px;">Please use the following OTP code to verify your account.</p>
    
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0056b3; margin-top: 0;">${otpCode}</h3>
          </div>
         
          <p>
          If you did not request this OTP, please ignore this email.
          </p>
    
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
      { message: "Email OTP sent successfully. Please check your inbox" , code: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
