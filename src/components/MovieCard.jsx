import React, { useState } from "react";
import MovieDetailModal from "./MovieDetailModal";
import StarRating from "./StarRating";

export default function MovieCard({ movie, onRateMovie }) {
  const [showModal, setShowModal] = useState(false);
  const [userRating, setUserRating] = useState(() => {
    const savedRatings = JSON.parse(localStorage.getItem("movieRatings")) || {};
    return savedRatings[movie.id] || 0;
  });

  const handleRating = (rating) => {
    setUserRating(rating);
    const savedRatings = JSON.parse(localStorage.getItem("movieRatings")) || {};
    savedRatings[movie.id] = rating;
    localStorage.setItem("movieRatings", JSON.stringify(savedRatings));

    if (onRateMovie) {
      onRateMovie(movie.id, rating);
    }
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300 overflow-hidden"
        onClick={() => setShowModal(true)}
      >
        <div className="relative">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-72 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x450?text=No+Image";
            }}
          />
          {movie.vote_average > 0 && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-semibold">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg dark:text-white truncate">
              {movie.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {movie.release_date?.slice(0, 4)}
            </span>
          </div>

          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <StarRating
              rating={userRating}
              onRate={handleRating}
              clickable={true}
              size={20}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genre_ids?.slice(0, 3).map((genreId) => (
              <span
                key={genreId}
                className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
              >
                Genre {genreId}
              </span>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>

      {showModal && (
        <MovieDetailModal
          movieId={movie.id}
          userRating={userRating}
          onRate={handleRating}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
