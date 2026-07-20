import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

// Usage tracking table
export const usageRecords = pgTable("usage_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  organizationId: text("organization_id"),
  apiKeyId: text("api_key_id"),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(), // in milliseconds
  requestSize: integer("request_size"), // in bytes
  responseSize: integer("response_size"), // in bytes
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

// Organization usage summary (for quick stats)
export const organizationUsage = pgTable("organization_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id").notNull().unique(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  totalRequests: integer("total_requests").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(), // in hundredths of cents (divide by 10000 to get dollars)
  successfulRequests: integer("successful_requests").default(0).notNull(),
  failedRequests: integer("failed_requests").default(0).notNull(),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

// User onboarding status
export const userOnboarding = pgTable("user_onboarding", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  onboardingStep: integer("onboarding_step").default(0).notNull(),
  companyName: text("company_name"),
  useCase: text("use_case"),
  teamSize: text("team_size"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

