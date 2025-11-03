import nodemailer from 'nodemailer';

function buildTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: Number(EMAIL_PORT || 587),
    secure: false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
}

export async function sendEmail({ to, subject, html }) {
  const transporter = buildTransporter();
  if (!transporter) return false;
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  return true;
}


