import type { Meal } from "shared";

export const IMAGE_COMPRESSED = {
  MAX_SIZE: 1200,
  QUALITY: 0.7,
};

export const VALID_PHOTO = {
  MAX_FILE_BYTES: 20 * 1024 * 1024,
  ALLOWED_TYPES_PREFIX: "image/",
};

export const triggerLabels: Record<Meal["trigger"], string> = {
  hunger: "Hunger",
  routine: "Routine",
  stress: "Stress",
  craving: "Craving",
  boredom: "Boredom",
  social: "Social",
};

export const moodLabels: Record<Meal["mood"], string> = {
  bad: "Bad",
  ok: "Ok",
  super: "Super",
};

export const triggerEmojis: Record<Meal["trigger"], string> = {
  hunger: "🍽️",
  routine: "⏰",
  stress: "😫",
  craving: "🍕",
  boredom: "🥱",
  social: "👥",
};

export const moodEmojis: Record<Meal["mood"], string> = {
  super: "🥰",
  ok: "😃",
  bad: "🫤",
};

export const invalidImageMimeFormats: string[] = [
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
];
