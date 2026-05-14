import { fetchJson } from "../lib/api.js";

/**
 * @param {Record<string, unknown>} row
 * @param {string} key
 */
function pick(row, key) {
  const v = row[key];
  return v == null ? "" : String(v);
}

/** @param {unknown} raw */
export function firstGalleryUrl(raw) {
  if (raw == null) return null;
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
    return raw[0];
  }
  return null;
}

/** Explore list config per kind (see ExploreList.jsx). */
export const EXPLORE_KINDS = {
  deities: {
    path: "deities",
    label: "Deities",
    listTitle: "Deities",
    description: "Search and open a deity profile.",
    fetchList: async (opts, signal) => {
      const params = new URLSearchParams();
      params.set("limit", "100");
      params.set("page", "1");
      if (opts.search?.trim()) params.set("q", opts.search.trim());
      if (opts.category && opts.category !== "all") {
        params.set("category", opts.category);
      }
      const body = await fetchJson(`/deities?${params.toString()}`, { signal });
      return {
        items: Array.isArray(body.data) ? body.data : [],
        meta: body.meta || null,
      };
    },
    toCard: (item) => ({
      title: pick(item, "name"),
      subtitle: pick(item, "title") || pick(item, "category"),
      href: `/deities/${pick(item, "slug")}`,
      meta: pick(item, "category"),
      badge: (pick(item, "category") || "deva").toUpperCase(),
      imageUrl:
        typeof item.primaryImageUrl === "string" ? item.primaryImageUrl : null,
    }),
    supportsSearch: true,
    supportsCategory: true,
  },
  slokas: {
    path: "slokas",
    label: "Slokas",
    listTitle: "Slokas",
    description: "Verses linked to deities.",
    fetchList: async (_opts, signal) => {
      const body = await fetchJson("/slokas", { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => {
      const deity =
        item.deity && typeof item.deity === "object" ? item.deity : {};
      const imageUrl =
        typeof deity.primaryImageUrl === "string"
          ? deity.primaryImageUrl
          : null;
      return {
        title: pick(item, "title") || "Sloka",
        subtitle: deity.name
          ? `${deity.name} · ${pick(deity, "slug")}`
          : pick(item, "deityId"),
        href: `/slokas/${pick(item, "id")}`,
        meta: pick(item, "id").slice(0, 8),
        badge: "Sloka",
        imageUrl,
      };
    },
  },
  temples: {
    path: "temples",
    label: "Temples",
    listTitle: "Temples",
    description: "Sacred sites by deity.",
    fetchList: async (_opts, signal) => {
      const body = await fetchJson("/temples", { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => {
      const deity =
        item.deity && typeof item.deity === "object" ? item.deity : {};
      const title = pick(item, "nameEnglish") || pick(item, "name");
      const city = pick(item, "city") || pick(item, "location");
      const imageUrl =
        firstGalleryUrl(item.imageGalleryUrls) ||
        (typeof deity.primaryImageUrl === "string"
          ? deity.primaryImageUrl
          : null);
      return {
        title,
        subtitle: deity.name ? `${deity.name} · ${city}` : city,
        href: `/temples/${pick(item, "id")}`,
        meta: city,
        badge: "Temple",
        imageUrl,
      };
    },
  },
  avatars: {
    path: "avatars",
    label: "Avatars",
    listTitle: "Avatars",
    description: "Incarnations and forms.",
    fetchList: async (_opts, signal) => {
      const body = await fetchJson("/avatars", { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => {
      const deity =
        item.deity && typeof item.deity === "object" ? item.deity : {};
      const imageUrl =
        typeof deity.primaryImageUrl === "string"
          ? deity.primaryImageUrl
          : null;
      return {
        title: pick(item, "name"),
        subtitle: deity.name
          ? `${deity.name}${item.tradition ? ` · ${pick(item, "tradition")}` : ""}`
          : pick(item, "tradition"),
        href: `/avatars/${pick(item, "id")}`,
        meta: pick(item, "tradition"),
        badge: pick(item, "tradition") || "Avatar",
        imageUrl,
      };
    },
  },
  songs: {
    path: "songs",
    label: "Songs",
    listTitle: "Songs",
    description: "Audio links and credits.",
    fetchList: async (_opts, signal) => {
      const body = await fetchJson("/songs", { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => {
      const deity =
        item.deity && typeof item.deity === "object" ? item.deity : {};
      const imageUrl =
        typeof deity.primaryImageUrl === "string"
          ? deity.primaryImageUrl
          : null;
      return {
        title: pick(item, "title"),
        subtitle:
          deity.name || pick(item, "credit") || pick(item, "externalUrl"),
        href: `/songs/${pick(item, "id")}`,
        meta: pick(item, "credit"),
        badge: "Song",
        imageUrl,
      };
    },
  },
  festivals: {
    path: "festivals",
    label: "Festivals",
    listTitle: "Festivals",
    description: "Utsavs and observances.",
    fetchList: async (_opts, signal) => {
      const body = await fetchJson("/festivals", { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => {
      const raw = pick(item, "description");
      const short = raw.length > 120 ? `${raw.slice(0, 120)}…` : raw || "—";
      const links = Array.isArray(item.deityLinks) ? item.deityLinks : [];
      const firstDeity = links[0]?.deity;
      const imageUrl =
        firstDeity && typeof firstDeity.primaryImageUrl === "string"
          ? firstDeity.primaryImageUrl
          : null;
      return {
        title: pick(item, "name"),
        subtitle: short,
        href: `/festivals/${pick(item, "slug")}`,
        meta: pick(item, "slug"),
        badge: "Festival",
        imageUrl,
      };
    },
  },
  "mythical-beings": {
    path: "mythical-beings",
    label: "Mythical",
    listTitle: "Mythical beings",
    description: "Asuras, nagas, yakshas, and lore figures.",
    fetchList: async (opts, signal) => {
      const q = opts.kindFilter?.trim();
      const path = q
        ? `/mythical-beings?kind=${encodeURIComponent(q)}`
        : "/mythical-beings";
      const body = await fetchJson(path, { signal });
      return { items: Array.isArray(body.data) ? body.data : [], meta: null };
    },
    toCard: (item) => ({
      title: pick(item, "name"),
      subtitle: pick(item, "kind"),
      href: `/mythical-beings/${pick(item, "slug")}`,
      meta: pick(item, "slug"),
      badge: pick(item, "kind") || "Mythical",
      imageUrl: null,
    }),
    supportsKindFilter: true,
  },
};
