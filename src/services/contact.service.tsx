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

export async function sendContactEmail(
  name: string,
  email: string,
  message: string,
) {
  try {
    // Để render Component React thành chuỗi HTML trong Server Action mà không cần đổi đuôi file sang .tsx
    // Chúng ta truyền component dưới dạng function call thay vì JSX tag.
    const customerHtml = await render(<CustomerTemplate name={name} />);

    const notificationHtml = await render(
      <NotificationMail name={name} email={email} message={message} />,
    );

    const adminEmail = process.env.NEXT_RECEIVE_CONTACT_MAIL;

    // 1. Gửi thông báo đến Admin (System -> Admin)
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Jason Dev - System" <system@hwagfu.dev>`,
        to: adminEmail,
        subject: `[Jason Dev] Liên hệ mới từ ${name}`,
        html: notificationHtml,
        replyTo: email, // Set Reply-To về email khách hàng để dễ tiện reply lại khách trực tiếp
      });
    }

    // 2. Gửi xác nhận cho Khách hàng (No-Reply -> Khách hàng)
    await transporter.sendMail({
      from: `"no-reply | Jason Dev" <info@hwagfu.dev>`,
      to: email,
      subject: "Mình đã nhận được lời nhắn của bạn - Jason Dev",
      html: customerHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      success: false,
      error: "Hệ thống email đang bận, vui lòng thử lại sau.",
    };
  }
}
