# mindfull-eating

Aplikacja PWA offline-first do rejestrowania wzorców żywieniowych: zdjęcie posiłku,
odczucie względem niego i trigger ("dlaczego jem"), z przeglądem miesięcznym.

## Struktura monorepo (npm workspaces)

```
client/            React + Vite + TypeScript, PWA (vite-plugin-pwa), Dexie (IndexedDB) + OPFS
server/            Cloudflare Workers + Hono, Drizzle ORM -> D1, upload zdjęć -> R2
packages/shared/   Schematy Zod i typy współdzielone między client i server
```

## Wymagania

- Node.js 22+
- Konto Cloudflare (Workers, D1, R2) — potrzebne do pracy nad `server/`

## Instalacja

```bash
npm install
```

## Rozwój

```bash
npm run dev:client   # Vite dev server (client/)
npm run dev:server   # wrangler dev (server/)
```

## Inne komendy

```bash
npm run lint         # ESLint na całym repo
npm run typecheck    # tsc --noEmit w każdym workspace
npm run build:client # build produkcyjny klienta
```

## Konfiguracja Cloudflare (jednorazowo)

```bash
cd server
npx wrangler d1 create mindful-eating-db       # wklej database_id do wrangler.jsonc
npx wrangler r2 bucket create mindful-eating-photos
npx wrangler d1 migrations apply mindful-eating-db --local
```
