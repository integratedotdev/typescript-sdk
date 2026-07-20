import * as React from "react";

interface OrganizationInviteEmailProps {
  recipientName: string;
  organizationName: string;
  inviterName: string;
  inviteUrl: string;
  role: string;
}

export const OrganizationInviteEmail: React.FC<OrganizationInviteEmailProps> = ({
  recipientName,
  organizationName,
  inviterName,
  inviteUrl,
  role,
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
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          h1 {
            color: #0070f3;
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px 0;
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
          .url-fallback {
            word-break: break-all;
            color: #666;
            font-size: 14px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 4px;
            margin: 15px 0;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
            font-size: 14px;
          }
          .highlight {
            color: #0070f3;
            font-weight: 600;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>🎉 You're Invited!</h1>
          </div>
          <div className="content">
            <p>Hi {recipientName || "there"},</p>
            <p>
              <span className="highlight">{inviterName}</span> has invited you to join{" "}
              <span className="highlight">{organizationName}</span> as a{" "}
              <span className="highlight">{role}</span>.
            </p>
            <p>Click the button below to accept the invitation and get started:</p>
            <div style={{ textAlign: "center" }}>
              <a href={inviteUrl} className="button">
                Accept Invitation →
              </a>
            </div>
            <p>Or copy and paste this URL into your browser:</p>
            <div className="url-fallback">{inviteUrl}</div>
            <p style={{ color: "#666", fontSize: "14px" }}>
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
          <div className="footer">
            <p>⏰ This invitation will expire in 7 days</p>
          </div>
        </div>
      </body>
    </html>
  );
};

