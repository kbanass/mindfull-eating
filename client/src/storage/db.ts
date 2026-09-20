import { Dexie, type EntityTable } from "dexie";
import type { MealLocal } from "shared";

export const db = new Dexie("mealsDataStore") as Dexie & {
  meals: EntityTable<MealLocal, "id">;
};

db.version(1).stores({
  meals: "id, dateIso",
});

export default db;
