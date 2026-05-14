const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const prisma = require("../db/prisma");
const { ok, fail } = require("../utils/apiResponse");
const { requireAdminToken } = require("../middleware/requireAdminToken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

const router = express.Router();

router.get("/status", (_req, res) => {
  const t = process.env.ADMIN_TOKEN;
  ok(res, { tokenRequired: !!(t && String(t).trim()) });
});

router.use(requireAdminToken);

function trimOrNull(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function parseAliases(cell) {
  const t = trimOrNull(cell);
  if (!t) return [];
  return t
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOptionalJson(str, label) {
  const t = trimOrNull(str);
  if (t == null) return null;
  try {
    return JSON.parse(t);
  } catch {
    throw new Error(`Invalid JSON in ${label}`);
  }
}

function normalizeCsvRow(row) {
  const o = {};
  for (const [k, v] of Object.entries(row)) {
    o[String(k).trim().toLowerCase().replace(/\s+/g, "_")] = v;
  }
  return o;
}

function parseCsvBuffer(buf) {
  const text = buf.toString("utf8");
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });
}

async function resolveDeityIdBySlug(slug) {
  const s = trimOrNull(slug);
  if (!s) return null;
  const d = await prisma.deity.findUnique({
    where: { slug: s },
    select: { id: true },
  });
  return d ? d.id : null;
}

/** @param {{ created: number, errors: { row: number, message: string }[] }} out */
function runBulk(out, rowIndex, fn) {
  const row = rowIndex + 2;
  return fn().then(
    () => {
      out.created += 1;
    },
    (err) => {
      out.errors.push({
        row,
        message: err instanceof Error ? err.message : String(err),
      });
    },
  );
}

// --- Deities ---

async function createDeityFromFields(f) {
  const slug = trimOrNull(f.slug);
  const name = trimOrNull(f.name);
  if (!slug || !name) throw new Error("slug and name are required");
  const category = trimOrNull(f.category) || "deva";
  const aliases = Array.isArray(f.aliases)
    ? f.aliases
    : parseAliases(f.aliases);
  return prisma.deity.create({
    data: {
      slug,
      name,
      title: trimOrNull(f.title),
      description: trimOrNull(f.description),
      descriptionEn: trimOrNull(f.description_en ?? f.descriptionEn),
      descriptionTa: trimOrNull(f.description_ta ?? f.descriptionTa),
      category,
      aliases,
      affiliation: trimOrNull(f.affiliation),
      abode: trimOrNull(f.abode),
      primaryImageUrl: trimOrNull(f.primary_image_url ?? f.primaryImageUrl),
      attributes:
        f.attributes != null && typeof f.attributes === "object"
          ? f.attributes
          : (parseOptionalJson(
              f.attributes_json ?? f.attributesJson,
              "attributes_json",
            ) ?? undefined),
      relationships:
        f.relationships != null && typeof f.relationships === "object"
          ? f.relationships
          : (parseOptionalJson(
              f.relationships_json ?? f.relationshipsJson,
              "relationships_json",
            ) ?? undefined),
      worship:
        f.worship != null && typeof f.worship === "object"
          ? f.worship
          : (parseOptionalJson(
              f.worship_json ?? f.worshipJson,
              "worship_json",
            ) ?? undefined),
      media:
        f.media != null && typeof f.media === "object"
          ? f.media
          : (parseOptionalJson(f.media_json ?? f.mediaJson, "media_json") ??
            undefined),
    },
  });
}

router.post("/deities", express.json({ limit: "512kb" }), async (req, res) => {
  try {
    const row = await createDeityFromFields(req.body);
    ok(res, row);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = msg.includes("Unique constraint") ? 409 : 400;
    fail(res, code, msg, "DEITY_CREATE");
  }
});

router.post("/deities/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    await runBulk(out, i, () => createDeityFromFields(records[i]));
  }
  ok(res, out);
});

// --- Slokas ---

router.post("/slokas", express.json({ limit: "1mb" }), async (req, res) => {
  try {
    const deitySlug = trimOrNull(req.body.deitySlug ?? req.body.deity_slug);
    const deityId = await resolveDeityIdBySlug(deitySlug || "");
    if (!deityId) throw new Error("deitySlug not found");
    const sanskrit = trimOrNull(req.body.sanskrit);
    if (!sanskrit) throw new Error("sanskrit is required");
    const row = await prisma.sloka.create({
      data: {
        deityId,
        title: trimOrNull(req.body.title),
        sanskrit,
        transliteration: trimOrNull(req.body.transliteration),
        meaning: trimOrNull(req.body.meaning),
      },
    });
    ok(res, row);
  } catch (err) {
    fail(
      res,
      400,
      err instanceof Error ? err.message : String(err),
      "SLOKA_CREATE",
    );
  }
});

router.post("/slokas/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    await runBulk(out, i, async () => {
      const deityId = await resolveDeityIdBySlug(r.deity_slug);
      if (!deityId) throw new Error(`deity_slug not found: ${r.deity_slug}`);
      const sanskrit = trimOrNull(r.sanskrit);
      if (!sanskrit) throw new Error("sanskrit is required");
      await prisma.sloka.create({
        data: {
          deityId,
          title: trimOrNull(r.title),
          sanskrit,
          transliteration: trimOrNull(r.transliteration),
          meaning: trimOrNull(r.meaning),
        },
      });
    });
  }
  ok(res, out);
});

// --- Temples ---

router.post("/temples", express.json({ limit: "512kb" }), async (req, res) => {
  try {
    const deityId = await resolveDeityIdBySlug(
      trimOrNull(req.body.deitySlug ?? req.body.deity_slug) || "",
    );
    if (!deityId) throw new Error("deitySlug not found");
    const name = trimOrNull(req.body.name);
    const location = trimOrNull(req.body.location);
    if (!name || !location) throw new Error("name and location are required");
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const row = await prisma.temple.create({
      data: {
        deityId,
        name,
        location,
        significance: trimOrNull(req.body.significance),
        latitude:
          lat === "" || lat == null ? null : Number.parseFloat(String(lat)),
        longitude:
          lon === "" || lon == null ? null : Number.parseFloat(String(lon)),
      },
    });
    ok(res, row);
  } catch (err) {
    fail(
      res,
      400,
      err instanceof Error ? err.message : String(err),
      "TEMPLE_CREATE",
    );
  }
});

router.post("/temples/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    await runBulk(out, i, async () => {
      const deityId = await resolveDeityIdBySlug(r.deity_slug);
      if (!deityId) throw new Error(`deity_slug not found: ${r.deity_slug}`);
      const name = trimOrNull(r.name);
      const location = trimOrNull(r.location);
      if (!name || !location) throw new Error("name and location are required");
      const la = trimOrNull(r.latitude);
      const lo = trimOrNull(r.longitude);
      await prisma.temple.create({
        data: {
          deityId,
          name,
          location,
          significance: trimOrNull(r.significance),
          latitude: la == null ? null : Number.parseFloat(la),
          longitude: lo == null ? null : Number.parseFloat(lo),
        },
      });
    });
  }
  ok(res, out);
});

// --- Avatars ---

router.post("/avatars", express.json({ limit: "512kb" }), async (req, res) => {
  try {
    const deityId = await resolveDeityIdBySlug(
      trimOrNull(req.body.deitySlug ?? req.body.deity_slug) || "",
    );
    if (!deityId) throw new Error("deitySlug not found");
    const name = trimOrNull(req.body.name);
    if (!name) throw new Error("name is required");
    const row = await prisma.avatar.create({
      data: {
        deityId,
        name,
        description: trimOrNull(req.body.description),
        tradition: trimOrNull(req.body.tradition),
      },
    });
    ok(res, row);
  } catch (err) {
    fail(
      res,
      400,
      err instanceof Error ? err.message : String(err),
      "AVATAR_CREATE",
    );
  }
});

router.post("/avatars/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    await runBulk(out, i, async () => {
      const deityId = await resolveDeityIdBySlug(r.deity_slug);
      if (!deityId) throw new Error(`deity_slug not found: ${r.deity_slug}`);
      const name = trimOrNull(r.name);
      if (!name) throw new Error("name is required");
      await prisma.avatar.create({
        data: {
          deityId,
          name,
          description: trimOrNull(r.description),
          tradition: trimOrNull(r.tradition),
        },
      });
    });
  }
  ok(res, out);
});

// --- Songs ---

router.post("/songs", express.json({ limit: "512kb" }), async (req, res) => {
  try {
    const deitySlug = trimOrNull(req.body.deitySlug ?? req.body.deity_slug);
    const deityId = deitySlug ? await resolveDeityIdBySlug(deitySlug) : null;
    if (deitySlug && !deityId) throw new Error("deitySlug not found");
    const title = trimOrNull(req.body.title);
    const externalUrl = trimOrNull(
      req.body.externalUrl ?? req.body.external_url,
    );
    if (!title || !externalUrl)
      throw new Error("title and externalUrl are required");
    const row = await prisma.song.create({
      data: {
        deityId,
        title,
        credit: trimOrNull(req.body.credit),
        externalUrl,
        licenseNote: trimOrNull(req.body.licenseNote ?? req.body.license_note),
      },
    });
    ok(res, row);
  } catch (err) {
    fail(
      res,
      400,
      err instanceof Error ? err.message : String(err),
      "SONG_CREATE",
    );
  }
});

router.post("/songs/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    await runBulk(out, i, async () => {
      const ds = trimOrNull(r.deity_slug);
      const deityId = ds ? await resolveDeityIdBySlug(ds) : null;
      if (ds && !deityId) throw new Error(`deity_slug not found: ${ds}`);
      const title = trimOrNull(r.title);
      const externalUrl = trimOrNull(r.external_url);
      if (!title || !externalUrl) {
        throw new Error("title and external_url are required");
      }
      await prisma.song.create({
        data: {
          deityId,
          title,
          credit: trimOrNull(r.credit),
          externalUrl,
          licenseNote: trimOrNull(r.license_note),
        },
      });
    });
  }
  ok(res, out);
});

// --- Festivals ---

router.post(
  "/festivals",
  express.json({ limit: "512kb" }),
  async (req, res) => {
    try {
      const slug = trimOrNull(req.body.slug);
      const name = trimOrNull(req.body.name);
      if (!slug || !name) throw new Error("slug and name are required");
      const fest = await prisma.festival.create({
        data: {
          slug,
          name,
          description: trimOrNull(req.body.description),
        },
      });
      let links = req.body.deitySlugs ?? req.body.deity_slugs;
      if (typeof links === "string") {
        links = links
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (Array.isArray(links) && links.length) {
        for (const s of links) {
          const deityId = await resolveDeityIdBySlug(String(s).trim());
          if (deityId) {
            await prisma.deityFestival
              .create({ data: { deityId, festivalId: fest.id } })
              .catch(() => {});
          }
        }
      }
      ok(res, fest);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const code = msg.includes("Unique constraint") ? 409 : 400;
      fail(res, code, msg, "FESTIVAL_CREATE");
    }
  },
);

router.post("/festivals/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
  }
  let records;
  try {
    records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
  } catch (e) {
    return fail(
      res,
      400,
      e instanceof Error ? e.message : "CSV parse error",
      "CSV_PARSE",
    );
  }
  const out = { created: 0, errors: [] };
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    await runBulk(out, i, async () => {
      const slug = trimOrNull(r.slug);
      const name = trimOrNull(r.name);
      if (!slug || !name) throw new Error("slug and name are required");
      const raw = trimOrNull(r.deity_slugs);
      const slugs = raw
        ? raw
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await prisma.$transaction(async (tx) => {
        const fest = await tx.festival.create({
          data: {
            slug,
            name,
            description: trimOrNull(r.description),
          },
        });
        for (const ds of slugs) {
          const s = trimOrNull(ds);
          if (!s) continue;
          const d = await tx.deity.findUnique({
            where: { slug: s },
            select: { id: true },
          });
          if (!d) {
            throw new Error(`deity slug not found for link: ${s}`);
          }
          await tx.deityFestival.create({
            data: { deityId: d.id, festivalId: fest.id },
          });
        }
      });
    });
  }
  ok(res, out);
});

// --- Mythical beings ---

router.post(
  "/mythical-beings",
  express.json({ limit: "512kb" }),
  async (req, res) => {
    try {
      const slug = trimOrNull(req.body.slug);
      const name = trimOrNull(req.body.name);
      const kind = trimOrNull(req.body.kind);
      if (!slug || !name || !kind)
        throw new Error("slug, name, and kind are required");
      const lore =
        req.body.lore != null && typeof req.body.lore === "object"
          ? req.body.lore
          : parseOptionalJson(
              req.body.loreJson ?? req.body.lore_json,
              "lore_json",
            );
      const row = await prisma.mythicalBeing.create({
        data: {
          slug,
          name,
          kind,
          description: trimOrNull(req.body.description),
          lore: lore ?? undefined,
        },
      });
      ok(res, row);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const code = msg.includes("Unique constraint") ? 409 : 400;
      fail(res, code, msg, "MYTHICAL_CREATE");
    }
  },
);

router.post(
  "/mythical-beings/import",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return fail(res, 400, "Missing file field (CSV)", "IMPORT_NO_FILE");
    }
    let records;
    try {
      records = parseCsvBuffer(req.file.buffer).map(normalizeCsvRow);
    } catch (e) {
      return fail(
        res,
        400,
        e instanceof Error ? e.message : "CSV parse error",
        "CSV_PARSE",
      );
    }
    const out = { created: 0, errors: [] };
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      await runBulk(out, i, async () => {
        const slug = trimOrNull(r.slug);
        const name = trimOrNull(r.name);
        const kind = trimOrNull(r.kind);
        if (!slug || !name || !kind) {
          throw new Error("slug, name, and kind are required");
        }
        const lore = parseOptionalJson(r.lore_json, "lore_json");
        await prisma.mythicalBeing.create({
          data: {
            slug,
            name,
            kind,
            description: trimOrNull(r.description),
            lore: lore ?? undefined,
          },
        });
      });
    }
    ok(res, out);
  },
);

module.exports = router;
