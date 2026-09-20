import { z } from "zod";

export const Meal = z.object({
  id: z.uuidv7(),
  photoHash: z.hash("sha256"),
  dateIso: z.iso.datetime(),
  trigger: z.enum([
    "hunger",
    "routine",
    "stress",
    "craving",
    "boredom",
    "social",
  ]),
  mood: z.enum(["bad", "ok", "super"]),
  note: z.string().max(48).optional(),
});

export const MealLocal = Meal.extend({
  isPhotoSynced: z.boolean(),
  isMetaSynced: z.boolean(),
});

export type Meal = z.infer<typeof Meal>;

export type MealLocal = z.infer<typeof MealLocal>;
