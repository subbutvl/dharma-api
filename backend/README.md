# 🛠 Dharma API – Backend

This is the backend REST API for Dharma API.

It is responsible for:

- Serving deity data
- Serving slokas, temples, avatars, festivals
- Connecting to Supabase (PostgreSQL)
- Exposing REST endpoints

---

## 🧱 Tech Stack

- Node.js
- Express
- Supabase (PostgreSQL)
- Prisma ORM
- OpenAPI 3 + Swagger UI (`swagger-ui-express`, `js-yaml`)
- dotenv
- cors

---

## 📂 Folder Structure

```
backend/
│
├── docs/
│   └── openapi.yaml   # OpenAPI 3 spec (source for Swagger UI)
├── prisma/
├── src/
│   ├── routes/
│   ├── db/
│   ├── utils/
│   └── server.js
│
├── package.json
├── .env
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Create `.env` file

```
DATABASE_URL=   # Supabase pooler (transaction, port 6543)
DIRECT_URL=     # Session pooler or direct host for migrations (port 5432)
PORT=5000
# Optional: SUPABASE_STORAGE_BUCKET=  (Phase 8 media)
```

Run migrations and seed:

```bash
npm run db:migrate:deploy
npm run db:seed
```

If `migrate deploy` errors with **P3005** (schema already exists from a prior `db push`), run `npm run db:push` to align tables, then `npx prisma migrate resolve --applied 20250514103000_full_roadmap`, then `npm run db:seed`.

---

### 3️⃣ Start development server

```bash
npm run dev
```

or

```bash
node src/server.js
```

---

## API documentation (OpenAPI / Swagger)

The machine-readable contract lives in **[docs/openapi.yaml](docs/openapi.yaml)** (OpenAPI 3).

After `npm run dev` or `npm start`:

| URL                                                                      | Purpose                                                                                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [http://localhost:5000/](http://localhost:5000/)                         | **Dashboard** — Swagger in a **new tab**; OpenAPI JSON and **GET route previews** (click a path) in the **700px side panel**; health & meta in **readable dialogs** |
| [http://localhost:5000/api-docs](http://localhost:5000/api-docs)         | **Swagger UI** (interactive docs)                                                                                                                                   |
| [http://localhost:5000/openapi.json](http://localhost:5000/openapi.json) | Same spec as JSON (import into Postman, etc.)                                                                                                                       |
| [http://localhost:5000/health/db](http://localhost:5000/health/db)       | Database health JSON                                                                                                                                                |
| [http://localhost:5000/api/meta](http://localhost:5000/api/meta)         | Runtime meta JSON                                                                                                                                                   |

**Maintenance:** When you add or change routes under `src/routes/` or `server.js`, update `docs/openapi.yaml` in the same PR so docs stay accurate. The `/api` paths are canonical; `/v1` is an alias (not duplicated in the YAML).

---

## 🌐 Example Endpoints

Both `/api` and `/v1` prefixes are supported.

```
GET /
GET /api/deities?q=shiva&category=deva&page=1&limit=20
GET /api/deities/:slug
GET /api/deities/:slug/slokas
GET /api/deities/:slug/temples
GET /api/deities/:slug/avatars
GET /api/deities/:slug/festivals
GET /api/slokas
GET /api/temples
GET /api/avatars
GET /api/songs
GET /api/festivals
GET /api/mythical-beings
GET /api/mythical-beings/:slug
GET /api/meta
GET /api-docs
GET /openapi.json
GET /health/db
```

Responses use `{ "success": true, "data": ..., "meta": { ... } }` where applicable.

---

## 🎯 Development Philosophy

- Clean REST structure
- Small incremental phases
- No over-engineering
- Versioned endpoints (`/v1`)

---

## 📦 Future Improvements

- Pagination
- Filtering
- Rate limiting
- API keys
- Logging middleware
- Validation layer

---

## 🧘 Notes

This backend is intentionally simple in early phases.
Complex optimizations will only be introduced when necessary.

---
