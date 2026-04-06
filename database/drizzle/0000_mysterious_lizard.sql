CREATE TYPE "public"."transaction_channel" AS ENUM('online', 'in_store', 'other');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'moderator');--> statement-breakpoint
CREATE TABLE "account" (
	"access_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" integer,
	"id_token" text,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"scope" text,
	"session_state" text,
	"token_type" text,
	"type" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"counter" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialID" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"transports" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "errors" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"path" varchar(500),
	"severity" varchar(20) DEFAULT 'error',
	"stack" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"bank_account_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires" timestamp NOT NULL,
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"amount" numeric(12, 2) NOT NULL,
	"category" varchar(255),
	"channel" "transaction_channel",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"deleted_at" timestamp,
	"email" varchar(255),
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"plaid_transaction_id" varchar(255),
	"receiver_wallet_id" text,
	"sender_wallet_id" text,
	"status" "transaction_status" DEFAULT 'pending',
	"type" "transaction_type",
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"address" varchar(255),
	"city" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"date_of_birth" varchar(20),
	"id" text PRIMARY KEY NOT NULL,
	"phone" varchar(20),
	"postal_code" varchar(20),
	"ssn_encrypted" text,
	"state" varchar(50),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"id" text PRIMARY KEY NOT NULL,
	"image" varchar(255),
	"is_active" boolean DEFAULT true,
	"is_admin" boolean DEFAULT false,
	"name" varchar(255),
	"password" varchar(255),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires" timestamp NOT NULL,
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"access_token" text NOT NULL,
	"account_id" varchar(255),
	"account_number_encrypted" text,
	"account_subtype" varchar(100),
	"account_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"customer_url" varchar(500),
	"deleted_at" timestamp,
	"funding_source_url" text,
	"id" text PRIMARY KEY NOT NULL,
	"institution_id" varchar(255),
	"institution_name" varchar(255),
	"routing_number" varchar(20),
	"sharable_id" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "wallets_sharable_id_unique" UNIQUE("sharable_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "errors" ADD CONSTRAINT "errors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_bank_account_id_wallets_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_wallet_id_wallets_id_fk" FOREIGN KEY ("receiver_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_wallet_id_wallets_id_fk" FOREIGN KEY ("sender_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "authenticator_user_id_idx" ON "authenticator" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "errors_created_at_idx" ON "errors" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "errors_user_id_idx" ON "errors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "errors_severity_idx" ON "errors" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "recipients_user_id_idx" ON "recipients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipients_email_idx" ON "recipients" USING btree ("email");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_sender_wallet_idx" ON "transactions" USING btree ("sender_wallet_id");--> statement-breakpoint
CREATE INDEX "transactions_receiver_wallet_idx" ON "transactions" USING btree ("receiver_wallet_id");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "transactions_deleted_at_idx" ON "transactions" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_plaid_id_idx" ON "transactions" USING btree ("plaid_transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_profiles_user_id_unique" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "verification_token_identifier_idx" ON "verificationToken" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "wallets_user_id_idx" ON "wallets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wallets_sharable_id_idx" ON "wallets" USING btree ("sharable_id");--> statement-breakpoint
CREATE INDEX "wallets_customer_url_idx" ON "wallets" USING btree ("customer_url");--> statement-breakpoint
CREATE INDEX "wallets_funding_source_url_idx" ON "wallets" USING btree ("funding_source_url");--> statement-breakpoint
CREATE INDEX "wallets_deleted_at_idx" ON "wallets" USING btree ("deleted_at");