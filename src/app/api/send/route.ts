
import { EmailTemplate } from '@/components/emailTemplate/PasswordResetTemplate';
import { ReactNode } from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse JSON body explicitly
    const body = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'MedReserve <onboarding@resend.dev>',
      to: [body?.email],
      subject: 'Password Reset',
      react: EmailTemplate({ firstName: body?.name, argon:body?.argon, userId: body?.userId  }) as ReactNode,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({data, status:201});
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}