import React from "react";
import MovieCard from "./MovieCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { genreMap } from "../utils/genreMap";

export default function MovieList({
  movies,
  yearFilter,
  genreFilter,
  isLoading,
  onRateMovie,
}) {
  const filteredMovies = movies.filter((movie) => {
    const yearMatch =
      !yearFilter ||
      (movie.release_date && movie.release_date.includes(yearFilter));

    const genreMatch =
      !genreFilter ||
      genreFilter === "all" ||
      (movie.genre_ids &&
        movie.genre_ids.includes(genreMap[genreFilter.toLowerCase()]));

    return yearMatch && genreMatch;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filteredMovies.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          🎬 No movies found
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          {movies.length === 0
            ? "Try searching for a movie"
            : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onRateMovie={onRateMovie} />
      ))}
    </div>
  );
}
