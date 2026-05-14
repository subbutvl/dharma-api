import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJson } from "../lib/api";
import { TempleTabbedDetail } from "../components/TempleFields";

function DeityDetail() {
  const { slug } = useParams();
  const [deity, setDeity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!slug) return undefined;
    const ac = new AbortController();
    let alive = true;
    (async () => {
      await Promise.resolve();
      if (!alive || ac.signal.aborted) return;
      setLoading(true);
      setError(null);
      setDeity(null);
      try {
        const body = await fetchJson(`/deities/${encodeURIComponent(slug)}`, {
          signal: ac.signal,
        });
        if (!alive) return;
        const payload = body.data !== undefined ? body.data : body;
        if (!payload || !payload.slug)
          throw new Error("Invalid deity response");
        setDeity(payload);
      } catch (err) {
        if (!alive || err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      ac.abort();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link to="/deities" className="hover:underline">
            Home
          </Link>
        </nav>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link
          to="/deities"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to list
        </Link>
      </div>
    );
  }

  if (!deity) return null;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to="/deities" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{deity.name}</span>
      </nav>

      <div
        className="bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                rounded-2xl shadow-sm overflow-hidden
                transition-colors duration-300"
      >
        <div className="grid md:grid-cols-10 min-h-[400px]">
          <div className="md:col-span-3 h-full">
            <div className="h-full w-full min-h-[220px] md:min-h-0">
              {deity.primaryImageUrl ? (
                <img
                  src={deity.primaryImageUrl}
                  alt={deity.name}
                  className="h-full w-full object-cover min-h-[280px] md:min-h-[400px]"
                />
              ) : (
                <div
                  className="h-full w-full min-h-[280px] md:min-h-[400px]
                        bg-gray-200 dark:bg-gray-800
                        flex items-center justify-center
                        text-gray-400 dark:text-gray-600 text-sm px-4 text-center"
                >
                  Image Placeholder
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7 p-6 md:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {deity.name}
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mb-3">
                {deity.title}
              </p>

              <span
                className="inline-block text-xs font-medium px-3 py-1 rounded-full 
                         bg-blue-100 dark:bg-blue-900
                         text-blue-600 dark:text-blue-300"
              >
                {(deity.category || "deva").toUpperCase()}
              </span>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {[
                  "overview",
                  "worship",
                  "media",
                  "slokas",
                  "songs",
                  "videos",
                  "live",
                  "temples",
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium capitalize transition
                ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-gray-700 dark:text-gray-300">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <p className="leading-relaxed">{deity.description}</p>
                  {(deity.descriptionEn || deity.descriptionTa) && (
                    <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                      {deity.descriptionEn && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            English
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {deity.descriptionEn}
                          </p>
                        </div>
                      )}
                      {deity.descriptionTa && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Tamil
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {deity.descriptionTa}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    {(deity.affiliation || deity.abode) && (
                      <div className="sm:col-span-2">
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                          Lore
                        </h3>
                        <ul className="space-y-1">
                          {deity.affiliation && (
                            <li>
                              <strong>Affiliation:</strong> {deity.affiliation}
                            </li>
                          )}
                          {deity.abode && (
                            <li>
                              <strong>Abode:</strong> {deity.abode}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Attributes
                      </h3>
                      <ul className="space-y-1">
                        <li>
                          <strong>Vehicle:</strong>{" "}
                          {deity.attributes?.vehicle ?? "—"}
                        </li>
                        <li>
                          <strong>Arms:</strong> {deity.attributes?.arms ?? "—"}
                        </li>
                        <li>
                          <strong>Weapons:</strong>{" "}
                          {(deity.attributes?.weapons || []).join(", ") || "—"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Relationships
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(deity.relationships?.parents || []).map((parent) => (
                          <Link
                            key={parent}
                            to={`/deities/${parent}`}
                            className="px-2 py-1 text-xs rounded-md
                                 bg-gray-100 dark:bg-gray-800
                                 text-gray-700 dark:text-gray-300
                                 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            {parent}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "worship" && (
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Major Festivals:</strong>{" "}
                    {(deity.worship?.majorFestivals || []).join(", ") || "—"}
                  </p>
                  <p>
                    <strong>Mantra:</strong> {deity.worship?.mantra || "N/A"}
                  </p>
                </div>
              )}

              {activeTab === "media" && (
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  {deity.primaryImageUrl ? (
                    <img
                      src={deity.primaryImageUrl}
                      alt={deity.name}
                      className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No primary image yet.
                    </p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400">
                    Gallery and 3D assets will appear here when available.
                  </p>
                </div>
              )}

              {activeTab === "slokas" && (
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  {deity.worship?.slokas?.length > 0 ? (
                    deity.worship.slokas.map((sloka, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <h4 className="font-semibold mb-2">
                          {sloka.title || "Sloka"}
                        </h4>
                        {sloka.sanskrit && (
                          <p className="text-sm font-medium mb-1">
                            {sloka.sanskrit}
                          </p>
                        )}
                        {sloka.transliteration && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">
                            {sloka.transliteration}
                          </p>
                        )}
                        {sloka.meaning && (
                          <p className="text-sm leading-relaxed">
                            {sloka.meaning}
                          </p>
                        )}
                        {sloka.text && !sloka.sanskrit && (
                          <p className="text-sm leading-relaxed">
                            {sloka.text}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No slokas available.</p>
                  )}
                </div>
              )}

              {activeTab === "songs" && (
                <div className="text-gray-500 dark:text-gray-400">
                  No songs available yet.
                </div>
              )}

              {activeTab === "videos" && (
                <div className="text-gray-500 dark:text-gray-400">
                  No videos available yet.
                </div>
              )}

              {activeTab === "live" && (
                <div className="text-gray-500 dark:text-gray-400">
                  No live streams currently.
                </div>
              )}

              {activeTab === "temples" && (
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  {deity.worship?.temples?.length > 0 ? (
                    deity.worship.temples.map((temple, index) => {
                      const tName = temple.name ?? temple.nameEnglish;
                      const href =
                        temple.id != null
                          ? `/temples/${String(temple.id)}`
                          : null;
                      return (
                        <div
                          key={temple.id != null ? String(temple.id) : index}
                          className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-medium text-gray-900 dark:text-white text-base">
                              {tName}
                            </p>
                            {href ? (
                              <Link
                                to={href}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                              >
                                Full page →
                              </Link>
                            ) : null}
                          </div>
                          <TempleTabbedDetail temple={temple} compact />
                        </div>
                      );
                    })
                  ) : (
                    <p>No temples listed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {deity.relationships?.parents?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Related Deities
          </h2>

          <div className="flex gap-4 flex-wrap">
            {deity.relationships.parents.map((parent) => (
              <Link
                key={parent}
                to={`/deities/${parent}`}
                className="px-4 py-2 rounded-lg
                           bg-gray-100 dark:bg-gray-800
                           text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {parent}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeityDetail;
