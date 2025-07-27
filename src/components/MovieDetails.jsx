import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ✅ Your TMDB API key
const TMDB_API_KEY = "bb26d7d1ea7067759a6efcc8b0b6d4e8";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const movieData = await movieRes.json();

        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}`
        );
        const videoData = await videoRes.json();

        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
        );
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setVideos(videoData.results);
        setCredits(creditsData);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err); // More specific error logging
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return <div className="text-white text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-20">{error}</div>;
  if (!movie)
    return <div className="text-white text-center py-20">Movie not found.</div>;

  // ✅ Banner image fallback logic
  const getBannerImage = () => {
    // Prioritize backdrop_path for banners as it's typically wider
    if (movie.backdrop_path) {
      return `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    }
    // Fallback to poster_path if no backdrop (though it might be less suitable for a wide banner)
    else if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    }
    // Final fallback to a generic placeholder if no image paths are available
    else {
      return "https://via.placeholder.com/1280x720?text=No+Banner+Image+Available";
    }
  };

  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // Debugging: Log the generated banner image URL
  // console.log("Banner Image URL:", getBannerImage());

  return (
    <div className="w-full bg-gray-900 text-white">
      {/* ✅ Banner Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url('${getBannerImage()}')`, // Ensured quotes around URL
          // Added a fallback background color in case image fails to load
          backgroundColor: "#1a202c",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
          {movie.tagline && (
            <p className="italic text-lg text-gray-300 mb-4">{movie.tagline}</p>
          )}

          {trailer ? (
            <a
              // ✅ CORRECTED YOUTUBE TRAILER URL
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium"
            >
              ▶ Watch Trailer
            </a>
          ) : (
            <button className="bg-gray-600 px-6 py-3 rounded" disabled>
              Trailer Not Available
            </button>
          )}
        </div>
      </div>

      {/* ✅ Main layout: Poster + Info section with responsive fix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ✅ Movie Poster */}
        <div>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="rounded w-full shadow-lg"
          />
        </div>

        {/* ✅ Right Column: Details section spans 2 columns */}
        <div className="lg:col-span-2 space-y-6 w-full">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300">
              {movie.overview || "No description available."}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Movie Info</h3>
            <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-gray-300">
              <li>
                <span className="text-white font-semibold">Release Date:</span>{" "}
                {movie.release_date}
              </li>
              <li>
                <span className="text-white font-semibold">Runtime:</span>{" "}
                {movie.runtime} min
              </li>
              <li>
                <span className="text-white font-semibold">Rating:</span>{" "}
                {movie.vote_average?.toFixed(1)} ★ {/* Format rating */}
              </li>
              <li>
                <span className="text-white font-semibold">Popularity:</span>{" "}
                {Math.round(movie.popularity)}
              </li>
              {movie.revenue !== 0 && (
                <li>
                  <span className="text-white font-semibold">Box Office:</span>{" "}
                  ${movie.revenue.toLocaleString()}
                </li>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <li>
                  <span className="text-white font-semibold">Genres:</span>{" "}
                  {movie.genres.map((g) => g.name).join(", ")}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Top Cast</h3>
            <div className="flex overflow-x-auto gap-4 py-2">
              {credits?.cast?.slice(0, 10).map((actor) => (
                <div key={actor.cast_id} className="w-24 shrink-0 text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://via.placeholder.com/100x150?text=No+Image"
                    }
                    alt={actor.name}
                    className="rounded mb-1 h-32 w-full object-cover"
                  />
                  <p className="text-sm">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
