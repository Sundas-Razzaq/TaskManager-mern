import nodemailer from "nodemailer";

export const passwordResetTemplate = ({ name, resetUrl }) => {
    return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 16px">Reset your password</h2>
      <p style="margin:0 0 16px">Hello ${name},</p>
      <p style="margin:0 0 16px">We received a request to reset your password. Use the button below to continue.</p>
      <p style="margin:24px 0">
        <a href="${resetUrl}" style="background:#111827;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block">Reset Password</a>
      </p>
      <p style="margin:0 0 16px">This link expires in 15 minutes.</p>
      <p style="margin:0;color:#6b7280;font-size:14px">If you did not request this, you can ignore this email.</p>
    </div>
  `;
};

const createTransport = () => {
    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = Number(process.env.EMAIL_PORT || 587);

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendEmail = async ({ to, subject, html, text }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials are not configured");
    }

    const transporter = createTransport();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
    });
};

export default sendEmail;