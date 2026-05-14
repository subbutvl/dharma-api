import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { EXPLORE_KINDS } from "../config/explore";
import ExploreResourceCard from "../components/ExploreResourceCard";

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
      <div className="space-y-3 animate-pulse">
        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-xl" />
          <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;
  }

  return (
    <div>
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
        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 m-0">
          {cards.map((c) => (
            <li key={c.href} className="min-w-0">
              <ExploreResourceCard
                to={c.href}
                title={c.title}
                subtitle={c.subtitle}
                badge={c.badge}
                imageUrl={c.imageUrl}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExploreList;
