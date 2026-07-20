CREATE TABLE "trigger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text,
	"tool_name" text NOT NULL,
	"tool_arguments" jsonb NOT NULL,
	"provider" text NOT NULL,
	"schedule" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_executed_at" timestamp,
	"last_result" jsonb,
	"last_error" text,
	"last_duration" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
