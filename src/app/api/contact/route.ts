import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'World of Stone <noreply@worldofstone.co.za>';
const TO = process.env.RESEND_TO_EMAIL ?? 'info@worldofstone.co.za';

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, phone, email, subject, message } = body;

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email?.trim() || undefined,
      subject: `[World of Stone] ${subject ?? 'New Inquiry'} — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
          <h2 style="color: #c9a84c; margin-bottom: 4px;">New Contact Form Submission</h2>
          <p style="color: #888; font-size: 13px; margin-top: 0;">World of Stone Website</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #888; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 6px 0; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #888; vertical-align: top;">Phone</td>
              <td style="padding: 6px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #888; vertical-align: top;">Email</td>
              <td style="padding: 6px 0;">${email || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #888; vertical-align: top;">Subject</td>
              <td style="padding: 6px 0;">${subject}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
          <p style="font-size: 13px; color: #888; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
          <p style="font-size: 12px; color: #aaa;">Sent via worldofstone.co.za contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 });
  }
}
