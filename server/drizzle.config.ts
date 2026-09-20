import { defineConfig } from "drizzle-kit";

// Migracje generujemy lokalnie przez drizzle-kit, ale aplikujemy je przez
// `wrangler d1 migrations apply` (patrz package.json) — to Wrangler, nie
// drizzle-kit, faktycznie rozmawia z D1 (lokalnym plikiem SQLite albo
// zdalnym API Cloudflare).
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
