import { MealService } from "./MealService";
import { DexieMealRepository } from "./DexieMealRepository";
import { db } from "./db";
import { PhotoStoreClient } from "./PhotoStoreClient";

export const mealService = new MealService(
  new DexieMealRepository(db.meals),
  PhotoStoreClient,
);
