import bcrypt from "bcryptjs";
import { accountTable } from "~/db/schema";
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
  const hash = account.password;
  const testPassword = "password123";
  if (hash == null) {
    console.error("Account password hash is null for:", accountId);
    process.exit(1);
  }
  const match = bcrypt.compareSync(testPassword, hash);
  console.log({
    accountId,
    hash,
    testPassword,
    match,
  });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
