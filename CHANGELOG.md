# 📜 Changelog

All notable changes to Dharma API will be documented in this file.

The format is inspired by Keep a Changelog:
https://keepachangelog.com/en/1.0.0/

---

## [Unreleased]

### Added

- Prisma schema for deities, slokas, temples, avatars, songs, festivals, mythical beings; migration `20250514103000_full_roadmap`.
- REST routes under `/api` and `/v1`: deities (list with `q`, `category`, `page`, `limit`), nested deity resources, slokas, temples, avatars, songs, festivals, mythical-beings.
- `prisma/seed.js` with Shiva, Vishnu, Devi, Ganesha sample data.
- Frontend `.env.example` with `VITE_API_BASE_URL`; Home uses API envelope and server-side search.

### Changed

- Deity data served from PostgreSQL via Prisma instead of static JSON.
- Unified JSON responses: `{ success, data, meta? }`.

### Fixed

- Deity detail fetch error handling and media tab; optional fields guarded in UI.

---

## [0.1.0] - Phase 0 (POC)

### Added

- Basic Express server
- Supabase connection
- One deity endpoint
- React frontend API fetch

---

## [0.2.0] - Phase 1 (Core Deities)

### Added

- /deities endpoint
- /deities/{slug}
- Basic deity schema

---

## Versioning Strategy

We will follow Semantic Versioning:

MAJOR.MINOR.PATCH

- MAJOR → Breaking changes
- MINOR → New features
- PATCH → Bug fixes

Example:
1.2.3
