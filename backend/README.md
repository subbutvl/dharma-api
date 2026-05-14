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
- dotenv
- cors

---

## 📂 Folder Structure

```
backend/
│
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── db/
│   └── app.js
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

## 🌐 Example Endpoints

Both `/api` and `/v1` prefixes are supported.

```
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
