import { env } from "@/lib/env";
import nodemailer from "nodemailer";

const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || "587"),
        secure: parseInt(env.SMTP_PORT || "587") === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    console.log("[Email] Would send to:", to, "Subject:", subject);
    return true;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || env.EMAIL_FROM || "noreply@banking.app",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Send error:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Banking App",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your account has been created successfully.</p>
      <p>You can now connect your bank accounts and start managing your finances.</p>
    `,
  });
}
