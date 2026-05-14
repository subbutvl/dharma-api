import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../lib/api";

function Field({ label, children }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-2 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100 mt-0.5 whitespace-pre-wrap break-words">
        {children}
      </dd>
    </div>
  );
}

function formatValue(v) {
  if (v == null) return "—";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

function MythicalDetail() {
  const { slug } = useParams();
  const [row, setRow] = useState(null);
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
      try {
        const body = await fetchJson(
          `/mythical-beings/${encodeURIComponent(slug)}`,
          {
            signal: ac.signal,
          },
        );
        if (!alive) return;
        const data = body.data !== undefined ? body.data : body;
        setRow(data);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-40 bg-gray-100 dark:bg-gray-900 rounded" />
      </div>
    );
  }

  if (error || !row) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link to="/mythical-beings" className="hover:underline">
            ← Mythical beings
          </Link>
        </nav>
        <p className="text-red-600 dark:text-red-400">{error || "Not found"}</p>
      </div>
    );
  }

  const keys = Object.keys(row);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to="/mythical-beings" className="hover:underline">
          ← Mythical beings
        </Link>
      </nav>

      <header>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {row.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span className="font-mono">{row.slug}</span>
          {row.kind ? ` · ${row.kind}` : ""}
        </p>
      </header>

      {row.description ? (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {row.description}
        </p>
      ) : null}

      <dl className="border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-1 bg-white dark:bg-gray-950">
        {keys.map((k) => (
          <Field key={k} label={k}>
            {formatValue(row[k])}
          </Field>
        ))}
      </dl>
    </div>
  );
}

export default MythicalDetail;
