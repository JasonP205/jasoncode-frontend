import React from "react";

interface NotificationMailProps {
  name: string;
  email: string;
  message: string;
}

export default function NotificationMail({ name, email, message }: NotificationMailProps) {
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
            margin-bottom: 12px;
          }
          .detail-box {
            background-color: #f4f4f5;
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
          }
          .detail-item {
            margin-bottom: 16px;
          }
          .detail-item:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #888888;
            margin-bottom: 4px;
            display: block;
          }
          .detail-value {
            font-size: 16px;
            color: #111111;
            font-weight: 500;
          }
          .detail-message {
            font-size: 16px;
            color: #111111;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          @media (prefers-color-scheme: dark) {
            body { background-color: #000000; color: #ffffff; }
            .card { background-color: #0a0a0a; border-color: #222222; box-shadow: none; }
            p { color: #a3a3a3; }
            .detail-box { background-color: #111111; border: 1px solid #222222; }
            .detail-label { color: #666666; }
            .detail-value, .detail-message { color: #eaeaea; }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="card">
            <h1>Thông báo Hệ thống</h1>
            <p>
              Có một yêu cầu liên hệ mới vừa được gửi từ Website <strong>Jason Dev</strong>.
            </p>
            <p>Thông tin chi tiết bên dưới:</p>
            
            <div className="detail-box">
              <div className="detail-item">
                <span className="detail-label">Người gửi</span>
                <span className="detail-value">{name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email liên hệ</span>
                <span className="detail-value">
                  <a href={`mailto:${email}`} style={{ color: "inherit" }}>{email}</a>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nội dung thông điệp</span>
                <div className="detail-message">{message}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}