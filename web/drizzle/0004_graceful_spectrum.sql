ALTER TABLE "api_key" RENAME TO "apiKey";--> statement-breakpoint
ALTER TABLE "apiKey" DROP CONSTRAINT "api_key_key_unique";--> statement-breakpoint
ALTER TABLE "apiKey" DROP CONSTRAINT "api_key_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "apiKey" DROP CONSTRAINT "api_key_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_key_unique" UNIQUE("key");