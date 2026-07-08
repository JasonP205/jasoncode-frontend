import "server-only";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import CustomerTemplate from "@/components/mail/CustomerTemplate";
import NotificationMail from "@/components/mail/NotificationMail";

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_EMAIL_HOST,
  port: Number(process.env.NEXT_EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NEXT_EMAIL_USER,
    pass: process.env.NEXT_EMAIL_PASS,
  },
});

type MailLocale = "vi" | "en";

const customerSubject: Record<MailLocale, string> = {
  vi: "Mình đã nhận được lời nhắn của bạn - Jason Dev",
  en: "I've received your message - Jason Dev",
};

export async function sendContactEmail(
  name: string,
  email: string,
  message: string,
  locale: MailLocale = "vi",
) {
  try {
    // Render the React component to an HTML string inside the Server Action.
    const customerHtml = await render(
      <CustomerTemplate name={name} locale={locale} />,
    );

    const notificationHtml = await render(
      <NotificationMail name={name} email={email} message={message} />,
    );

    const adminEmail = process.env.NEXT_RECEIVE_CONTACT_MAIL;

    // 1. Notify the admin (System -> Admin) — always in Vietnamese.
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Jason Dev - System" <system@hwagfu.dev>`,
        to: adminEmail,
        subject: `[Jason Dev] Liên hệ mới từ ${name}`,
        html: notificationHtml,
        replyTo: email,
      });
    }

    // 2. Confirm to the customer (No-Reply -> Customer) — in their locale.
    await transporter.sendMail({
      from: `"no-reply | Jason Dev" <info@hwagfu.dev>`,
      to: email,
      subject: customerSubject[locale],
      html: customerHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      success: false,
      error: "EMAIL_SEND_FAILED",
    };
  }
}
