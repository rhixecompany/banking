CREATE TABLE "errors" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"stack" text,
	"path" varchar(500),
	"user_id" text,
	"severity" varchar(20) DEFAULT 'error',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "errors" ADD CONSTRAINT "errors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "errors_created_at_idx" ON "errors" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "errors_user_id_idx" ON "errors" USING btree ("user_id");