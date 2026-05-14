import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJson } from "../lib/api";

function Section({ title, children }) {
  return (
    <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-950">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DeityDetail() {
  const { slug } = useParams();
  const [deity, setDeity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="max-w-2xl mx-auto animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link to="/deities" className="hover:underline">
            ← Deities
          </Link>
        </nav>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!deity) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to="/deities" className="hover:underline">
          ← Deities
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{deity.name}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {deity.name}
        </h1>
        {deity.title ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {deity.title}
          </p>
        ) : null}
        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          {(deity.category || "deva").toUpperCase()}
        </span>
      </header>

      <Section title="Overview">
        {deity.description ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {deity.description}
          </p>
        ) : (
          <p className="text-sm text-gray-500">—</p>
        )}
        {(deity.descriptionEn || deity.descriptionTa) && (
          <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
            {deity.descriptionEn && (
              <div>
                <p className="text-xs text-gray-500 mb-1">English</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {deity.descriptionEn}
                </p>
              </div>
            )}
            {deity.descriptionTa && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Tamil</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {deity.descriptionTa}
                </p>
              </div>
            )}
          </div>
        )}
        {(deity.affiliation || deity.abode) && (
          <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {deity.affiliation && (
              <li>
                <span className="text-gray-500">Affiliation:</span>{" "}
                {deity.affiliation}
              </li>
            )}
            {deity.abode && (
              <li>
                <span className="text-gray-500">Abode:</span> {deity.abode}
              </li>
            )}
          </ul>
        )}
      </Section>

      <Section title="Attributes">
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>Vehicle: {deity.attributes?.vehicle ?? "—"}</li>
          <li>Arms: {deity.attributes?.arms ?? "—"}</li>
          <li>
            Weapons: {(deity.attributes?.weapons || []).join(", ") || "—"}
          </li>
        </ul>
      </Section>

      <Section title="Relationships">
        <div className="flex flex-wrap gap-2">
          {(deity.relationships?.parents || []).length ? (
            (deity.relationships.parents || []).map((parent) => (
              <Link
                key={parent}
                to={`/deities/${parent}`}
                className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:underline"
              >
                {parent}
              </Link>
            ))
          ) : (
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      </Section>

      <Section title="Worship">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Festivals: {(deity.worship?.majorFestivals || []).join(", ") || "—"}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          Mantra: {deity.worship?.mantra || "—"}
        </p>
      </Section>

      <Section title="Slokas">
        {deity.worship?.slokas?.length > 0 ? (
          <ul className="space-y-3">
            {deity.worship.slokas.map((sloka, index) => (
              <li
                key={index}
                className="text-sm border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {sloka.title || "Sloka"}
                </p>
                {sloka.sanskrit && (
                  <p className="text-gray-800 dark:text-gray-200 mt-1">
                    {sloka.sanskrit}
                  </p>
                )}
                {sloka.transliteration && (
                  <p className="text-xs text-gray-500 italic mt-0.5">
                    {sloka.transliteration}
                  </p>
                )}
                {sloka.meaning && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {sloka.meaning}
                  </p>
                )}
                {sloka.text && !sloka.sanskrit && (
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {sloka.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No slokas.</p>
        )}
      </Section>

      <Section title="Temples">
        {deity.worship?.temples?.length > 0 ? (
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {deity.worship.temples.map((temple, index) => (
              <li key={index}>
                <span className="font-medium text-gray-900 dark:text-white">
                  {temple.name}
                </span>
                {temple.location ? (
                  <span className="text-gray-500"> · {temple.location}</span>
                ) : null}
                {temple.significance && (
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                    {temple.significance}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No temples listed.</p>
        )}
      </Section>

      {deity.primaryImageUrl ? (
        <Section title="Image">
          <img
            src={deity.primaryImageUrl}
            alt={deity.name}
            className="max-w-full rounded-md border border-gray-200 dark:border-gray-800"
          />
        </Section>
      ) : null}
    </div>
  );
}

export default DeityDetail;
