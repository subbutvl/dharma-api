import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../lib/api";
import { firstGalleryUrl } from "../config/explore";
import {
  TempleTabbedDetail,
  TempleSummaryCard,
} from "../components/TempleFields";

const RESOURCE = {
  slokas: { path: "/slokas", matchKey: "id" },
  temples: { path: "/temples", matchKey: "id" },
  avatars: { path: "/avatars", matchKey: "id" },
  songs: { path: "/songs", matchKey: "id" },
  festivals: { path: "/festivals", matchKey: "slug" },
};

/** @param {Record<string, unknown>} row @param {string} resource */
function deityIdFromRow(row, resource) {
  if (resource === "festivals") return null;
  if (row.deityId != null && row.deityId !== "") return String(row.deityId);
  const d = row.deity;
  if (d && typeof d === "object" && d.id != null) return String(d.id);
  return null;
}

/** @param {Record<string, unknown>} row @param {string} resource */
function heroImage(row, resource) {
  if (resource === "temples") {
    return (
      firstGalleryUrl(row.imageGalleryUrls) ||
      (row.deity &&
      typeof row.deity === "object" &&
      typeof row.deity.primaryImageUrl === "string"
        ? row.deity.primaryImageUrl
        : null)
    );
  }
  if (resource === "festivals") {
    const links = Array.isArray(row.deityLinks) ? row.deityLinks : [];
    const d = links[0]?.deity;
    return d && typeof d.primaryImageUrl === "string"
      ? d.primaryImageUrl
      : null;
  }
  const deity = row.deity;
  if (
    deity &&
    typeof deity === "object" &&
    typeof deity.primaryImageUrl === "string"
  ) {
    return deity.primaryImageUrl;
  }
  return null;
}

/** @param {Record<string, unknown>} row @param {string} resource */
function buildTabs(row, resource) {
  const primaryLabel =
    {
      slokas: "Sloka",
      temples: "Temple",
      avatars: "Avatar",
      songs: "Song",
      festivals: "Festival",
    }[resource] || "Record";

  const tabs = [{ id: "primary", label: primaryLabel }];

  if (resource === "festivals") {
    const links = Array.isArray(row.deityLinks) ? row.deityLinks : [];
    if (links.length) tabs.push({ id: "deities", label: "Deities" });
    return tabs;
  }

  const hasDeity =
    (row.deity &&
      typeof row.deity === "object" &&
      (row.deity.slug || row.deity.name)) ||
    (row.deityId != null && row.deityId !== "");

  if (hasDeity) tabs.push({ id: "deity", label: "Deity" });

  if (resource === "slokas") tabs.push({ id: "temples", label: "Temples" });
  if (resource === "temples") tabs.push({ id: "slokas", label: "Slokas" });
  if (resource === "avatars" || resource === "songs") {
    tabs.push({ id: "temples", label: "Temples" });
    tabs.push({ id: "slokas", label: "Slokas" });
  }

  return tabs;
}

/** @param {{ row: Record<string, unknown>; resource: string }} props */
function PrimaryPanel({ row, resource }) {
  if (resource === "slokas") {
    return (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        {row.title ? (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {String(row.title)}
          </h2>
        ) : null}
        {row.sanskrit ? (
          <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
            {String(row.sanskrit)}
          </p>
        ) : null}
        {row.transliteration ? (
          <p className="text-sm italic text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
            {String(row.transliteration)}
          </p>
        ) : null}
        {row.meaning ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {String(row.meaning)}
          </p>
        ) : null}
      </div>
    );
  }

  if (resource === "temples") {
    return (
      <div className="text-sm">
        <TempleTabbedDetail temple={row} />
      </div>
    );
  }

  if (resource === "avatars") {
    return (
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {String(row.name || "Avatar")}
        </h2>
        {row.tradition ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tradition: {String(row.tradition)}
          </p>
        ) : null}
        {row.description ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {String(row.description)}
          </p>
        ) : null}
      </div>
    );
  }

  if (resource === "songs") {
    return (
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {String(row.title || "Song")}
        </h2>
        {row.credit ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Credit: {String(row.credit)}
          </p>
        ) : null}
        {row.externalUrl ? (
          <a
            href={String(row.externalUrl)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline break-all"
          >
            {String(row.externalUrl)}
          </a>
        ) : null}
        {row.licenseNote ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
            {String(row.licenseNote)}
          </p>
        ) : null}
      </div>
    );
  }

  if (resource === "festivals") {
    return (
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {String(row.name || "Festival")}
        </h2>
        {row.description ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {String(row.description)}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No description.
          </p>
        )}
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">No preview.</p>
  );
}

function RecordDetail() {
  const { resource, param } = useParams();
  const cfg = resource ? RESOURCE[resource] : undefined;
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("primary");
  const [relatedTemples, setRelatedTemples] = useState([]);
  const [relatedSlokas, setRelatedSlokas] = useState([]);

  useEffect(() => {
    setActiveTab("primary");
  }, [param, resource]);

  useEffect(() => {
    if (!cfg || !param) return undefined;
    const ac = new AbortController();
    let alive = true;
    (async () => {
      await Promise.resolve();
      if (!alive || ac.signal.aborted) return;
      setLoading(true);
      setError(null);
      setRow(null);
      try {
        const body = await fetchJson(cfg.path, { signal: ac.signal });
        if (!alive) return;
        const list = Array.isArray(body.data) ? body.data : [];
        const found = list.find(
          (r) => String(r[cfg.matchKey]) === String(param),
        );
        if (!found) throw new Error("Not found");
        setRow(found);
      } catch (e) {
        if (!alive || e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      ac.abort();
    };
  }, [cfg, param, resource]);

  useEffect(() => {
    if (!row || !resource || resource === "festivals") {
      setRelatedTemples([]);
      setRelatedSlokas([]);
      return undefined;
    }
    const deityId = deityIdFromRow(row, resource);
    if (!deityId) {
      setRelatedTemples([]);
      setRelatedSlokas([]);
      return undefined;
    }
    const ac = new AbortController();
    let alive = true;
    (async () => {
      try {
        const [tBody, sBody] = await Promise.all([
          fetchJson("/temples", { signal: ac.signal }),
          fetchJson("/slokas", { signal: ac.signal }),
        ]);
        if (!alive) return;
        const allT = Array.isArray(tBody.data) ? tBody.data : [];
        const allS = Array.isArray(sBody.data) ? sBody.data : [];
        setRelatedTemples(
          allT.filter(
            (t) => String(t.deityId || t.deity?.id || "") === deityId,
          ),
        );
        setRelatedSlokas(
          allS.filter((s) => String(s.deityId || "") === deityId),
        );
      } catch {
        if (!alive) return;
        setRelatedTemples([]);
        setRelatedSlokas([]);
      }
    })();
    return () => {
      alive = false;
      ac.abort();
    };
  }, [row, resource]);

  const tabs = useMemo(() => {
    if (!row || !resource) return [{ id: "primary", label: "Record" }];
    return buildTabs(row, resource);
  }, [row, resource]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab))
      setActiveTab(tabs[0]?.id || "primary");
  }, [tabs, activeTab]);

  if (!cfg) {
    return <p className="text-red-600 dark:text-red-400">Invalid resource.</p>;
  }

  const back = `/${resource}`;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (error || !row) {
    return (
      <div className="space-y-4">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link to={back} className="hover:underline">
            ← Back
          </Link>
        </nav>
        <p className="text-red-600 dark:text-red-400">{error || "Not found"}</p>
      </div>
    );
  }

  const pageTitle =
    (row.title != null && String(row.title)) ||
    (row.nameEnglish != null && String(row.nameEnglish)) ||
    (row.name != null && String(row.name)) ||
    (row.slug != null && String(row.slug)) ||
    "Record";

  const badge =
    {
      slokas: "Sloka",
      temples: "Temple",
      avatars: "Avatar",
      songs: "Song",
      festivals: "Festival",
    }[resource] || resource;

  const img = heroImage(row, resource);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to={back} className="hover:underline capitalize">
          {resource}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{pageTitle}</span>
      </nav>

      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                rounded-2xl shadow-sm overflow-hidden transition-colors duration-300"
      >
        <div className="grid md:grid-cols-10 min-h-[360px]">
          <div className="md:col-span-3 h-full">
            <div className="h-full w-full min-h-[220px] md:min-h-0">
              {img ? (
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover min-h-[280px] md:min-h-[360px]"
                />
              ) : (
                <div
                  className="h-full w-full min-h-[280px] md:min-h-[360px]
                        bg-gray-200 dark:bg-gray-800
                        flex items-center justify-center
                        text-gray-400 dark:text-gray-600 text-sm px-4 text-center"
                >
                  Image placeholder
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7 p-6 md:p-8 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {pageTitle}
              </h1>
              <span
                className="inline-block text-xs font-medium px-3 py-1 rounded-full
                         bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
              >
                {badge.toUpperCase()}
              </span>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 text-sm font-medium transition capitalize ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-gray-700 dark:text-gray-300 min-h-[120px]">
              {activeTab === "primary" && (
                <PrimaryPanel row={row} resource={resource} />
              )}

              {activeTab === "deity" &&
              row.deity &&
              typeof row.deity === "object" ? (
                <div className="space-y-3">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {String(row.deity.name || "")}
                  </p>
                  {row.deity.slug ? (
                    <Link
                      to={`/deities/${String(row.deity.slug)}`}
                      className="inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Open deity profile →
                    </Link>
                  ) : null}
                </div>
              ) : null}

              {activeTab === "deity" &&
              (!row.deity || typeof row.deity !== "object") ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No linked deity.
                </p>
              ) : null}

              {activeTab === "temples" && (
                <div className="space-y-4">
                  {relatedTemples.length ? (
                    relatedTemples.map((t) => (
                      <Link
                        key={String(t.id)}
                        to={`/temples/${String(t.id)}`}
                        className="block"
                      >
                        <TempleSummaryCard temple={t} />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No temples linked to this deity in the dataset.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "slokas" && (
                <div className="space-y-4">
                  {relatedSlokas.length ? (
                    relatedSlokas.map((s) => (
                      <Link
                        key={String(s.id)}
                        to={`/slokas/${String(s.id)}`}
                        className="block"
                      >
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:opacity-90 transition">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {s.title != null ? String(s.title) : "Sloka"}
                          </p>
                          {s.sanskrit ? (
                            <p className="text-sm mt-2 line-clamp-3 whitespace-pre-wrap">
                              {String(s.sanskrit)}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No slokas linked to this deity in the dataset.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "deities" && resource === "festivals" ? (
                <div className="space-y-3">
                  {(Array.isArray(row.deityLinks) ? row.deityLinks : []).map(
                    (link) => {
                      const d = link?.deity;
                      if (!d || typeof d !== "object") return null;
                      return (
                        <Link
                          key={String(d.slug || d.id)}
                          to={`/deities/${String(d.slug)}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                          {d.primaryImageUrl ? (
                            <img
                              src={String(d.primaryImageUrl)}
                              alt=""
                              className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gray-300 dark:bg-gray-600 shrink-0" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {String(d.name || d.slug)}
                          </span>
                        </Link>
                      );
                    },
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordDetail;
