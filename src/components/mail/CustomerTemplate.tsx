import React from "react";

interface CustomerTemplateProps {
  name: string;
}

export default function CustomerTemplate({ name }: CustomerTemplateProps) {
  return (
    <html lang="vi">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          :root {
            color-scheme: light dark;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            color: #111111;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .card {
            border: 1px solid #eaeaea;
            border-radius: 20px;
            padding: 40px;
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          h1 {
            font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
            font-size: 26px;
            margin-bottom: 24px;
            font-weight: 400;
            line-height: 1.3;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 16px;
            line-height: 1.7;
            color: #444444;
            margin-bottom: 20px;
          }
          .italic-muted {
            font-style: italic;
            color: #6F6F6F;
          }
          .footer {
            font-size: 13px;
            color: #888888;
            margin-top: 32px;
            text-align: center;
          }
          @media (prefers-color-scheme: dark) {
            body { background-color: #000000; color: #ffffff; }
            .card { background-color: #0a0a0a; border-color: #222222; box-shadow: none; }
            p { color: #a3a3a3; }
            .italic-muted { color: #888888; }
            .footer { color: #555555; }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="card">
            <h1>
              Xin chào, <span className="italic-muted">{name}</span>
            </h1>
            <p>
              Cảm ơn bạn đã để lại lời nhắn. Mình đã nhận được thông tin liên hệ của bạn tại <strong>Jason Dev</strong>.
            </p>
            <p>
              Hệ thống đã tự động lưu lại yêu cầu này. Mình sẽ xem xét thông tin và trực tiếp phản hồi lại qua email của bạn trong thời gian sớm nhất nhé (thường là trong vòng 24 giờ làm việc).
            </p>
            <p>
              Chúc bạn một ngày làm việc hiệu quả và nhiều niềm vui!
            </p>
            <p style={{ marginTop: "40px" }}>
              Trân trọng,<br />
              <strong>Phan Hoàng Phúc (Jason Dev)</strong>
            </p>
          </div>
          <div className="footer">
            Email này được tạo tự động bởi hệ thống của hwagfu.dev. Vui lòng không phản hồi (reply) vào địa chỉ email này.
          </div>
        </div>
      </body>
    </html>
  );
}