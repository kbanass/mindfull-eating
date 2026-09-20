import type { EntityTable } from "dexie";
import type { MealRepository } from "./ports";
import type { MealLocal } from "shared";

export class DexieMealRepository implements MealRepository {
  private mealsTable: EntityTable<MealLocal, "id">;

  constructor(mealsTable: EntityTable<MealLocal, "id">) {
    this.mealsTable = mealsTable;
  }

  async save(meal: MealLocal) {
    await this.mealsTable.add(meal);
  }
  async update(meal: MealLocal) {
    await this.mealsTable.put(meal);
  }
  async findByDateRange(start: string, end: string) {
    return await this.mealsTable.where("dateIso").between(start, end).toArray();
  }
  async delete(id: string) {
    await this.mealsTable.delete(id);
  }
}
