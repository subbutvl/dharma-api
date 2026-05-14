# Dharma API — Backend

Express **REST** API with **Prisma** and **PostgreSQL**. Serves deities, slokas, temples, avatars, songs, festivals, and mythical beings under **`/api`** (mirrored under **`/v1`**). Ships with **OpenAPI 3**, **Swagger UI**, an **HTML admin** for CSV/forms, and a **seed** script for local demos.

**Related docs:** [Repository README](../README.md) · [Frontend README](../frontend/README.md) · [Roadmap](../docs/roadmap.md)

---

## Tech stack

- Node.js, Express 5, `cors`, `dotenv`
- Prisma ORM + PostgreSQL (`DATABASE_URL`, `DIRECT_URL`)
- OpenAPI 3 (`docs/openapi.yaml`) + `swagger-ui-express` + `js-yaml`
- `multer` + `csv-parse` for admin CSV imports

---

## Folder structure

```
backend/
├── docs/
│   ├── openapi.yaml      # OpenAPI spec (Swagger + /openapi.json)
│   └── samples/          # Sample CSVs; also served at /admin/samples/
├── prisma/
│   ├── schema.prisma     # Models & relations
│   ├── seed.js           # Demo data (destructive re-seed on dev DB)
│   └── migrations/
├── src/
│   ├── server.js         # App entry, mounts routes
│   ├── routes/           # deity, sloka, temple, avatar, song, festival, mythical, admin
│   ├── db/prisma.js
│   └── utils/            # apiResponse, serializers, HTML builders
├── package.json
├── .env.example
└── README.md
```

---

## Environment variables

Copy **`.env.example`** → **`.env`**.

| Variable                  | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL`            | Prisma Client (pooler URL is OK at runtime)                                          |
| `DIRECT_URL`              | Direct Postgres URL for **migrations** (required when `DATABASE_URL` uses PgBouncer) |
| `PORT`                    | HTTP port (default **5000**)                                                         |
| `ADMIN_TOKEN`             | Optional; if set, admin writes require header `x-admin-token`                        |
| `SUPABASE_STORAGE_BUCKET` | Optional; reserved for future media (Phase 8)                                        |

---

## Install, migrate, seed, run

```bash
cd backend
npm install
```

Apply migrations (production-style):

```bash
npx prisma migrate deploy
npm run db:seed
```

**Local dev** creating a new migration:

```bash
npx prisma migrate dev
```

**If `migrate deploy` fails with P3005** (database has tables but no migration history): align with your team’s baseline (e.g. `prisma migrate resolve` for the initial migration, then deploy). Alternatively use `prisma db push` only on throwaway DBs.

**Run the server:**

```bash
npm run dev
```

Requires `DATABASE_URL` set; server connects with Prisma on startup.

---

## Useful URLs (default `PORT=5000`)

| URL                                                                      | Purpose                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| [http://localhost:5000/](http://localhost:5000/)                         | API dashboard (links to Swagger, OpenAPI JSON, admin, health) |
| [http://localhost:5000/admin](http://localhost:5000/admin)               | Data admin — forms + CSV import per entity                    |
| [http://localhost:5000/api-docs](http://localhost:5000/api-docs)         | **Swagger UI**                                                |
| [http://localhost:5000/openapi.json](http://localhost:5000/openapi.json) | OpenAPI as JSON (Postman, etc.)                               |
| [http://localhost:5000/health/db](http://localhost:5000/health/db)       | Database connectivity                                         |
| [http://localhost:5000/api/meta](http://localhost:5000/api/meta)         | Small public meta payload                                     |

**Canonical paths** in the spec are under **`/api/...`**. **`/v1/...`** uses the same handlers.

---

## NPM scripts

| Script                      | Command                                                           |
| --------------------------- | ----------------------------------------------------------------- |
| `npm run dev`               | `nodemon src/server.js`                                           |
| `npm start`                 | `node src/server.js`                                              |
| `npm run db:generate`       | `prisma generate`                                                 |
| `npm run db:push`           | `prisma db push` (schema sync without migration files — dev only) |
| `npm run db:migrate`        | `prisma migrate dev`                                              |
| `npm run db:migrate:deploy` | `prisma migrate deploy`                                           |
| `npm run db:seed`           | `prisma db seed` → `node prisma/seed.js`                          |

---

## Example HTTP routes

Both **`/api`** and **`/v1`** prefixes work.

```
GET  /health/db
GET  /api/meta
GET  /api/deities?q=shiva&category=deva&page=1&limit=20
GET  /api/deities/:slug
GET  /api/deities/:slug/slokas
GET  /api/slokas
GET  /api/temples
GET  /api/avatars
GET  /api/songs
GET  /api/festivals
GET  /api/mythical-beings
GET  /api/mythical-beings/:slug
POST /api/admin/...          # JSON + CSV import (see admin.routes.js)
```

Success responses typically use `{ "success": true, "data": ... }` and optionally `"meta"` for pagination.

---

## Data model (Prisma)

Source of truth: **`prisma/schema.prisma`**.

| Model                        | Role                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Deity`                      | Core entity; JSON fields `attributes`, `relationships`, `worship`, `media`; list/detail serializers     |
| `Sloka`                      | Belongs to `Deity`; Sanskrit, transliteration, meaning                                                  |
| `Temple`                     | Optional `Deity`; English/Tamil names, `city`, long text fields, `imageGalleryUrls` (JSON), coordinates |
| `Avatar`                     | Belongs to `Deity`                                                                                      |
| `Song`                       | Optional `deity`; metadata + `externalUrl`                                                              |
| `Festival` + `DeityFestival` | Many-to-many with deities                                                                               |
| `MythicalBeing`              | Standalone lore entries (`kind`, `lore` JSON)                                                           |

Deleting a **Deity** cascades to slokas, temples (if linked), avatars, festival links; **Songs** use `SetNull` on `deityId`.

---

## Admin (CSV + forms)

- **UI:** `/admin` — single-row forms and CSV upload per resource.
- **API:** `POST /api/admin/<resource>` and `POST /api/admin/<resource>/import` (multipart `file`). See `src/routes/admin.routes.js`.
- **Samples:** `docs/samples/*.sample.csv` — downloadable from `/admin/samples/<filename>`.
- **Auth:** If `ADMIN_TOKEN` is set, send `x-admin-token: <value>` on writes. `GET /api/admin/status` returns `{ tokenRequired: boolean }`.

---

## OpenAPI maintenance

When you add or change public routes under `src/routes/` or `server.js`, update **`docs/openapi.yaml`** in the same change so Swagger stays accurate.

---

## What’s intentionally simple

Early priorities: predictable JSON, small surface area, and honest phase delivery. Heavy features (rate limiting, API keys, global search, GraphQL) stay roadmap items until needed.

For **how the React app consumes these endpoints** and **what is / isn’t covered** from a product perspective, see **[`../frontend/README.md`](../frontend/README.md)**.
