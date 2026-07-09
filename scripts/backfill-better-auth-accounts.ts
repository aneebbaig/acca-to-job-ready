import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as appSchema from "../src/db/schema";
import * as authSchema from "../src/db/auth-schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: { ...appSchema, ...authSchema } });

async function main() {
  const users = await db
    .select({ id: appSchema.users.id, email: appSchema.users.email, passwordHash: appSchema.users.passwordHash })
    .from(appSchema.users);
  let created = 0;
  for (const u of users) {
    const existing = await db
      .select({ id: authSchema.accounts.id })
      .from(authSchema.accounts)
      .where(and(eq(authSchema.accounts.userId, u.id), eq(authSchema.accounts.providerId, "credential")));
    if (existing.length) continue;
    await db.insert(authSchema.accounts).values({
      id: `cred_${u.id}`,
      accountId: u.id,
      providerId: "credential",
      userId: u.id,
      password: u.passwordHash,
    });
    created++;
    console.log(`+ credential account for ${u.email}`);
  }
  console.log(`Done. ${created} created / ${users.length} users.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
