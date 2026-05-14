/**
 * @param {import("@prisma/client").Deity} row
 * @param {{ slokas?: import("@prisma/client").Sloka[]; temples?: import("@prisma/client").Temple[] }} [extra]
 */
function toPublicDeity(row, extra = {}) {
  const rel =
    row.relationships && typeof row.relationships === "object"
      ? row.relationships
      : {};
  const worshipBase =
    row.worship && typeof row.worship === "object" ? row.worship : {};

  const dbSlokas = (extra.slokas || []).map((s) => ({
    title: s.title,
    text: [s.sanskrit, s.transliteration].filter(Boolean).join(" — "),
    sanskrit: s.sanskrit,
    transliteration: s.transliteration,
    meaning: s.meaning,
  }));

  const dbTemples = (extra.temples || []).map((t) => ({
    name: t.nameEnglish,
    location: t.city,
    significance: t.overview,
    nameEnglish: t.nameEnglish,
    nameTamil: t.nameTamil,
    city: t.city,
    overview: t.overview,
    sthalaPuranam: t.sthalaPuranam,
    literaryBackground: t.literaryBackground,
    puranaBackground: t.puranaBackground,
    deitiesText: t.deitiesText,
    poojaTimings: t.poojaTimings,
    festivalsEvents: t.festivalsEvents,
    specialities: t.specialities,
    howToReach: t.howToReach,
    contactInfo: t.contactInfo,
    imageGalleryUrls: t.imageGalleryUrls,
    latitude: t.latitude,
    longitude: t.longitude,
  }));

  const worship = {
    majorFestivals: worshipBase.majorFestivals || [],
    mantra: worshipBase.mantra ?? null,
    slokas:
      dbSlokas.length > 0
        ? dbSlokas
        : Array.isArray(worshipBase.slokas)
          ? worshipBase.slokas
          : [],
    temples:
      dbTemples.length > 0
        ? dbTemples
        : Array.isArray(worshipBase.temples)
          ? worshipBase.temples
          : [],
  };

  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    title: row.title,
    alternateNames: [...(row.aliases || [])],
    aliases: [...(row.aliases || [])],
    category: row.category,
    description: row.description,
    descriptionEn: row.descriptionEn,
    descriptionTa: row.descriptionTa,
    affiliation: row.affiliation,
    abode: row.abode,
    primaryImageUrl: row.primaryImageUrl,
    attributes: row.attributes || {},
    relationships: {
      parents: rel.parents || [],
      siblings: rel.siblings || [],
      consorts: rel.consorts || [],
      children: rel.children || [],
    },
    worship,
    media: row.media || {},
    metadata: { version: 1 },
  };
}

function toPublicDeityList(row) {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    title: row.title,
    description: row.description,
    category: row.category,
    alternateNames: [...(row.aliases || [])],
    aliases: [...(row.aliases || [])],
    affiliation: row.affiliation,
    abode: row.abode,
  };
}

module.exports = { toPublicDeity, toPublicDeityList };
