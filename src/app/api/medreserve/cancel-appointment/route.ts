import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      email,
      patientName,
      doctorName,
      appointmentDate,
      appointmentTime,
      cancellationReason,
      refundAmount,
      refundPercentage,
      refundReference,
        expectedRefundDate,
        userId   
    } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.RESEND_VERIFIED_DOMAIN_SENDER_EMAIL!,
      to: email,
      subject: "Appointment Cancellation Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; color: white;">Appointment Cancelled</h2>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Dear ${patientName},</p>
            <p>This email confirms that your appointment with ${doctorName ? `<strong>Dr. ${doctorName}</strong> at ` : ""}<strong>${process.env.NEXT_PUBLIC_COMPANY_NAME}</strong> has been <strong>successfully cancelled</strong>.</p>
      
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #991b1b; margin-top: 0;">Cancelled Appointment Details:</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
              <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              ${cancellationReason ? `<p style="margin: 5px 0;"><strong>Cancellation Reason:</strong> ${cancellationReason}</p>` : ""}
            </div>
      
            ${
              refundAmount
                ? `
            <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">Refund Information:</h3>
              <p style="margin: 5px 0;"><strong>Refund Amount:</strong> <span style="font-size: 1.2em; color: #059669;">${refundAmount}</span> (${refundPercentage}% of original payment)</p>
              ${refundReference ? `<p style="margin: 5px 0;"><strong>Refund Reference:</strong> REF_${refundReference}</p>` : ""}
              <p style="margin: 5px 0;"><strong>Processing Time:</strong> 5-7 business days</p>
              ${expectedRefundDate ? `<p style="margin: 5px 0;"><strong>Expected By:</strong> ${expectedRefundDate}</p>` : ""}
              <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #065f46;">
                The refund will be credited to your original payment method. You will receive another email once the refund has been processed.
              </p>
            </div>
            `
                : refundAmount
                  ? `
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">Refund Status:</h3>
              <p style="margin: 5px 0; color: #92400e;">
                Based on our cancellation policy, this appointment is not eligible for a refund. 
                The cancellation was made less than 12 hours before the scheduled appointment time.
              </p>
            </div>
            `
                  : ""
            }
      
            <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">What Happens Next?</h3>
              <ol style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
                <li>Your appointment slot has been released and is now available for other patients</li>
                ${
                  refundAmount
                    ? `
                <li>Our team will review and approve your refund within 24 hours</li>
                <li>Once approved, the refund will be processed to your original payment method</li>
                <li>You can track your refund status in your patient dashboard</li>
                `
                    : ""
                }
                <li>You can book a new appointment anytime through your dashboard</li>
              </ol>
            </div>
    
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p><strong>Need to Book Another Appointment?</strong></p>
              <p>You can easily schedule a new appointment through your patient dashboard or contact us directly.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/patient/${userId}/dashboard/appointments/book-appointment" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Book New Appointment
                </a>
              </div>
            </div>
      
            <p><strong>Have Questions?</strong></p>
            <p>If you have any questions about this cancellation or refund, please contact us:</p>
            <p>
              <strong>📞 Phone:</strong> <a href="tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}" style="color: #2563eb; text-decoration: none;">${process.env.NEXT_PUBLIC_COMPANY_PHONE}</a><br>
              <strong>📧 Email:</strong> <a href="mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL?.toLowerCase()}" style="color: #2563eb; text-decoration: none;">${process.env.NEXT_PUBLIC_COMPANY_EMAIL?.toLowerCase()}</a><br>
              <strong>🌐 Website:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #2563eb; text-decoration: none;">${process.env.NEXT_PUBLIC_COMPANY_NAME}</a>
            </p>
      
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 0.9em;">
              <p style="margin: 0; color: #92400e;">
                <strong>💡 Tip:</strong> To avoid cancellation fees in the future, please cancel at least 24 hours before your scheduled appointment time.
              </p>
            </div>
      
            <p>We're sorry we won't be seeing you on this occasion, but we look forward to serving you in the future.</p>
      
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Team at ${process.env.NEXT_PUBLIC_COMPANY_NAME}</strong>
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.85em; color: #6b7280;">
              <p style="margin: 5px 0;">
                ${process.env.NEXT_PUBLIC_COMPANY_NAME} | ${process.env.NEXT_PUBLIC_COMPANY_PHONE}
              </p>
              <p style="margin: 5px 0;">
                ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
              </p>
              <p style="margin: 15px 0 5px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Visit Website</a> |
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/patient/${userId}/dashboard" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Patient Dashboard</a> |
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Contact Us</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 0.8em; color: #9ca3af;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const { error } = await resend.emails.send(mailOptions);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Cancellation email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error sending cancellation email:", error);
    return NextResponse.json(
      { error: "Failed to send cancellation email" },
      { status: 500 }
    );
  }
}
