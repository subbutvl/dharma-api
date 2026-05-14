require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./db/prisma");
const deityRoutes = require("./routes/deity.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🕉 Dharma API Running");
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (err) {
    res.status(503).json({
      ok: false,
      database: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

app.use("/api/deities", deityRoutes);

const PORT = Number(process.env.PORT) || 5000;

async function shutdown(signal) {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(signal === "SIGINT" || signal === "SIGTERM" ? 0 : 1);
  }
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "Missing DATABASE_URL. Copy .env.example to .env and set your Postgres URL.",
    );
    process.exit(1);
  }

  await prisma.$connect();
  console.log("Database connection established.");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
