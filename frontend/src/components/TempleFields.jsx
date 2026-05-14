import { useEffect, useMemo, useState } from "react";

/** @param {unknown} v */
function s(v) {
  if (v == null || v === "") return null;
  return String(v);
}

/** @param {{ label: string; children: import("react").ReactNode }} props */
function FieldBlock({ label, children }) {
  if (children == null || children === "") return null;
  return (
    <section className="pt-4 border-t border-gray-200 dark:border-gray-700 first:pt-0 first:border-0">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </h3>
      <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

/** @param {unknown} raw */
export function galleryUrls(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.filter((u) => typeof u === "string" && u.length > 0);
  }
  return [];
}

/** @param {Record<string, unknown>} temple */
function hasCoords(temple) {
  const lat = temple.latitude;
  const lon = temple.longitude;
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lon)
  );
}

/** @param {Record<string, unknown>} temple */
function templeSectionTabs(temple) {
  /** @type {{ id: string; label: string }[]} */
  const tabs = [{ id: "overview", label: "Overview" }];

  if (
    s(temple.deitiesText) ||
    s(temple.sthalaPuranam) ||
    s(temple.literaryBackground) ||
    s(temple.puranaBackground)
  ) {
    tabs.push({ id: "lore", label: "Lore & tradition" });
  }

  if (
    s(temple.poojaTimings) ||
    s(temple.festivalsEvents) ||
    s(temple.specialities)
  ) {
    tabs.push({ id: "schedule", label: "Timings & festivals" });
  }

  if (s(temple.howToReach) || s(temple.contactInfo)) {
    tabs.push({ id: "visit", label: "Plan your visit" });
  }

  const urls = galleryUrls(temple.imageGalleryUrls);
  if (urls.length > 0 || hasCoords(temple)) {
    tabs.push({ id: "gallery", label: "Gallery & map" });
  }

  return tabs;
}

/** @param {{ temple: Record<string, unknown>; active: string }} props */
function TempleOverviewPanel({ temple }) {
  const tamil = s(temple.nameTamil);
  const city = s(temple.city) || s(temple.location);
  const overview = s(temple.overview) || s(temple.significance);

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <div className="space-y-1">
        {tamil ? (
          <p className="text-base text-gray-600 dark:text-gray-400">{tamil}</p>
        ) : null}
        {city ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{city}</p>
        ) : null}
      </div>
      {overview ? (
        <FieldBlock label="Summary">{overview}</FieldBlock>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No overview text yet.
        </p>
      )}
    </div>
  );
}

/** @param {{ temple: Record<string, unknown> }} props */
function TempleLorePanel({ temple }) {
  return (
    <div className="space-y-0 text-gray-700 dark:text-gray-300">
      <FieldBlock label="Deities & iconography">
        {s(temple.deitiesText)}
      </FieldBlock>
      <FieldBlock label="Sthala puranam">{s(temple.sthalaPuranam)}</FieldBlock>
      <FieldBlock label="Literary background">
        {s(temple.literaryBackground)}
      </FieldBlock>
      <FieldBlock label="Purana background">
        {s(temple.puranaBackground)}
      </FieldBlock>
      {!s(temple.deitiesText) &&
      !s(temple.sthalaPuranam) &&
      !s(temple.literaryBackground) &&
      !s(temple.puranaBackground) ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No lore fields recorded.
        </p>
      ) : null}
    </div>
  );
}

/** @param {{ temple: Record<string, unknown> }} props */
function TempleSchedulePanel({ temple }) {
  return (
    <div className="space-y-0 text-gray-700 dark:text-gray-300">
      <FieldBlock label="Pooja timings">{s(temple.poojaTimings)}</FieldBlock>
      <FieldBlock label="Festivals & events">
        {s(temple.festivalsEvents)}
      </FieldBlock>
      <FieldBlock label="Specialities">{s(temple.specialities)}</FieldBlock>
      {!s(temple.poojaTimings) &&
      !s(temple.festivalsEvents) &&
      !s(temple.specialities) ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No schedule details recorded.
        </p>
      ) : null}
    </div>
  );
}

/** @param {{ temple: Record<string, unknown> }} props */
function TempleVisitPanel({ temple }) {
  return (
    <div className="space-y-0 text-gray-700 dark:text-gray-300">
      <FieldBlock label="How to reach">{s(temple.howToReach)}</FieldBlock>
      <FieldBlock label="Contact">{s(temple.contactInfo)}</FieldBlock>
      {!s(temple.howToReach) && !s(temple.contactInfo) ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No visitor logistics recorded.
        </p>
      ) : null}
    </div>
  );
}

/** @param {{ temple: Record<string, unknown> }} props */
function TempleGalleryPanel({ temple }) {
  const lat = temple.latitude;
  const lon = temple.longitude;
  const coords = hasCoords(temple);
  const urls = galleryUrls(temple.imageGalleryUrls);

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      {coords ? (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            Coordinates
          </h3>
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {Number(lat).toFixed(5)}, {Number(lon).toFixed(5)}
          </p>
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
          >
            Open map →
          </a>
        </section>
      ) : null}

      {urls.length > 0 ? (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Image gallery
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {urls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover hover:opacity-90 transition"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {!coords && urls.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No images or map coordinates yet.
        </p>
      ) : null}
    </div>
  );
}

/**
 * Temple detail split into logical tabs (overview, lore, schedule, visit, gallery).
 * @param {{ temple: Record<string, unknown>; compact?: boolean }} props
 */
export function TempleTabbedDetail({ temple, compact = false }) {
  const tabs = useMemo(() => templeSectionTabs(temple), [temple]);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const next = templeSectionTabs(temple);
    setActive((prev) =>
      next.some((t) => t.id === prev) ? prev : (next[0]?.id ?? "overview"),
    );
  }, [temple]);

  const tabBtn =
    "pb-2 px-1 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap";
  const tabActive = "border-blue-500 text-blue-600 dark:text-blue-400";
  const tabIdle =
    "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200";

  return (
    <div className="text-sm">
      {tabs.length > 1 ? (
        <div
          className={`flex flex-wrap gap-x-4 gap-y-1 border-b border-gray-200 dark:border-gray-800 mb-5 ${
            compact ? "gap-x-3" : ""
          }`}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`${tabBtn} ${compact ? "text-xs" : ""} ${
                active === t.id ? tabActive : tabIdle
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="min-h-[100px]">
        {active === "overview" && <TempleOverviewPanel temple={temple} />}
        {active === "lore" && <TempleLorePanel temple={temple} />}
        {active === "schedule" && <TempleSchedulePanel temple={temple} />}
        {active === "visit" && <TempleVisitPanel temple={temple} />}
        {active === "gallery" && <TempleGalleryPanel temple={temple} />}
      </div>
    </div>
  );
}

/**
 * @deprecated Use TempleTabbedDetail — kept as alias for older imports.
 */
export function TempleLongForm({ temple, showSubheading: _showSubheading }) {
  void _showSubheading;
  return <TempleTabbedDetail temple={temple} />;
}

/**
 * Compact temple summary for list cards / related links.
 * @param {{ temple: Record<string, unknown> }} props
 */
export function TempleSummaryCard({ temple }) {
  const tName = s(temple.nameEnglish) || s(temple.name) || "Temple";
  const tCity = s(temple.city) || s(temple.location);
  const tNote = s(temple.overview) || s(temple.significance);
  const tTamil = s(temple.nameTamil);
  const timings = s(temple.poojaTimings);
  const spec = s(temple.specialities);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
      <p className="font-medium text-gray-900 dark:text-white">{tName}</p>
      {tTamil ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">{tTamil}</p>
      ) : null}
      {tCity ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{tCity}</p>
      ) : null}
      {tNote ? (
        <p className="text-sm mt-2 leading-relaxed line-clamp-4">{tNote}</p>
      ) : null}
      {timings ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Timings:{" "}
          </span>
          {timings}
        </p>
      ) : null}
      {spec ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Specialities:{" "}
          </span>
          {spec}
        </p>
      ) : null}
    </div>
  );
}
