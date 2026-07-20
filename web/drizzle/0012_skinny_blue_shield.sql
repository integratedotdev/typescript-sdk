CREATE TABLE "spending_alerts_sent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text,
	"threshold" integer NOT NULL,
	"sent_at" timestamp NOT NULL,
	"billing_period_start" timestamp NOT NULL,
	"billing_period_end" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_billing_settings" ADD COLUMN "notification_emails" jsonb;