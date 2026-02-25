import { Link } from "react-router-dom";

function DeityCard({ deity }) {
  return (
    <Link to={`/deities/${deity.slug}`}>
      <div
        className="bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800
                      shadow-sm rounded-xl p-6
                      hover:shadow-lg hover:-translate-y-1
                      transition-all duration-300 cursor-pointer"
      >
        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
          {deity.name}
        </h2>

        <span
          className="inline-block text-xs font-medium px-2 py-1 rounded-full 
                         bg-blue-100 dark:bg-blue-900
                         text-blue-600 dark:text-blue-300 mb-3"
        >
          {deity.category.toUpperCase()}
        </span>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {deity.title}
        </p>

        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {deity.description}
        </p>
      </div>
    </Link>
  );
}

export default DeityCard;
