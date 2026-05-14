require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");

const prisma = require("./db/prisma");
const deityRoutes = require("./routes/deity.routes");
const slokaRoutes = require("./routes/sloka.routes");
const templeRoutes = require("./routes/temple.routes");
const avatarRoutes = require("./routes/avatar.routes");
const songRoutes = require("./routes/song.routes");
const festivalRoutes = require("./routes/festival.routes");
const mythicalRoutes = require("./routes/mythical.routes");
const adminRoutes = require("./routes/admin.routes");
const { buildDashboardHtml } = require("./utils/dashboardHtml");
const { buildAdminHtml } = require("./utils/adminHtml");

const app = express();

const samplesDir = path.join(__dirname, "..", "docs", "samples");
app.use("/admin/samples", express.static(samplesDir));

app.use(cors());
app.use(express.json());

const openApiPath = path.join(__dirname, "..", "docs", "openapi.yaml");
let openApiSpec = null;
try {
  openApiSpec = yaml.load(fs.readFileSync(openApiPath, "utf8"));
} catch (e) {
  console.warn("OpenAPI spec not loaded:", e.message);
}

if (openApiSpec) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
    }),
  );
  app.get("/openapi.json", (_req, res) => {
    res.json(openApiSpec);
  });
}

app.get("/", (_req, res) => {
  res.type("html").send(buildDashboardHtml(openApiSpec));
});

app.get("/admin", (_req, res) => {
  res.type("html").send(buildAdminHtml());
});

app.use("/api/admin", adminRoutes);

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

app.get(["/api/meta", "/v1/meta"], (_req, res) => {
  res.json({
    success: true,
    data: {
      storageBucket: process.env.SUPABASE_STORAGE_BUCKET || null,
    },
  });
});

app.use("/api/deities", deityRoutes);
app.use("/api/slokas", slokaRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/festivals", festivalRoutes);
app.use("/api/mythical-beings", mythicalRoutes);

app.use("/v1/deities", deityRoutes);
app.use("/v1/slokas", slokaRoutes);
app.use("/v1/temples", templeRoutes);
app.use("/v1/avatars", avatarRoutes);
app.use("/v1/songs", songRoutes);
app.use("/v1/festivals", festivalRoutes);
app.use("/v1/mythical-beings", mythicalRoutes);

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
    console.log(`Dashboard: http://localhost:${PORT}/`);
    console.log(`Data admin: http://localhost:${PORT}/admin`);
    if (openApiSpec) {
      console.log(`API docs (Swagger UI): http://localhost:${PORT}/api-docs`);
      console.log(`OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
    }
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
