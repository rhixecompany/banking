CREATE TABLE "dwolla_transfers" (
	"id" text PRIMARY KEY NOT NULL,
	"dwolla_transfer_id" text,
	"transfer_url" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"status" varchar(50),
	"source_funding_source_url" text,
	"destination_funding_source_url" text,
	"sender_wallet_id" text,
	"receiver_wallet_id" text,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dwolla_transfers" ADD CONSTRAINT "dwolla_transfers_sender_wallet_id_wallets_id_fk" FOREIGN KEY ("sender_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dwolla_transfers" ADD CONSTRAINT "dwolla_transfers_receiver_wallet_id_wallets_id_fk" FOREIGN KEY ("receiver_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dwolla_transfers" ADD CONSTRAINT "dwolla_transfers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dwolla_transfers_user_id_idx" ON "dwolla_transfers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "dwolla_transfers_status_idx" ON "dwolla_transfers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "dwolla_transfers_created_at_idx" ON "dwolla_transfers" USING btree ("created_at");