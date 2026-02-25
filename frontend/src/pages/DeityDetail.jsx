import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function DeityDetail() {
  const { slug } = useParams();
  const [deity, setDeity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/deities/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setDeity(data.data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-1/3"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!deity) return null;

  return (
    <div className="space-y-8">
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{deity.name}</span>
      </nav>

      {/* 🖼 Image Placeholder */}
      <div
        className="bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                rounded-2xl shadow-sm overflow-hidden
                transition-colors duration-300"
      >
        <div className="grid md:grid-cols-10 min-h-[400px]">
          {/* 🖼 LEFT – Image (NO PADDING) */}
          <div className="md:col-span-3 h-full">
            <div className="h-full w-full">
              <div
                className="h-full w-full 
                        bg-gray-200 dark:bg-gray-800
                        flex items-center justify-center
                        text-gray-400 dark:text-gray-600"
              >
                Image Placeholder
              </div>
            </div>
          </div>

          {/* 📄 RIGHT – Content Section (70%) */}
          <div className="md:col-span-7 p-6 md:p-8 space-y-6">
            {/* Name */}
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
                {deity.category.toUpperCase()}
              </span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-6">
                {[
                  "overview",
                  "worship",
                  "slokas",
                  "songs",
                  "videos",
                  "live",
                  "temples",
                ].map((tab) => (
                  <button
                    key={tab}
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

            {/* Tab Content */}
            <div className="text-gray-700 dark:text-gray-300">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <p className="leading-relaxed">{deity.description}</p>

                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Attributes
                      </h3>
                      <ul className="space-y-1">
                        <li>
                          <strong>Vehicle:</strong> {deity.attributes.vehicle}
                        </li>
                        <li>
                          <strong>Arms:</strong> {deity.attributes.arms}
                        </li>
                        <li>
                          <strong>Weapons:</strong>{" "}
                          {deity.attributes.weapons.join(", ")}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                        Relationships
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {deity.relationships.parents.map((parent) => (
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
                    {deity.worship.majorFestivals.join(", ")}
                  </p>
                  <p>
                    <strong>Mantra:</strong> {deity.worship.mantra || "N/A"}
                  </p>
                </div>
              )}

              {activeTab === "media" && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No media available yet.
                </div>
              )}

              {activeTab === "slokas" && (
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  {deity.worship.slokas?.length > 0 ? (
                    deity.worship.slokas.map((sloka, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <h4 className="font-semibold mb-2">{sloka.title}</h4>
                        <p className="text-sm leading-relaxed">{sloka.text}</p>
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
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  {deity.worship.temples?.length > 0 ? (
                    deity.worship.temples.map((temple, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <p className="font-medium">{temple.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {temple.location}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No temples listed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔗 Related Deities */}
      {deity.relationships.parents.length > 0 && (
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
