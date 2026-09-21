import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// EXAMPLE of Drizzle syntax, not a real domain model.
// Design the actual tables yourself (e.g. meal entries with a photo,
// a feeling and a trigger) — that's a key architectural decision
// of this project, not boilerplate.
export const example = sqliteTable("example", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull(),
});
