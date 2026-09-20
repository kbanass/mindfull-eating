import type { Meal, MealLocal } from "shared";

export type MealEditorProps =
  | (Pick<Meal, "dateIso"> & { imageFile: File })
  | (MealLocal & { imageBlob: Blob })
  | undefined;
