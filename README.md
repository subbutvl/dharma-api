# Dharma API

Free, open-source **REST API** plus a **React (Vite)** browser app for structured Hindu mythology data: deities, slokas, temples, avatars, songs, festivals, and mythical beings. Data lives in **PostgreSQL** via **Prisma**; contracts are documented in **OpenAPI 3**.

The project is built in **public phases** (see table below). Source: [`docs/roadmap.md`](docs/roadmap.md).

---

## Documentation

| Guide                                          | Contents                                                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **[`backend/README.md`](backend/README.md)**   | API server, env vars, Prisma/migrate/seed, OpenAPI & Swagger URLs, admin CSV, route list                       |
| **[`frontend/README.md`](frontend/README.md)** | UI setup, `VITE_API_BASE_URL`, routes, how the app calls the API, data model summary, in-scope vs out-of-scope |
| **[`docs/roadmap.md`](docs/roadmap.md)**       | Original phase goals, scope, and definitions of done                                                           |

Start here for **end-to-end local run**, then use the backend and frontend guides for detail.

---

## Quick start (local)

1. **Backend** — copy `backend/.env.example` → `backend/.env`, set `DATABASE_URL` and `DIRECT_URL`, then:

   ```bash
   cd backend && npm install && npx prisma migrate deploy && npm run db:seed && npm run dev
   ```

2. **Frontend** — copy `frontend/.env.example` → `frontend/.env`, set `VITE_API_BASE_URL=http://localhost:5000/api`, then:

   ```bash
   cd frontend && npm install && npm run dev
   ```

3. Open **http://localhost:5173** (UI) and **http://localhost:5000/api-docs** (Swagger).

---

## Phase roadmap — status

Statuses reflect the **current repository** (not future promises). Wording follows [`docs/roadmap.md`](docs/roadmap.md).

| Phase  | Name                        | Status      | Notes                                                                                                                                      |
| ------ | --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **0**  | Proof of Concept            | **Done**    | API + DB + frontend path proven                                                                                                            |
| **1**  | Core Deity API              | **Done**    | `GET /api/deities`, `GET /api/deities/:slug`, Prisma `Deity`                                                                               |
| **2**  | Slokas & mantras            | **Done**    | `GET /api/slokas`, merged on deity detail; Sanskrit / transliteration / meaning                                                            |
| **3**  | Temples                     | **Done**    | `GET /api/temples`, merged on deity detail; extended fields (Tamil name, city, lore, logistics, gallery JSON, lat/lon); `deityId` optional |
| **4**  | Avatars / forms             | **Done**    | `GET /api/avatars`, linked to deities                                                                                                      |
| **5**  | Songs / stotrams (metadata) | **Done**    | `GET /api/songs`; external URLs only (no hosted audio)                                                                                     |
| **6**  | Festivals                   | **Done**    | `GET /api/festivals`, deity–festival links                                                                                                 |
| **7**  | Multilingual                | **Partial** | `descriptionEn` / `descriptionTa` on deities, Tamil temple names, etc.; not a full i18n layer across every string                          |
| **8**  | Media layer                 | **Partial** | `primaryImageUrl`, `imageGalleryUrls` as URLs; optional `SUPABASE_STORAGE_BUCKET`; no mandatory object storage                             |
| **9**  | Search & filtering          | **Partial** | Deity list: `q`, `category`, `page`, `limit`; mythical beings: `kind`; not unified full-text across all resources                          |
| **10** | Extended mythology          | **Done**    | `GET /api/mythical-beings` and by slug                                                                                                     |

**Planned / not started as first-class API features** (see roadmap “Future ideas”): GraphQL, Panchang, daily-sloka endpoint, rate limits, API keys, etc.

---

## Repository layout

```
dharma-api/
├── backend/           # Express, Prisma, OpenAPI, admin UI, seed
├── frontend/          # Vite + React + Tailwind SPA
├── docs/              # Roadmap and planning
├── CHANGELOG.md
└── README.md          # This file
```

---

## Tech stack (summary)

| Layer | Stack                                        |
| ----- | -------------------------------------------- |
| API   | Node.js, Express 5, Prisma, PostgreSQL       |
| Docs  | OpenAPI 3, Swagger UI (`/api-docs`)          |
| UI    | React 19, Vite 7, Tailwind 4, React Router 7 |

---

## Vision

Developer-friendly, respectful open data for websites, education, research, and devotional tools—released in small increments. Non-commercial intent; see disclaimer below.

---

## License & contributions

**License:** MIT (planned / confirm in repo when finalized).

**Contributions:** welcome after the base API stabilizes; open issues/PRs as the project matures.

---

## Disclaimer

Built with cultural respect; prefer public-domain or properly attributed sources. Accuracy and authenticity improvements are welcome.
