CREATE TABLE "banks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"access_token" text NOT NULL,
	"funding_source_url" text,
	"sharable_id" varchar(255) NOT NULL,
	"institution_id" varchar(255),
	"institution_name" varchar(255),
	"account_id" varchar(255),
	"account_type" varchar(50),
	"account_subtype" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "banks_sharable_id_unique" UNIQUE("sharable_id")
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"bank_account_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"sender_bank_id" integer,
	"receiver_bank_id" integer,
	"name" varchar(255),
	"email" varchar(255),
	"amount" varchar(50) NOT NULL,
	"type" varchar(50),
	"status" varchar(50) DEFAULT 'pending',
	"channel" varchar(50),
	"category" varchar(255),
	"plaid_transaction_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"address" varchar(255),
	"city" varchar(100),
	"state" varchar(50),
	"postal_code" varchar(20),
	"phone" varchar(20),
	"date_of_birth" varchar(20),
	"ssn" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255),
	"image" varchar(255),
	"is_admin" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_bank_account_id_banks_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_bank_id_banks_id_fk" FOREIGN KEY ("sender_bank_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_bank_id_banks_id_fk" FOREIGN KEY ("receiver_bank_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "banks_user_id_idx" ON "banks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "banks_sharable_id_idx" ON "banks" USING btree ("sharable_id");--> statement-breakpoint
CREATE INDEX "recipients_user_id_idx" ON "recipients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_sender_bank_idx" ON "transactions" USING btree ("sender_bank_id");--> statement-breakpoint
CREATE INDEX "transactions_receiver_bank_idx" ON "transactions" USING btree ("receiver_bank_id");