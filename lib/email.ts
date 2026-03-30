import nodemailer from "nodemailer";

import { env } from "@/lib/env";

/**
 * Description placeholder
 *
 * @type {*}
 */
const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        auth: {
          pass: env.SMTP_PASS,
          user: env.SMTP_USER,
        },
        host: env.SMTP_HOST,
        port: Number.parseInt(env.SMTP_PORT ?? "587"),
        secure: Number.parseInt(env.SMTP_PORT ?? "587") === 465,
      })
    : undefined;

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {{
 *   to: string;
 *   subject: string;
 *   html: string;
 * }} param0
 * @param {string} param0.to
 * @param {string} param0.subject
 * @param {string} param0.html
 * @returns {unknown}
 */
export async function sendEmail({
  html,
  subject,
  to,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!transporter) {
    return true;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM ?? env.EMAIL_FROM ?? "noreply@banking.app",
      html,
      subject,
      to,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {string} email
 * @param {string} name
 * @returns {unknown}
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
): Promise<boolean> {
  return await sendEmail({
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your account has been created successfully.</p>
      <p>You can now connect your bank accounts and start managing your finances.</p>
    `,
    subject: "Welcome to Banking App",
    to: email,
  });
}
