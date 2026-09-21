import { defineConfig } from "drizzle-kit";

// Migrations are generated locally by drizzle-kit, but applied through
// `wrangler d1 migrations apply` (see package.json) — it's Wrangler, not
// drizzle-kit, that actually talks to D1 (a local SQLite file or the
// remote Cloudflare API).
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
