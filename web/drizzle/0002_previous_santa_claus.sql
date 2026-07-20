ALTER TABLE "api_key" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "api_key" ADD COLUMN "environment" text DEFAULT 'dev' NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;