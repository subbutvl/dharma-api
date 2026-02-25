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

Inside backend folder:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
```

---

### 3️⃣ Start development server

```bash
npm run dev
```

or

```bash
node src/app.js
```

---

## 🌐 Example Endpoints

```
GET /v1/deities
GET /v1/deities/:slug
GET /v1/slokas
GET /v1/temples
```

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
