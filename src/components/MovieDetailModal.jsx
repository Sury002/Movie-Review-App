import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";

export default function MovieDetailModal({
  movieId,
  userRating,
  onRate,
  onClose,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=f1070e485e007f9f83d9f971000e0f10&append_to_response=credits`
        );
        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchDetails();
    }
  }, [movieId]);

  const formatRuntime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const topCast = details?.credits?.cast?.slice(0, 5) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-3xl font-light text-white dark:text-gray-300 z-50"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading movie details...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        ) : (
          details && (
            <>
              {/* Backdrop + Poster */}
              <div className="relative">
                {details.backdrop_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                    alt={details.title}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                )}
                <div className="absolute -bottom-8 left-4 flex items-end z-10">
                  {details.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                      alt={details.title}
                      className="w-20 h-28 sm:w-24 sm:h-36 rounded-md shadow-lg border-2 border-white dark:border-gray-800"
                    />
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 sm:p-6 mt-10">
                <div className="sm:ml-28">
                  <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">
                    {details.title}
                    <span className="text-gray-600 dark:text-gray-400 font-normal ml-2">
                      ({details.release_date?.slice(0, 4)})
                    </span>
                  </h2>

                  {/* Rating, Runtime, Genres */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {details.vote_average > 0 && (
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-semibold dark:text-white">
                          {details.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {details.runtime > 0 && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatRuntime(details.runtime)}
                      </span>
                    )}
                    {details.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {details.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Star Rating */}
                <div className="mt-6">
                  <div className="flex items-center gap-4">
                    <span className="font-medium dark:text-white">
                      Your Rating:
                    </span>
                    <StarRating
                      rating={userRating}
                      onRate={onRate}
                      clickable={true}
                      size={24}
                    />
                  </div>
                </div>

                {/* Overview */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold dark:text-white mb-2">
                    Overview
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {details.overview || "No overview available."}
                  </p>
                </div>

                {/* Cast */}
                {topCast.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold dark:text-white mb-2">
                      Top Cast
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {topCast.map((person) => (
                        <div key={person.cast_id} className="text-center">
                          <img
                            src={
                              person.profile_path
                                ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                                : "/person-placeholder.jpg"
                            }
                            alt={person.name}
                            className="w-full h-24 sm:h-32 object-cover rounded-md mb-2"
                            onError={(e) => {
                              e.target.src = "/person-placeholder.jpg";
                            }}
                          />
                          <p className="text-sm font-medium dark:text-white truncate">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {person.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
