const express = require("express");
const prisma = require("../db/prisma");
const { ok, fail } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { kind } = req.query;
    const where =
      kind && String(kind).trim() ? { kind: String(kind).toLowerCase() } : {};
    const rows = await prisma.mythicalBeing.findMany({
      where,
      orderBy: { name: "asc" },
    });
    ok(res, rows);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "MYTH_ALL");
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const row = await prisma.mythicalBeing.findUnique({
      where: { slug: req.params.slug },
    });
    if (!row) {
      return fail(res, 404, "Mythical being not found", "NOT_FOUND");
    }
    ok(res, row);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "MYTH_GET");
  }
});

module.exports = router;
