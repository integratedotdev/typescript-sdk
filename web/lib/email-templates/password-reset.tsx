import * as React from "react";

interface PasswordResetEmailProps {
  recipientName: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  recipientName,
  resetUrl,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1 style={{ color: "#333", fontSize: "26px" }}>Reset Your Password</h1>
          <p>Hi {recipientName},</p>
          
          <p>
            We received a request to reset the password for your integrate.dev account.
            Click the button below to create a new password:
          </p>

          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a href={resetUrl} className="button">
              Reset Password
            </a>
          </div>

          <div className="warning">
            <p style={{ margin: "0 0 10px 0", fontWeight: "600" }}>
              Important Security Information:
            </p>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>This link will expire in 1 hour</li>
              <li>The link can only be used once</li>
              <li>If you didn't request this reset, you can safely ignore this email</li>
            </ul>
          </div>

          <p style={{ fontSize: "14px", color: "#666" }}>
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style={{ fontSize: "12px", color: "#0070f3", wordBreak: "break-all" }}>
            {resetUrl}
          </p>

          <div className="footer">
            <p>
              If you didn't request a password reset, please contact support immediately at{" "}
              <a href="mailto:support@integrate.dev">support@integrate.dev</a>
            </p>
            <p style={{ marginTop: "10px" }}>
              This is an automated email from integrate.dev. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
