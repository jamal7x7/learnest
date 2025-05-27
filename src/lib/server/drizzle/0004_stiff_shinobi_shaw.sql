ALTER TABLE "team" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "type" text DEFAULT 'class' NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "member_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "max_members" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "invite_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_invite_code_unique" UNIQUE("invite_code");