# Backlog

A detailed working list — unlike the README, small things can land here.
Not ordered by priority.

## PWA / offline

- Proper PNG icons at 192×192 and 512×512 (including one maskable) — SVG as the only
  icon source isn't supported everywhere when installing a PWA (there's already a TODO in `vite.config.ts`)
- Actually test offline mode (network disabled, installing on a phone)

## Server / sync

- `server/` is only a skeleton for now (`/health` + defined D1/R2 bindings, no logic)
- Endpoints for uploading metadata (D1) and photos (R2)
- Use `isMetaSynced`/`isPhotoSynced` from `MealLocal` for an actual sync queue
- Authentication (`Login.tsx` is currently an empty stub)

## Tabs

- `Profile.tsx` is currently an empty stub

## Tests

- `DexieMealRepository` via `fake-indexeddb` (the current integration tests mock the whole port)
- Tests for `compressImage` — requires an environment with DOM/Canvas (Vitest Browser Mode);
  the current `environment: "node"` in the test config doesn't support that

## Small things

- Fine-tune the `getDayMood` algorithm (currently: ≥2 bad meals = bad day) — to be
  verified in real use, whether the threshold reflects the actual feeling well
