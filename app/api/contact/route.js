import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Require SMTP config before attempting send
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured — set SMTP_USER and SMTP_PASS in .env.local');
      return NextResponse.json(
        { error: 'SMTP not configured on server' },
        { status: 503 }
      );
    }

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:    `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to:      process.env.SMTP_TO || process.env.SMTP_USER,
      subject: `[UPLINK] ${subject}`,
      text:    `From: ${name} (${email})\n\n${message}`,
      html: `
        <div style="font-family:monospace;background:#020810;color:#e8f4f8;padding:24px;border:1px solid rgba(0,200,255,0.3);">
          <h2 style="color:#00c8ff;letter-spacing:0.2em;margin-bottom:16px;">⟩ NEW TRANSMISSION</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="color:#4a7a8a;padding:4px 12px 4px 0;font-size:0.8rem;">FROM</td><td style="color:#e8f4f8;">${name}</td></tr>
            <tr><td style="color:#4a7a8a;padding:4px 12px 4px 0;font-size:0.8rem;">EMAIL</td><td style="color:#00c8ff;">${email}</td></tr>
            <tr><td style="color:#4a7a8a;padding:4px 12px 4px 0;font-size:0.8rem;">SUBJECT</td><td style="color:#e8f4f8;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(0,200,255,0.2);margin:16px 0;" />
          <p style="color:#e8f4f8;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
