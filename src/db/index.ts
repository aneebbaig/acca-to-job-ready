import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as appSchema from "./schema";
import * as authSchema from "./auth-schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.",
  );
}

// Merge the app schema and the better-auth tables so the drizzle adapter and
// app queries share one client.
export const schema = { ...appSchema, ...authSchema };

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
