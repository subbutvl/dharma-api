import { useEffect, useState } from "react";
import DeityCard from "../components/DeityCard";

function Home() {
  const [deities, setDeities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/deities`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch deities");
        }
        return res.json();
      })
      .then((data) => {
        setDeities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 🔎 Filtering Logic
  const filteredDeities = deities.filter((deity) => {
    const matchesSearch =
      deity.name.toLowerCase().includes(search.toLowerCase()) ||
      deity.alternateNames.some((name) =>
        name.toLowerCase().includes(search.toLowerCase()),
      );

    const matchesCategory = category === "all" || deity.category === category;

    return matchesSearch && matchesCategory;
  });

  // 🔄 Loading Skeleton
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl p-6 shadow animate-pulse"
          >
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        Explore Deities
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {filteredDeities.length} result
        {filteredDeities.length !== 1 && "s"} found
      </p>
      {/* 🔍 Search + Filter Controls */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-2/3">
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300">
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
               focus:border-blue-500 dark:focus:border-blue-400 transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                   focus:border-blue-500 dark:focus:border-blue-400 transition cursor-pointer"
            >
              <option value="all" className="text-gray-900 dark:text-gray-100">
                All Categories
              </option>
              <option value="deva" className="text-gray-900 dark:text-gray-100">
                Deva
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 📦 Deity Grid */}
      {filteredDeities.length === 0 ? (
        <p className="text-gray-500">No deities found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDeities.map((deity) => (
            <DeityCard key={deity.id} deity={deity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
