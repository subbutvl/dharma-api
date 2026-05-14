import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../lib/api";

const RESOURCE = {
  slokas: { path: "/slokas", matchKey: "id" },
  temples: { path: "/temples", matchKey: "id" },
  avatars: { path: "/avatars", matchKey: "id" },
  songs: { path: "/songs", matchKey: "id" },
  festivals: { path: "/festivals", matchKey: "slug" },
};

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

function RecordDetail() {
  const { resource, param } = useParams();
  const cfg = RESOURCE[resource];
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (!cfg) {
    return <p className="text-red-600">Invalid resource.</p>;
  }

  const back = `/${resource}`;

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
          <Link to={back} className="hover:underline">
            ← Back
          </Link>
        </nav>
        <p className="text-red-600 dark:text-red-400">{error || "Not found"}</p>
      </div>
    );
  }

  const skip = new Set(["deity"]);
  const keys = Object.keys(row).filter((k) => !skip.has(k));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to={back} className="hover:underline">
          ← {resource}
        </Link>
      </nav>

      <header>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {row.title || row.name || row.slug || "Record"}
        </h1>
        {row.deity && typeof row.deity === "object" ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Deity:{" "}
            <Link
              to={`/deities/${row.deity.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {row.deity.name}
            </Link>
          </p>
        ) : null}
      </header>

      <dl className="border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-1 bg-white dark:bg-gray-950">
        {keys.map((k) => (
          <Field
            key={k}
            label={k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
          >
            {formatValue(row[k])}
          </Field>
        ))}
        {row.deity ? (
          <Field label="deity (object)">{formatValue(row.deity)}</Field>
        ) : null}
      </dl>
    </div>
  );
}

export default RecordDetail;
