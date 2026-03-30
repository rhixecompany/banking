ALTER TABLE "banks" ADD COLUMN "account_number_encrypted" text;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "dwolla_customer_url" varchar(500);--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "dwolla_funding_source_url" varchar(500);--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "routing_number" varchar(20);--> statement-breakpoint
CREATE INDEX "banks_dwolla_customer_idx" ON "banks" USING btree ("dwolla_customer_url");