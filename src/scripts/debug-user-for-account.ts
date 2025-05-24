import { accountTable, userTable } from "~/db/schema";
import { db } from "../db";

async function main() {
  const accountId = "teacher1@example.com";
  const account = await db.query.accountTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.accountId, accountId), eq(fields.providerId, "email")),
  });
  if (!account) {
    console.log("No account found for:", accountId);
    process.exit(0);
  }
  const user = await db.query.userTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, account.userId),
  });
  console.log("Account:", account);
  console.log("User:", user);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
