import type { Meal, MealLocal } from "shared";
import { MealLocal as MealLocalZod } from "shared";
import type { MealRepository, PhotoStore } from "./ports";
import {
  compressImage,
  getPhotoHash,
  validatePhoto,
  type ValidatePhotoError,
} from "../utils/photos";
import { v7 as uuidv7 } from "uuid";
import { getDayEnd, getDayStart } from "../utils/date";

export class MealService {
  private mealRepository: MealRepository;
  private photoStore: PhotoStore;

  constructor(mealRepository: MealRepository, photoStore: PhotoStore) {
    this.mealRepository = mealRepository;
    this.photoStore = photoStore;
  }

  async saveMeal(
    mealData: Omit<Meal, "id" | "photoHash">,
    file: File,
  ): Promise<SaveMealResult> {
    const photoValidationResult = validatePhoto(file);
    if (!photoValidationResult.success) return photoValidationResult;

    let compressedImage;
    try {
      compressedImage = await compressImage(file);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "compression-failed",
      };
    }

    let photoHash;
    try {
      photoHash = await getPhotoHash(compressedImage);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "creating-photo-hash-failed",
      };
    }

    const mealEntry: MealLocal = {
      ...mealData,
      id: uuidv7(),
      photoHash: photoHash,
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    const parsedMealEntry = MealLocalZod.safeParse(mealEntry);
    if (!parsedMealEntry.success) {
      console.error(parsedMealEntry.error);
      return { success: false, error: "invalid-meal-data" };
    }

    try {
      await this.photoStore.savePhoto(
        parsedMealEntry.data.photoHash,
        compressedImage,
      );
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "photo-save-failed",
      };
    }

    try {
      await this.mealRepository.save(parsedMealEntry.data);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "metadata-save-failed",
      };
    }

    return {
      success: true,
      meal: parsedMealEntry.data,
    };
  }

  async findMealsFromDateRange(from: Date, to: Date): Promise<MealLocal[]> {
    const fromStart = getDayStart(from).toISOString();
    const toEnd = getDayEnd(to).toISOString();

    return await this.mealRepository.findByDateRange(fromStart, toEnd);
  }

  async loadPhoto(photoHash: string): Promise<Blob> {
    return await this.photoStore.loadPhoto(photoHash);
  }

  async deleteMeal(
    mealId: string,
    photoHash: string,
  ): Promise<DeleteMealResult> {
    try {
      await this.mealRepository.delete(mealId);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "deleting-metadata-failed",
      };
    }

    try {
      await this.photoStore.deletePhoto(photoHash);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "deleting-photo-failed",
      };
    }

    return {
      success: true,
    };
  }

  async updateMeal(newMealData: MealLocal): Promise<UpdateMealResult> {
    const parsedMealEntry = MealLocalZod.safeParse(newMealData);

    if (!parsedMealEntry.success)
      return {
        success: false,
        error: "invalid-meal-data",
      };
    try {
      await this.mealRepository.update(parsedMealEntry.data);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "metadata-save-failed",
      };
    }

    return {
      success: true,
      meal: parsedMealEntry.data,
    };
  }
}

type SaveMealResult =
  | { success: true; meal: MealLocal }
  | {
      success: false;
      error: SaveMealError | ValidatePhotoError;
    };

type SaveMealError =
  | "photo-save-failed"
  | "metadata-save-failed"
  | "compression-failed"
  | "creating-photo-hash-failed"
  | "invalid-meal-data";

type UpdateMealResult =
  | { success: true; meal: MealLocal }
  | {
      success: false;
      error: UpdateMealError;
    };

type UpdateMealError = "invalid-meal-data" | "metadata-save-failed";

type DeleteMealResult =
  | { success: true }
  | {
      success: false;
      error: DeleteMealError;
    };

type DeleteMealError = "deleting-metadata-failed" | "deleting-photo-failed";
