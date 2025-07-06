import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const genres = [
    "all",
    "action",
    "adventure",
    "animation",
    "comedy",
    "crime",
    "documentary",
    "drama",
    "family",
    "fantasy",
    "history",
    "horror",
    "music",
    "mystery",
    "romance",
    "science fiction",
    "thriller",
    "war",
    "western",
  ];

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=f1070e485e007f9f83d9f971000e0f10&query=${
          query || "popular"
        }&include_adult=false`
      );
      const data = await res.json();
      if (data.results) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-center text-indigo-600 dark:text-indigo-400 py-4 drop-shadow-sm">
        🎬 Movie Review App
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 sm:p-6 mb-8 transition-all duration-300">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block"
            >
              Search by Title
            </label>
            <input
              id="search"
              type="text"
              placeholder="e.g. Inception"
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <div>
            <label
              htmlFor="year"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block"
            >
              Filter by Year
            </label>
            <input
              id="year"
              type="number"
              min="1900"
              max="2030"
              placeholder="e.g. 2020"
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label
              htmlFor="genre"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block"
            >
              Filter by Genre
            </label>
            <select
              id="genre"
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
            Loading movies...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Movie List */}
      {!isLoading && !error && (
        <div className="pb-12">
          <MovieList
            movies={movies}
            yearFilter={year}
            genreFilter={genre}
            isLoading={isLoading}
            onRateMovie={(movieId, rating) => {
              console.log(`Rated movie ${movieId} with ${rating} stars`);
            }}
          />
        </div>
      )}
    </div>
  );
}
