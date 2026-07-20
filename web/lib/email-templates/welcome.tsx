import * as React from "react";

interface WelcomeEmailProps {
  recipientName: string;
  dashboardUrl: string;
  docsUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  recipientName,
  dashboardUrl,
  docsUrl,
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
            padding-bottom: 30px;
          }
          h1 {
            color: #0070f3;
            font-size: 32px;
            margin: 0 0 10px 0;
          }
          .subtitle {
            color: #666;
            font-size: 16px;
          }
          .feature {
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #0070f3;
          }
          .feature h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 18px;
          }
          .feature p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          .emoji {
            font-size: 24px;
            margin-right: 10px;
          }
          .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 10px 10px 0;
            font-weight: 500;
          }
          .button-secondary {
            background-color: #666;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Welcome aboard! 🎉</h1>
            <p className="subtitle">We're excited to have you on board</p>
          </div>

          <p>Hi {recipientName},</p>
          <p>
            Thanks for signing up! We can't wait to see what you'll build. Here's how to get
            started:
          </p>

          <div className="feature">
            <h3>
              <span className="emoji">📊</span>
              Explore your dashboard
            </h3>
            <p>
              View your usage metrics, monitor API performance, and track your integrations all in
              one place.
            </p>
          </div>

          <div className="feature">
            <h3>
              <span className="emoji">🔑</span>
              Generate API keys
            </h3>
            <p>
              Create development and production API keys to start building. Keep your keys secure
              and never share them publicly.
            </p>
          </div>

          <div className="feature">
            <h3>
              <span className="emoji">👥</span>
              Invite your team
            </h3>
            <p>
              Collaborate with your team by adding members to your organization. Assign roles and
              manage permissions.
            </p>
          </div>

          <div className="feature">
            <h3>
              <span className="emoji">🚀</span>
              Start integrating
            </h3>
            <p>
              Connect to popular services like GitHub, Gmail, and more. Build powerful integrations
              with just a few lines of code.
            </p>
          </div>

          <div className="cta-section">
            <a href={dashboardUrl} className="button">
              Go to Dashboard →
            </a>
            {docsUrl && (
              <a href={docsUrl} className="button button-secondary">
                Read Documentation
              </a>
            )}
          </div>

          <p style={{ fontSize: 14, color: "#666", marginTop: 30 }}>
            Need help getting started? Reply to this email or{" "}
            <a href="mailto:support@yourapp.com">contact support</a>. We're here to help!
          </p>
        </div>
      </body>
    </html>
  );
};

