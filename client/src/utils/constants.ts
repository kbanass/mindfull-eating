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
  hunger: "głód",
  routine: "rutyna",
  stress: "stres",
  craving: "zachcianka",
  boredom: "nuda",
  social: "towarzysko",
};

export const moodLabels: Record<Meal["mood"], string> = {
  bad: "źle",
  ok: "ok",
  super: "super",
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
