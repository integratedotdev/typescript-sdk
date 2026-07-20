import * as React from "react";

interface EmailVerificationProps {
  recipientName: string;
  verificationUrl: string;
}

export const EmailVerificationEmail: React.FC<EmailVerificationProps> = ({
  recipientName,
  verificationUrl,
}) => (
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
        h1 {
          color: #0070f3;
          font-size: 28px;
          margin: 0 0 20px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background-color: #0070f3;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #0051cc;
        }
        .link-section {
          margin: 30px 0;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 6px;
          font-size: 14px;
          word-break: break-all;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </head>
    <body>
      <div className="container">
        <h1>Verify Your Email Address</h1>
        <p>Hi {recipientName},</p>
        <p>
          Thanks for signing up for integrate.dev! To complete your registration and access your account, 
          please verify your email address by clicking the button below:
        </p>
        <div style={{ textAlign: 'center' }}>
          <a href={verificationUrl} className="button">
            Verify Email Address
          </a>
        </div>
        <p>
          This verification link will expire in 24 hours. If you did not create an account with us, 
          please ignore this email.
        </p>
        <div className="link-section">
          <strong>Having trouble with the button?</strong>
          <br />
          Copy and paste this link into your browser:
          <br />
          <a href={verificationUrl}>{verificationUrl}</a>
        </div>
        <div className="footer">
          <p>
            If you have any questions or need help, please contact us at{" "}
            <a href="mailto:support@integrate.dev">support@integrate.dev</a>
          </p>
          <p style={{ marginTop: 10 }}>
            Thanks,
            <br />
            The integrate.dev Team
          </p>
        </div>
      </div>
    </body>
  </html>
);

