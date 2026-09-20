import { describe, vi, it, beforeEach, expect } from "vitest";
import { compressImage, getPhotoHash, validatePhoto } from "../utils/photos";
import type { MealRepository, PhotoStore } from "./ports";
import { Meal, MealLocal } from "shared";
import { MealService } from "./MealService";
import { v7 as uuidv7 } from "uuid";

vi.mock("../utils/photos", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/photos")>();
  return {
    ...actual,
    compressImage: vi.fn(),
    getPhotoHash: vi.fn(),
    validatePhoto: vi.fn(),
  };
});

describe("MealService", () => {
  let mealService: MealService;
  let photoStore: PhotoStore;
  let mealRepository: MealRepository;

  beforeEach(() => {
    mealRepository = createInMemoryMealRepository();
    photoStore = createInMemoryPhotoStore();
    mealService = new MealService(mealRepository, photoStore);

    vi.clearAllMocks();
    vi.mocked(validatePhoto).mockReturnValue({
      success: true,
    });
  });

  it(".saveMeal() Saves meal properly to fake repository and store", async () => {
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";

    const inputBlob = new Blob(inputPhotoBytes.split(""));

    vi.mocked(compressImage).mockReturnValue(Promise.resolve(inputBlob));
    vi.mocked(getPhotoHash).mockReturnValue(
      Promise.resolve(
        "399c796ecaf82ddf01f51e1f8e8333bfefade482872921b8b2d0d4f8077e06ce",
      ),
    );

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    const meals = await mealService.findMealsFromDateRange(date, date);

    expect(response.success).toBe(true);
    expect(meals).toHaveLength(1);
    expect(meals[0]).toMatchObject({
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    });

    const savedBlob = await photoStore.loadPhoto(meals[0].photoHash);
    const savedBlobArrayBuffer = await savedBlob.arrayBuffer();
    const inputBlobArrayBuffer = await inputBlob.arrayBuffer();

    const invalidBlobArrayBuffer = await new Blob(
      (inputPhotoBytes + "1").split(""),
    ).arrayBuffer();

    expect(new Uint8Array(savedBlobArrayBuffer)).toEqual(
      new Uint8Array(inputBlobArrayBuffer),
    );

    expect(new Uint8Array(savedBlobArrayBuffer)).not.toEqual(
      new Uint8Array(invalidBlobArrayBuffer),
    );
  });

  it(".saveMeal() Doesn't save meal data when saving image fails", async () => {
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    vi.mocked(compressImage).mockReturnValue(Promise.resolve(inputBlob));
    vi.mocked(getPhotoHash).mockReturnValue(
      Promise.resolve(
        "399c796ecaf82ddf01f51e1f8e8333bfefade482872921b8b2d0d4f8077e06ce",
      ),
    );
    mealRepository.save = vi.fn();
    photoStore.savePhoto = vi.fn().mockRejectedValue(new Error("opfs-error"));

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    const meals = await mealService.findMealsFromDateRange(date, date);

    expect(response.success).toBe(false);
    if (!response.success) expect(response.error).toBe("photo-save-failed");
    expect(mealRepository.save).not.toHaveBeenCalled();
    expect(meals).toEqual([]);
  });

  it(".saveMeal() Returns early when image is not valid", async () => {
    vi.mocked(validatePhoto).mockReturnValue({
      success: false,
      error: "empty-file",
    });
    mealRepository.save = vi.fn();
    photoStore.savePhoto = vi.fn();

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    expect(response.success).toBe(false);
    if (!response.success) expect(response.error).toBe("empty-file");
    expect(mealRepository.save).not.toHaveBeenCalled();
    expect(photoStore.savePhoto).not.toHaveBeenCalled();
    expect(compressImage).not.toHaveBeenCalled();
    expect(getPhotoHash).not.toHaveBeenCalled();
  });

  it(".saveMeal() Doesn't save anything when meal data is invalid", async () => {
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";

    const inputBlob = new Blob(inputPhotoBytes.split(""));
    vi.mocked(compressImage).mockReturnValue(Promise.resolve(inputBlob));
    vi.mocked(getPhotoHash).mockReturnValue(
      Promise.resolve(
        "399c796ecaf82ddf01f51e1f8e8333bfefade482872921b8b2d0d4f8077e06ce",
      ),
    );

    mealRepository.save = vi.fn();
    photoStore.savePhoto = vi.fn();

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString() + "xxxxx",
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    expect(response.success).toBe(false);
    if (!response.success) expect(response.error).toBe("invalid-meal-data");
    expect(mealRepository.save).not.toHaveBeenCalled();
    expect(photoStore.savePhoto).not.toHaveBeenCalled();
  });

  it(".saveMeal() Doesn't save anything when creating hash fails", async () => {
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";

    const inputBlob = new Blob(inputPhotoBytes.split(""));
    vi.mocked(compressImage).mockReturnValue(Promise.resolve(inputBlob));
    vi.mocked(getPhotoHash).mockRejectedValue(new Error("sha-256 error"));

    mealRepository.save = vi.fn();
    photoStore.savePhoto = vi.fn();

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    expect(response.success).toBe(false);
    if (!response.success)
      expect(response.error).toBe("creating-photo-hash-failed");
    expect(mealRepository.save).not.toHaveBeenCalled();
    expect(photoStore.savePhoto).not.toHaveBeenCalled();
  });

  it(".saveMeal() Doesn't save anything when compression fails", async () => {
    vi.mocked(compressImage).mockRejectedValue(
      new Error("Image could not be decoded"),
    );
    vi.mocked(getPhotoHash).mockReturnValue(
      Promise.resolve(
        "399c796ecaf82ddf01f51e1f8e8333bfefade482872921b8b2d0d4f8077e06ce",
      ),
    );

    mealRepository.save = vi.fn();
    photoStore.savePhoto = vi.fn();

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const file = new File(["23193n129eh2n18909"], "fileName", {
      type: "image/jpg",
    });
    const meta: Omit<Meal, "id" | "photoHash"> = {
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
    };

    const response = await mealService.saveMeal(meta, file);

    expect(response.success).toBe(false);
    if (!response.success) expect(response.error).toBe("compression-failed");
    expect(mealRepository.save).not.toHaveBeenCalled();
    expect(photoStore.savePhoto).not.toHaveBeenCalled();
  });

  it(".deleteMeal() Deletes meal properly from fake repository and store", async () => {
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const meta: MealLocal = {
      id: "e8219en912n9e7b1298eh7129",
      photoHash: "dwqand8wwa9dnwa9dh9wah08dw",
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    await mealRepository.save(meta);
    await photoStore.savePhoto(meta.photoHash, inputBlob);

    const response = await mealService.deleteMeal(meta.id, meta.photoHash);

    const meals = await mealService.findMealsFromDateRange(date, date);

    expect(response.success).toBe(true);
    expect(meals).toHaveLength(0);

    await expect(photoStore.loadPhoto(meta.photoHash)).rejects.toThrow();
  });

  it(".deleteMeal() Returns an error when deleting photo fails", async () => {
    photoStore.deletePhoto = vi.fn().mockRejectedValue(new Error("opfs-error"));

    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const meta: MealLocal = {
      id: "e8219en912n9e7b1298eh7129",
      photoHash: "dwqand8wwa9dnwa9dh9wah08dw",
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    await mealRepository.save(meta);
    await photoStore.savePhoto(meta.photoHash, inputBlob);

    const response = await mealService.deleteMeal(meta.id, meta.photoHash);

    expect(response.success).toBe(false);

    if (!response.success) expect(response.error).toBe("deleting-photo-failed");
    expect(await mealService.findMealsFromDateRange(date, date)).toHaveLength(
      0,
    );
  });

  it(".deleteMeal() Doesn't delete photo when deleting meal data fails", async () => {
    photoStore.deletePhoto = vi.fn();
    mealRepository.delete = vi
      .fn()
      .mockRejectedValue(new Error("indexedDB-error"));

    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    const date = new Date(2026, 9, 13, 13, 3, 59);

    const meta: MealLocal = {
      id: "e8219en912n9e7b1298eh7129",
      photoHash: "dwqand8wwa9dnwa9dh9wah08dw",
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    await mealRepository.save(meta);
    await photoStore.savePhoto(meta.photoHash, inputBlob);

    const response = await mealService.deleteMeal(meta.id, meta.photoHash);

    expect(response.success).toBe(false);

    if (!response.success)
      expect(response.error).toBe("deleting-metadata-failed");

    expect(photoStore.deletePhoto).not.toHaveBeenCalled();
  });

  it(".updateMeal() Updates meal properly", async () => {
    const date = new Date(2026, 9, 13, 13, 3, 59);
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    const meta: MealLocal = {
      id: uuidv7(),
      photoHash: await getPhotoHash(inputBlob),
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    await mealRepository.save(meta);

    const newMealData: MealLocal = {
      ...meta,
      mood: "super",
    };

    const response = await mealService.updateMeal(newMealData);

    const meals = await mealService.findMealsFromDateRange(date, date);

    expect(response.success).toBe(true);
    expect(meals).toHaveLength(1);
    expect(meals[0].mood).toBe("super");
  });

  it(".updateMeal() Returns error when meal data is invalid", async () => {
    const date = new Date(2026, 9, 13, 13, 3, 59);
    const inputPhotoBytes = "15a0f0ab8f18b74076ad51aa637590a7";
    const inputBlob = new Blob(inputPhotoBytes.split(""));

    const meta: MealLocal = {
      id: uuidv7(),
      photoHash: await getPhotoHash(inputBlob),
      dateIso: date.toISOString(),
      trigger: "boredom",
      mood: "ok",
      note: "note lalala",
      isMetaSynced: false,
      isPhotoSynced: false,
    };

    await mealRepository.save(meta);

    const newMealData: MealLocal = {
      ...meta,
      note: "supersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersupersuper",
    };

    const response = await mealService.updateMeal(newMealData);

    const meals = await mealService.findMealsFromDateRange(date, date);

    expect(response.success).toBe(false);
    if (!response.success) expect(response.error).toBe("invalid-meal-data");
    expect(meals[0].note).toBe("note lalala");
  });
});

function createInMemoryPhotoStore(): PhotoStore {
  const photos = new Map<string, Blob>();

  return {
    savePhoto: async (photoHash: string, blob: Blob) => {
      photos.set(photoHash, blob);
      return Promise.resolve();
    },
    loadPhoto: async (photoHash: string) => {
      const p = photos.get(photoHash);
      if (!p) throw new Error("not-found");
      return Promise.resolve(p);
    },
    deletePhoto: async (photoHash: string) => {
      const p = photos.get(photoHash);
      if (!p) throw new Error("not-found");
      photos.delete(photoHash);
      return Promise.resolve();
    },
  };
}

function createInMemoryMealRepository(): MealRepository {
  const meals = new Map<string, MealLocal>();

  return {
    save: (meal: MealLocal) => {
      meals.set(meal.id, meal);
      return Promise.resolve();
    },
    update: (meal: MealLocal) => {
      meals.set(meal.id, meal);
      return Promise.resolve();
    },
    findByDateRange: (start: string, end: string) => {
      const startTimeStamp = new Date(start).getTime();
      const endTimeStamp = new Date(end).getTime();

      const filtered: MealLocal[] = [];
      meals.forEach((m) => {
        const currentMealTimeStamp = new Date(m.dateIso).getTime();

        if (
          currentMealTimeStamp >= startTimeStamp &&
          currentMealTimeStamp <= endTimeStamp
        )
          filtered.push(m);
      });

      return Promise.resolve(filtered);
    },
    delete: (id: string) => {
      meals.delete(id);
      return Promise.resolve();
    },
  };
}
