import { useEffect, useState } from "react";
import DeityCard from "../components/DeityCard";
import { fetchJson } from "../lib/api";

function Home() {
  const [deities, setDeities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const ac = new AbortController();
    let alive = true;
    (async () => {
      await Promise.resolve();
      if (!alive || ac.signal.aborted) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("limit", "100");
        params.set("page", "1");
        if (search.trim()) params.set("q", search.trim());
        if (category !== "all") params.set("category", category);
        const body = await fetchJson(`/deities?${params.toString()}`, {
          signal: ac.signal,
        });
        if (!alive) return;
        setDeities(Array.isArray(body.data) ? body.data : []);
        setMeta(body.meta || null);
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
  }, [search, category]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow animate-pulse border border-gray-200 dark:border-gray-800"
          >
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        Explore Deities
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {meta?.total != null
          ? `${meta.total} total`
          : `${deities.length} result${deities.length !== 1 ? "s" : ""}`}{" "}
        {meta?.total != null && `(showing ${deities.length} on this page)`}
      </p>
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-2/3">
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name or alternate names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
               bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 dark:focus:border-blue-400 transition
               text-gray-900 dark:text-white placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="w-full md:w-1/3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                   focus:border-blue-500 dark:focus:border-blue-400 transition cursor-pointer
                   text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="deva">Deva</option>
            </select>
          </div>
        </div>
      </div>

      {deities.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No deities found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {deities.map((deity) => (
            <DeityCard key={deity.slug} deity={deity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
