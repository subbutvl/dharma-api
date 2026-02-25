import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            🕉 Dharma API
          </Link>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg 
                       bg-gray-200 dark:bg-gray-800
                       text-gray-900 dark:text-white
                       hover:opacity-80 transition"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
