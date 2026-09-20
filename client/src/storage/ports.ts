import type { MealLocal } from "shared";

export interface PhotoStore {
  savePhoto(photoHash: string, blob: Blob): Promise<void>;
  loadPhoto(photoHash: string): Promise<Blob>;
  deletePhoto(photoHash: string): Promise<void>;
}

export interface MealRepository {
  save(meal: MealLocal): Promise<void>;
  update(meal: MealLocal): Promise<void>;
  findByDateRange(start: string, end: string): Promise<MealLocal[]>;
  delete(id: string): Promise<void>;
}
