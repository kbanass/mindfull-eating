import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// PRZYKŁAD składni Drizzle, nie prawdziwy model domeny.
// Zaprojektuj sam właściwe tabele (np. wpisy posiłków ze zdjęciem,
// odczuciem i triggerem) — to jest kluczowa decyzja architektoniczna
// tego projektu, nie boilerplate.
export const example = sqliteTable("example", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull(),
});
