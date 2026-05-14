# Dharma API — Frontend

React (Vite) + Tailwind app for browsing **deities**, **slokas**, **temples**, **avatars**, **songs**, **festivals**, and **mythical beings** against the Dharma API backend. It doubles as a **manual integration tester** for JSON shapes and navigation patterns (card grids, tabbed detail, temple section tabs).

This package lives beside `backend/` in the same repository. Run the API before the UI.

**Other docs:** [Repository README](../README.md) (overview + **phase status table**) · [Backend README](../backend/README.md) (API server, Swagger, admin, Prisma scripts)

---

## Repository layout

| Path                           | Role                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| `backend/`                     | Express API, Prisma + PostgreSQL, OpenAPI spec, admin HTML, seed |
| `frontend/`                    | This app — Vite, React Router, Tailwind                          |
| `backend/docs/openapi.yaml`    | Machine-readable API contract                                    |
| `backend/prisma/schema.prisma` | Source of truth for tables and relations                         |

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **PostgreSQL** (local or hosted, e.g. Supabase)
- **npm** (ships with Node)

---

## 1. Backend: install and run

From the **repository root** or `backend/`:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

- **`DATABASE_URL`** — app runtime connection (pooler URL is OK for Prisma Client).
- **`DIRECT_URL`** — direct Postgres URL for migrations (`prisma migrate` / `db push`). Required when using a pooler on `DATABASE_URL`.
- **`PORT`** — optional; default **5000**.

Apply schema and seed sample data:

```bash
cd backend
npm install
npx prisma migrate deploy
npm run db:seed
```

For a fresh dev DB you may use `npx prisma migrate dev` instead of `deploy`. If the DB already has data and migration history is missing, follow your team’s baseline process (see Prisma docs for `migrate resolve`).

Start the API:

```bash
npm run dev
```

Health check: `GET http://localhost:5000/health/db`

---

## 2. Frontend: install and run

```bash
cd frontend
cp .env.example .env
```

**Required:** `VITE_API_BASE_URL` must point at the API **including the `/api` prefix** (the client prepends this base to paths like `/deities`).

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Install and start Vite:

```bash
npm install
npm run dev
```

Default UI: **http://localhost:5173**

Production build:

```bash
npm run build
npm run preview
```

---

## 3. How this app uses the API

- **`src/lib/api.js`** — `getApiBase()` reads `VITE_API_BASE_URL`; `fetchJson(path)` calls `${base}${path}` and unwraps `{ success, data, meta }` errors.
- **Routes** (`src/App.jsx`):
  - `/` → redirect to `/deities`
  - `/deities` — deity grid (`Home` + `DeityCard`)
  - `/deities/:slug` — deity profile with image column and tabs (overview, worship, temples, etc.)
  - `/mythical-beings/:slug` — mythical being detail
  - `/:kind` — explore lists for `slokas`, `temples`, `avatars`, `songs`, `festivals`, `mythical-beings` (`ExploreList` + card grid)
  - `/:resource/:param` — detail for UUID/slug resources (`RecordDetail`), e.g. `/temples/<id>`, `/slokas/<id>`
- **Temple UI** — `TempleTabbedDetail` groups fields into tabs: Overview, Lore & tradition, Timings & festivals, Plan your visit, Gallery & map (see `src/components/TempleFields.jsx`).

If the UI shows “`VITE_API_BASE_URL` is not set”, create `frontend/.env` from `.env.example`.

---

## 4. API overview

### Base URL and versioning

- Public JSON is served under **`/api/...`**.
- The same routes are mirrored under **`/v1/...`** (same handlers). OpenAPI examples use `/api`; substitute `/v1` if you prefer.

### Response envelope

Typical success:

```json
{ "success": true, "data": ... }
```

Paginated list (deities):

```json
{ "success": true, "data": [...], "meta": { "page", "limit", "total" } }
```

Errors:

```json
{ "success": false, "message": "...", "code": "..." }
```

### Documented endpoints (high level)

| Area      | Method | Path (after `/api`)     | Notes                                                                        |
| --------- | ------ | ----------------------- | ---------------------------------------------------------------------------- |
| Meta      | GET    | `/meta`                 | Optional public config                                                       |
| Health    | GET    | `/health/db`            | DB connectivity (root server, not under `/api` in all setups — check server) |
| Deities   | GET    | `/deities`              | Query: `q`, `category`, `page`, `limit`                                      |
| Deities   | GET    | `/deities/:slug`        | Full deity; merges DB **slokas** and **temples** into `worship`              |
| Deities   | GET    | `/deities/:slug/slokas` | Slokas for one deity                                                         |
| Slokas    | GET    | `/slokas`               | List + embedded `deity` summary                                              |
| Temples   | GET    | `/temples`              | List + optional `deity`                                                      |
| Avatars   | GET    | `/avatars`              | List + `deity`                                                               |
| Songs     | GET    | `/songs`                | List + optional `deity`                                                      |
| Festivals | GET    | `/festivals`            | List; may include `deityLinks` with nested `deity` when enabled in route     |
| Mythical  | GET    | `/mythical-beings`      | Query: `kind` optional                                                       |
| Admin     | POST   | `/admin/*`              | CSV/import and mutations — separate auth token; not used by this frontend    |

**Interactive docs:** with the server running, open **`http://localhost:5000/api-docs`** (Swagger UI) when `openapi.yaml` loads successfully. Raw JSON: **`http://localhost:5000/openapi.json`**.

**HTML dashboards:** `GET http://localhost:5000/` (API landing), `GET http://localhost:5000/admin` (admin UI).

---

## 5. What the API covers vs. does not

### Covers

- **Read-heavy** catalogue: deities, slokas, temples, avatars, songs, festivals, mythical beings.
- **Deity detail** merges relational **Sloka** and **Temple** rows into the public `worship` object (see `deitySerializer`).
- **Temple** rich text fields (overview, sthala puranam, logistics, gallery URLs, coordinates).
- **Admin** bulk/single create via `/api/admin` (out of scope for the default frontend).

### Does not cover (by design / not implemented here)

- **End-user auth** on public GET routes (no JWT/session for browsing).
- **GraphQL** — REST only.
- **Per-temple GET by ID** on the server — the frontend loads **`GET /temples`** and picks one row by `id` (same pattern for some other resources). Adding `GET /temples/:id` would be a backend enhancement.
- **Real-time** or WebSockets.
- **File uploads** from this React app (images are URLs / admin pipeline).
- **i18n** in the UI (API carries some Tamil/English fields; UI is mostly English labels).

---

## 6. Data model (Prisma / PostgreSQL)

Defined in **`backend/prisma/schema.prisma`**. Migrations live under **`backend/prisma/migrations/`**.

### `Deity`

- **Identity:** `id` (UUID), `slug` (unique), `name`.
- **Content:** `title`, `description`, `descriptionEn`, `descriptionTa`, `category`, `aliases[]`, `affiliation`, `abode`, `primaryImageUrl`.
- **Structured JSON:** `attributes`, `relationships`, `worship`, `media` (legacy / denormalized story data can live here; slokas/temples are also loaded from tables for detail).

**Relations:** `slokas`, `temples`, `avatars`, `songs`, `deityFestivals`.

### `Sloka`

- **Required:** `deityId` → `Deity`.
- **Fields:** `title`, `sanskrit`, `transliteration`, `meaning`.

### `Temple`

- **Optional:** `deityId` → `Deity` (temple can exist unlinked).
- **Names / place:** `nameEnglish`, `nameTamil`, `city`.
- **Long text:** `overview`, `sthalaPuranam`, `literaryBackground`, `puranaBackground`, `deitiesText`, `poojaTimings`, `festivalsEvents`, `specialities`, `howToReach`, `contactInfo`.
- **Media / geo:** `imageGalleryUrls` (JSON array of URL strings recommended), `latitude`, `longitude`.

**Indexes:** `deityId`, `city`.

### `Avatar`

- **Required:** `deityId`.
- **Fields:** `name`, `description`, `tradition`.

### `Song`

- **Optional:** `deityId` (nullable).
- **Fields:** `title`, `credit`, `externalUrl`, `licenseNote`.

### `Festival` and `DeityFestival`

- **Festival:** `slug`, `name`, `description`.
- **DeityFestival:** composite PK `(deityId, festivalId)` — many-to-many between deities and festivals.

### `MythicalBeing`

- **Fields:** `slug`, `name`, `kind`, `description`, `lore` (JSON).

---

## 7. How to use the tables (practical rules)

1. **Slokas** must reference a valid **`deityId`**. Deleting a deity cascades to its slokas.
2. **Temples** may omit **`deityId`** (standalone shrine rows). If set, deleting the deity cascades linked temples.
3. **Avatars** always require a **`deityId`**.
4. **Songs** may omit **`deityId`**; if the deity is deleted, `deityId` is set null (`SetNull`).
5. **`imageGalleryUrls`** — store a JSON **array of strings** (HTTPS image URLs). The frontend’s temple “Gallery & map” tab expects string URLs.
6. **Public deity JSON** maps temples with backward-compatible names: `name` / `location` / `significance` mirror `nameEnglish` / `city` / `overview`, plus extended fields and **`id`** for linking to `/temples/:id` in the UI.

**Seeding:** `cd backend && npm run db:seed` repopulates demo rows (see `backend/prisma/seed.js`). Destructive to existing seed data patterns — use only on dev databases.

---

## 8. Frontend project structure

```
frontend/
├── src/
│   ├── App.jsx                 # Routes
│   ├── main.jsx
│   ├── lib/api.js            # Base URL + fetchJson
│   ├── config/explore.js     # List fetch + card mapping per section
│   ├── layouts/MainLayout.jsx
│   ├── components/
│   │   ├── DeityCard.jsx
│   │   ├── ExploreResourceCard.jsx
│   │   └── TempleFields.jsx  # TempleTabbedDetail, TempleSummaryCard
│   └── pages/
│       ├── Home.jsx
│       ├── DeityDetail.jsx
│       ├── ExploreList.jsx
│       ├── RecordDetail.jsx
│       └── MythicalDetail.jsx
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 9. Linting

```bash
cd frontend
npm run lint
```

---

## 10. Further reading

| Topic                     | Location                               |
| ------------------------- | -------------------------------------- |
| OpenAPI paths and schemas | `backend/docs/openapi.yaml`            |
| Public deity shape        | `backend/src/utils/deitySerializer.js` |
| API routes                | `backend/src/routes/*.routes.js`       |
| Env template (API)        | `backend/.env.example`                 |

If backend port or path prefix ever changes, update **`VITE_API_BASE_URL`** accordingly (must end with `/api` as currently used by this client).
