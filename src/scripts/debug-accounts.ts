import { accountTable } from "~/db/schema";
import { db } from "../db";

async function main() {
  const accounts = await db.select().from(accountTable);
  console.log("Accounts table:");
  for (const acc of accounts) {
    console.log({
      id: acc.id,
      accountId: acc.accountId,
      providerId: acc.providerId,
      userId: acc.userId,
      password: acc.password,
      createdAt: acc.createdAt,
      updatedAt: acc.updatedAt,
    });
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
