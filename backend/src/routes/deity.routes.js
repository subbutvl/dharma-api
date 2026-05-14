const express = require("express");
const prisma = require("../db/prisma");
const { ok, fail } = require("../utils/apiResponse");
const {
  toPublicDeity,
  toPublicDeityList,
} = require("../utils/deitySerializer");

const router = express.Router();

function parsePagination(query) {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(query.limit || "20"), 10) || 20),
  );
  return { page, limit, skip: (page - 1) * limit };
}

/** GET / — list with optional q, category, page, limit */
router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const baseWhere = {};
    if (category && category !== "all") {
      baseWhere.category = String(category);
    }

    const term = q && String(q).trim() ? String(q).trim() : "";

    if (term) {
      const nameSlugWhere = {
        ...baseWhere,
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { slug: { contains: term, mode: "insensitive" } },
        ],
      };

      const candidates = await prisma.deity.findMany({
        where: nameSlugWhere,
        orderBy: { name: "asc" },
      });

      const t = term.toLowerCase();
      const aliasMatches = await prisma.deity.findMany({
        where: baseWhere,
        orderBy: { name: "asc" },
      });

      const merged = new Map();
      for (const r of candidates) {
        merged.set(r.id, r);
      }
      for (const r of aliasMatches) {
        const aliases = r.aliases || [];
        if (
          aliases.some((a) => a.toLowerCase().includes(t)) &&
          !merged.has(r.id)
        ) {
          merged.set(r.id, r);
        }
      }

      const all = [...merged.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const total = all.length;
      const slice = all.slice(skip, skip + limit);
      const data = slice.map((r) => toPublicDeityList(r));
      return ok(res, data, { page, limit, total });
    }

    const [total, rows] = await Promise.all([
      prisma.deity.count({ where: baseWhere }),
      prisma.deity.findMany({
        where: baseWhere,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
    ]);

    const data = rows.map((r) => toPublicDeityList(r));
    ok(res, data, { page, limit, total });
  } catch (err) {
    fail(
      res,
      500,
      err instanceof Error ? err.message : "Failed to list deities",
      "DEITY_LIST_ERROR",
    );
  }
});

/** GET /:slug/slokas — must be before /:slug */
router.get("/:slug/slokas", async (req, res) => {
  try {
    const { slug } = req.params;
    const deity = await prisma.deity.findUnique({ where: { slug } });
    if (!deity) {
      return fail(res, 404, "Deity not found", "NOT_FOUND");
    }
    const slokas = await prisma.sloka.findMany({
      where: { deityId: deity.id },
      orderBy: { title: "asc" },
    });
    ok(res, slokas);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "SLOKA_LIST");
  }
});

router.get("/:slug/temples", async (req, res) => {
  try {
    const { slug } = req.params;
    const deity = await prisma.deity.findUnique({ where: { slug } });
    if (!deity) {
      return fail(res, 404, "Deity not found", "NOT_FOUND");
    }
    const temples = await prisma.temple.findMany({
      where: { deityId: deity.id },
      orderBy: { name: "asc" },
    });
    ok(res, temples);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "TEMPLE_LIST");
  }
});

router.get("/:slug/avatars", async (req, res) => {
  try {
    const { slug } = req.params;
    const deity = await prisma.deity.findUnique({ where: { slug } });
    if (!deity) {
      return fail(res, 404, "Deity not found", "NOT_FOUND");
    }
    const avatars = await prisma.avatar.findMany({
      where: { deityId: deity.id },
      orderBy: { name: "asc" },
    });
    ok(res, avatars);
  } catch (err) {
    fail(res, 500, err instanceof Error ? err.message : "Error", "AVATAR_LIST");
  }
});

router.get("/:slug/festivals", async (req, res) => {
  try {
    const { slug } = req.params;
    const deity = await prisma.deity.findUnique({ where: { slug } });
    if (!deity) {
      return fail(res, 404, "Deity not found", "NOT_FOUND");
    }
    const links = await prisma.deityFestival.findMany({
      where: { deityId: deity.id },
      include: { festival: true },
    });
    const data = links.map((l) => l.festival);
    ok(res, data);
  } catch (err) {
    fail(
      res,
      500,
      err instanceof Error ? err.message : "Error",
      "FESTIVAL_LIST",
    );
  }
});

/** GET /:slug */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const row = await prisma.deity.findUnique({
      where: { slug },
      include: {
        slokas: true,
        temples: true,
      },
    });

    if (!row) {
      return fail(res, 404, "Deity not found", "NOT_FOUND");
    }

    const { slokas, temples, ...rest } = row;
    const data = toPublicDeity(rest, { slokas, temples });
    ok(res, data);
  } catch (err) {
    fail(
      res,
      500,
      err instanceof Error ? err.message : "Failed to load deity",
      "DEITY_GET_ERROR",
    );
  }
});

module.exports = router;
