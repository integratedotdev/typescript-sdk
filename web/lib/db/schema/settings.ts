import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, unique } from "drizzle-orm/pg-core";

// User account-level settings (pricing is per account, not per org)
export const userBillingSettings = pgTable("user_billing_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  
  // Pricing plan
  plan: text("plan").notNull().default("starter"), // starter, grow, enterprise
  
  // Spending limits and alerts
  spendingCap: integer("spending_cap"), // in cents
  alert50Enabled: boolean("alert_50_enabled").default(true).notNull(),
  alert75Enabled: boolean("alert_75_enabled").default(true).notNull(),
  alert100Enabled: boolean("alert_100_enabled").default(true).notNull(),
  
  // Billing info (references to Stripe or other payment processor)
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Payment method
  hasPaymentMethod: boolean("has_payment_method").default(false).notNull(),
  
  // Notification emails for spending alerts (JSON array of email addresses with enabled status)
  // Format: { "email@example.com": true, "other@example.com": false }
  notificationEmails: jsonb("notification_emails"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Track which spending alerts have been sent to avoid duplicate notifications
export const spendingAlertsSent = pgTable("spending_alerts_sent", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  organizationId: text("organization_id"),
  threshold: integer("threshold").notNull(), // percentage threshold (e.g., 50, 75, 100)
  sentAt: timestamp("sent_at").notNull().$defaultFn(() => new Date()),
  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
});

// Triggers for scheduled automation
export const trigger = pgTable("trigger", {
  id: text("id").primaryKey(), // "trig_abc123" format
  userId: text("user_id").notNull(),
  organizationId: text("organization_id"),
  
  // Trigger configuration
  toolName: text("tool_name").notNull(),
  toolArguments: jsonb("tool_arguments").notNull(),
  provider: text("provider").notNull(), // "gmail", "github", etc.
  
  // Schedule (JSON with type: "cron"|"once", expression/runAt)
  schedule: jsonb("schedule").notNull().$type<{
    type: "cron" | "once";
    expression?: string; // for cron
    runAt?: string;      // ISO 8601 for once
  }>(),
  
  // Status tracking
  status: text("status").notNull().default("active"), // active, paused, completed, failed
  
  // Execution history
  lastExecutedAt: timestamp("last_executed_at"),
  lastResult: jsonb("last_result"),
  lastError: text("last_error"),
  lastDuration: integer("last_duration"), // in ms
  
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

// Step definitions for multi-step triggers
export const triggerStep = pgTable("trigger_step", {
  id: text("id").primaryKey(), // "step_<timestamp>_<random>" format
  triggerId: text("trigger_id").notNull().references(() => trigger.id, { onDelete: "cascade" }),
  stepIndex: integer("step_index").notNull(), // 0-based
  toolName: text("tool_name").notNull(),
  toolArguments: jsonb("tool_arguments").notNull().default({}),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
}, (table) => [
  unique("trigger_step_unique").on(table.triggerId, table.stepIndex),
]);

// Webhook endpoints per trigger
export const triggerWebhook = pgTable("trigger_webhook", {
  id: text("id").primaryKey(), // "whk_<timestamp>_<random>" format
  triggerId: text("trigger_id").notNull().references(() => trigger.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  secret: text("secret"),
  headers: jsonb("headers").default({}),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

// Execution history for triggers
export const triggerExecution = pgTable("trigger_execution", {
  id: text("id").primaryKey(), // "exec_<timestamp>_<random>" format
  triggerId: text("trigger_id").notNull().references(() => trigger.id, { onDelete: "cascade" }),
  success: boolean("success").notNull(),
  steps: jsonb("steps").notNull().default([]), // StepResult[]
  totalSteps: integer("total_steps").notNull(),
  totalDuration: integer("total_duration").notNull(), // in ms
  executedAt: timestamp("executed_at").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

// App URL configuration per organization (used as callbackUrl for trigger notifications)
export const organizationAppConfig = pgTable("organization_app_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id").notNull().unique(),
  devUrl: text("dev_url"),   // e.g., http://localhost:3000
  prodUrl: text("prod_url"), // e.g., https://myapp.com
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

