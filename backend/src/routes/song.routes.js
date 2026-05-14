const express = require("express");
const prisma = require("../db/prisma");
const { ok, fail } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await prisma.song.findMany({
      orderBy: { title: "asc" },
      include: { deity: { select: { slug: true, name: true } } },
    });
    ok(res, rows);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "SONGS_ALL");
  }
});

module.exports = router;
