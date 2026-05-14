import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { EXPLORE_KINDS } from "../config/explore";

/**
 * @typedef {Record<string, unknown>} ListItem
 */

function ListRow({ title, subtitle, href, meta }) {
  return (
    <Link
      to={href}
      className="block border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3
                 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors"
    >
      <div className="flex justify-between gap-3 items-start">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {title}
          </p>
          {subtitle ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
              {subtitle}
            </p>
          ) : null}
        </div>
        {meta ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 font-mono">
            {meta}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function ExploreList() {
  const { kind } = useParams();
  const config = EXPLORE_KINDS[kind];
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [kindFilter, setKindFilter] = useState("");

  const cards = useMemo(() => {
    if (!config) return [];
    return items.map((item) => config.toCard(item));
  }, [config, items]);

  useEffect(() => {
    if (!config) return undefined;
    const ac = new AbortController();
    let alive = true;
    (async () => {
      await Promise.resolve();
      if (!alive || ac.signal.aborted) return;
      setLoading(true);
      setError(null);
      try {
        const { items: rows, meta: m } = await config.fetchList(
          {
            search: config.supportsSearch ? search : "",
            category: config.supportsCategory ? category : "all",
            kindFilter: config.supportsKindFilter ? kindFilter : "",
          },
          ac.signal,
        );
        if (!alive) return;
        setItems(rows);
        setMeta(m);
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
  }, [config, search, category, kindFilter]);

  if (!config) {
    return (
      <p className="text-red-600 dark:text-red-400">
        Unknown section.{" "}
        <Link to="/deities" className="underline">
          Deities
        </Link>
      </p>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3 animate-pulse">
        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-16 bg-gray-100 dark:bg-gray-900 rounded" />
        <div className="h-16 bg-gray-100 dark:bg-gray-900 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400 max-w-2xl mx-auto">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
        {config.listTitle}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {config.description}
      </p>

      {config.supportsSearch || config.supportsCategory ? (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {config.supportsSearch ? (
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 rounded-md border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-950 px-3 py-2 text-sm
                         text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          ) : null}
          {config.supportsCategory ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950
                         px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-40"
            >
              <option value="all">All categories</option>
              <option value="deva">Deva</option>
            </select>
          ) : null}
        </div>
      ) : null}

      {config.supportsKindFilter ? (
        <div className="mb-6">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Filter by kind (query param)
          </label>
          <input
            type="text"
            placeholder="e.g. asura, naga, yaksha — leave empty for all"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950
                       px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
      ) : null}

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {meta?.total != null
          ? `${meta.total} total · showing ${items.length}`
          : `${items.length} ${items.length === 1 ? "item" : "items"}`}
      </p>

      {cards.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nothing here yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {cards.map((c) => (
            <li key={c.href}>
              <ListRow {...c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExploreList;
