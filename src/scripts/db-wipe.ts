
import { sql } from "drizzle-orm";


import { db } from "~/lib/server/db";

async function seed() {
  // Clean DB: truncate all tables in dependency order
  await db.execute(
      sql`dropdb learnest --if-exists createdb learnest`,


    // sql`TRUNCATE TABLE announcement_comments, announcement_recipients, announcement_user_status, team_invite_codes, announcements, team_members, teams, account, "user", session CASCADE`,
  );

  console.log("✅ Database wiped successfully!");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
