CREATE TABLE "user_billing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"plan" text DEFAULT 'starter' NOT NULL,
	"spending_cap" integer,
	"alert_50_enabled" boolean DEFAULT true NOT NULL,
	"alert_75_enabled" boolean DEFAULT true NOT NULL,
	"alert_100_enabled" boolean DEFAULT true NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"has_payment_method" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_billing_settings_user_id_unique" UNIQUE("user_id")
);
