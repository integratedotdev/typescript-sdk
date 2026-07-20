import * as React from "react";

interface UsageAlertEmailProps {
  recipientName: string;
  organizationName: string;
  percentage: number;
  currentSpending: number; // in cents
  spendingCap: number; // in cents
  currentRequests: number;
  dashboardUrl: string;
}

export const UsageAlertEmail: React.FC<UsageAlertEmailProps> = ({
  recipientName,
  organizationName,
  percentage,
  currentSpending,
  spendingCap,
  currentRequests,
  dashboardUrl,
}) => {
  const isOverLimit = percentage >= 100;
  const isWarning = percentage >= 90;
  
  // Convert cents to dollars for display
  const currentSpendingDollars = (currentSpending / 100).toFixed(2);
  const spendingCapDollars = (spendingCap / 100).toFixed(2);
  const remainingDollars = Math.max(0, (spendingCap - currentSpending) / 100).toFixed(2);

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
          .alert {
            background-color: ${isOverLimit ? "#fee" : isWarning ? "#fff3cd" : "#d1ecf1"};
            border-left: 4px solid ${isOverLimit ? "#dc3545" : isWarning ? "#ffc107" : "#17a2b8"};
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .alert-title {
            font-size: 18px;
            font-weight: 600;
            color: ${isOverLimit ? "#721c24" : isWarning ? "#856404" : "#0c5460"};
            margin: 0 0 10px 0;
          }
          .usage-stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 6px;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #0070f3;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-top: 5px;
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
          .progress-bar {
            width: 100%;
            height: 24px;
            background-color: #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            margin: 15px 0;
          }
          .progress-fill {
            height: 100%;
            background-color: ${isOverLimit ? "#dc3545" : isWarning ? "#ffc107" : "#28a745"};
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: 600;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1 style={{ color: "#333", fontSize: "26px" }}>
            {isOverLimit ? "⚠️ Usage Limit Reached" : "📊 Usage Alert"}
          </h1>
          <p>Hi {recipientName},</p>
          
          <div className="alert">
            <div className="alert-title">
              {isOverLimit
                ? `${organizationName} has reached the spending limit`
                : `${organizationName} is approaching the spending limit`}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }}>
                {percentage}%
              </div>
            </div>
            <p style={{ margin: "15px 0 0 0", fontSize: "14px" }}>
              You've spent <strong>${currentSpendingDollars}</strong> out of your{" "}
              <strong>${spendingCapDollars}</strong> monthly spending cap.
            </p>
            <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
              Total requests this month: <strong>{currentRequests.toLocaleString()}</strong>
            </p>
          </div>

          <div className="usage-stats">
            <div className="stat">
              <div className="stat-value">${currentSpendingDollars}</div>
              <div className="stat-label">Current Spending</div>
            </div>
            <div className="stat">
              <div className="stat-value">${spendingCapDollars}</div>
              <div className="stat-label">Spending Cap</div>
            </div>
            <div className="stat">
              <div className="stat-value">${remainingDollars}</div>
              <div className="stat-label">Remaining Budget</div>
            </div>
          </div>

          <p>
            {isOverLimit
              ? "Your usage has been paused. "
              : "You're approaching your limit. "}
            Consider upgrading your plan to continue using the service without interruption.
          </p>

          <div style={{ textAlign: "center" }}>
            <a href={dashboardUrl} className="button">
              View Dashboard →
            </a>
          </div>

          <p style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
            Need help? <a href="mailto:support@integrate.dev">Contact our support team</a>
          </p>
        </div>
      </body>
    </html>
  );
};

