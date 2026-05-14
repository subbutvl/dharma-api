import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { EXPLORE_KINDS } from "../config/explore";

const NAV_ORDER = [
  "deities",
  "slokas",
  "temples",
  "avatars",
  "songs",
  "festivals",
  "mythical-beings",
];

function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/deities"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              🕉 Dharma API
            </Link>
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="sm:hidden text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {NAV_ORDER.map((key) => (
              <NavLink
                key={key}
                to={`/${key}`}
                className={({ isActive }) =>
                  [
                    "transition-colors",
                    isActive
                      ? "text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white -mb-px pb-px"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
                  ].join(" ")
                }
              >
                {EXPLORE_KINDS[key]?.label || key}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="hidden sm:block text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shrink-0"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
