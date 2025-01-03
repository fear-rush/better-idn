ALTER TABLE "users" DROP CONSTRAINT "users_unique_name_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "unique_name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");