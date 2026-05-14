import { Link } from "react-router-dom";

function DeityCard({ deity }) {
  return (
    <Link to={`/deities/${deity.slug}`} className="block group">
      <div
        className="bg-white dark:bg-gray-900
                  border border-gray-200 dark:border-gray-800
                  shadow-sm rounded-xl overflow-hidden
                  hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 cursor-pointer
                  flex flex-col sm:flex-row min-h-[180px]"
      >
        <div className="sm:w-2/5 shrink-0 h-44 sm:h-auto sm:min-h-[200px]">
          {deity.primaryImageUrl ? (
            <img
              src={deity.primaryImageUrl}
              alt=""
              className="h-full w-full object-cover min-h-[176px] sm:min-h-[200px]"
            />
          ) : (
            <div
              className="h-full w-full min-h-[176px] sm:min-h-[200px]
                    bg-gray-200 dark:bg-gray-800
                    flex items-center justify-center
                    text-gray-400 dark:text-gray-600 text-xs px-3 text-center"
            >
              Image placeholder
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {deity.name}
          </h2>

          <span
            className="inline-block self-start text-xs font-medium px-2 py-1 rounded-full
                       bg-blue-100 dark:bg-blue-900
                       text-blue-600 dark:text-blue-300 mb-2"
          >
            {(deity.category || "deva").toUpperCase()}
          </span>

          {deity.title ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
              {deity.title}
            </p>
          ) : null}

          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
            {deity.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default DeityCard;
