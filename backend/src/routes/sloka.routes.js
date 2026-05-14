const express = require("express");
const prisma = require("../db/prisma");
const { ok, fail } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await prisma.sloka.findMany({
      orderBy: [{ deityId: "asc" }, { title: "asc" }],
      include: { deity: { select: { slug: true, name: true } } },
    });
    ok(res, rows);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "SLOKAS_ALL");
  }
});

module.exports = router;
