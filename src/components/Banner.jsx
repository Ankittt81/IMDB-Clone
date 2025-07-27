import React, { useEffect, useState } from "react";

// ✅ Your TMDB API Key here
const TMDB_API_KEY = "bb26d7d1ea7067759a6efcc8b0b6d4e8";
const TMDB_API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`;

function Banner() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(TMDB_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setMovie(data.results[randomIndex]);
        } else {
          setError("No trending movies found.");
        }
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
        setError("Failed to load banner. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-gray-800 text-white text-xl">
        Loading Banner...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-red-800 text-white text-xl">
        {error}
      </div>
    );
  }

  if (!movie) {
    // This case should ideally be caught by error or loading, but as a safeguard:
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-gray-800 text-white text-xl">
        No movie data available for banner.
      </div>
    );
  }

  const imageUrl = movie.backdrop_path || movie.poster_path;
  const bannerUrl = imageUrl
    ? `https://image.tmdb.org/t/p/original${imageUrl}`
    : null;

  return (
    <div className="relative h-[85vh] w-full flex items-end overflow-hidden">
      {/* Background Image using <img> tag for better control with object-fit */}
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={movie.title || movie.name}
          className="absolute inset-0 w-full h-full object-cover object-top-bottom"
        />
      ) : (
        // Fallback if no image URL is available
        <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
          <p className="text-gray-500 text-xl">No Banner Image</p>
        </div>
      )}

      {/* Overlay Gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      {/* Movie Info - positioned relative to the banner, above the overlay */}
      <div className="relative z-10 p-6 md:p-10 text-white max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto md:mx-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-shadow-md">
          {movie.title || movie.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-200 line-clamp-4 text-shadow-sm">
          {movie.overview || "No description available."}
        </p>
        {/* Optional: Add a 'Watch Trailer' or 'More Info' button here */}
        <button className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300">
          Watch Trailer
        </button>
      </div>
    </div>
  );
}

export default Banner;
