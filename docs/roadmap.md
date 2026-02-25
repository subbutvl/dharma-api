# 🗺️ Dharma API Roadmap

This document defines the phased development plan.

The project follows a bi-weekly release cycle with 10–20 hours per week effort.

---

# 🚀 Phase 0 – Proof of Concept (Weekend Sprint)

Goal:

- End-to-end working API
- Basic React frontend consuming API

Scope:

- 1 Deity (Shiva)
- 1 Sloka
- 1 Temple
- Basic REST endpoints
- Local development only

Definition of Done:

- API runs locally
- React frontend fetches and displays data
- Supabase connected

---

# 🪔 Phase 1 – Core Deity API (Weeks 1–2)

Goal:

- Stable deity endpoint

Scope:

- /deities
- /deities/{slug}
- Basic fields:
  - name
  - description
  - aliases
  - affiliation
  - abode

Initial Dataset:

- Shiva
- Vishnu
- Devi

Definition of Done:

- Clean schema
- Proper JSON response
- Deity retrieval working

---

# 📿 Phase 2 – Slokas & Mantras (Weeks 3–4)

Goal:

- Structured sloka endpoints

Scope:

- /slokas
- /deities/{slug}/slokas

Fields:

- Sanskrit text
- Transliteration
- Meaning

Definition of Done:

- 2–3 slokas per deity
- Linked correctly to deity

---

# 🛕 Phase 3 – Temples (Weeks 5–6)

Goal:

- Temple support

Scope:

- /temples
- /deities/{slug}/temples

Fields:

- Name
- Location
- Significance

Definition of Done:

- At least 2 temples per deity
- Basic geolocation support

---

# 🧝 Phase 4 – Avatars / Forms (Weeks 7–8)

Goal:

- Avatar support

Scope:

- /avatars
- /deities/{slug}/avatars

Initial Focus:

- Vishnu Dashavatara
- Shiva forms

---

# 🎶 Phase 5 – Songs / Stotrams (Weeks 9–10)

Goal:

- Song metadata only

Scope:

- /songs

Note:
No copyrighted media hosted.

---

# 📅 Phase 6 – Festivals (Weeks 11–12)

Goal:

- Festival support

Scope:

- /festivals
- /deities/{slug}/festivals

---

# 🌍 Phase 7 – Multilingual Support (Weeks 13–14)

Goal:

- English + Tamil descriptions

---

# 🖼️ Phase 8 – Media Layer (Weeks 15–16)

Goal:

- Image support
- Supabase storage integration

---

# 🔍 Phase 9 – Search & Filtering (Weeks 17–18)

Goal:

- Query parameters
- Filtering
- Pagination

---

# 🧿 Phase 10 – Extended Mythology (Weeks 19–20)

Goal:

- Mythical beings
- Asuras
- Yakshas
- Nagas

---

# 🧘 Development Rules

- No rushing phases
- Ship small, usable increments
- Avoid over-engineering
- Keep API clean and predictable
- Maintain documentation

---

# 📌 Future Ideas (Optional)

- Panchang integration
- Daily sloka endpoint
- GraphQL layer
- Community contribution tools
- Admin dashboard
- Image tagging system

---
