import type { MealLocal, Meal } from "shared";

const EMPTY_TRIGGER_COUNTS: Record<Meal["trigger"], number> = {
  hunger: 0,
  routine: 0,
  stress: 0,
  craving: 0,
  boredom: 0,
  social: 0,
};

export function getTriggerProcentages(
  meals: Array<MealLocal[]> | undefined,
): Record<Meal["trigger"], number> {
  if (!meals) return { ...EMPTY_TRIGGER_COUNTS };

  const counts = meals.flat().reduce(
    (acc, meal) => {
      acc[meal.trigger] += 1;
      return acc;
    },
    {
      ...EMPTY_TRIGGER_COUNTS,
    },
  );

  const triggers = Object.keys(counts) as Array<Meal["trigger"]>;
  const total = triggers.reduce((sum, t) => sum + counts[t], 0);

  if (total === 0) return { ...EMPTY_TRIGGER_COUNTS };

  const raw = triggers.map((t) => (counts[t] / total) * 100);
  const floors = raw.map(Math.floor);
  const remainder = 100 - floors.reduce((a, b) => a + b, 0);

  const byRemainder = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  const percentages = [...floors];
  for (let k = 0; k < remainder; k++) {
    percentages[byRemainder[k].i] += 1;
  }

  return Object.fromEntries(
    triggers.map((t, i) => [t, percentages[i]]),
  ) as Record<Meal["trigger"], number>;
}
