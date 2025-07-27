import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function MovieCard({ MovieObject }) {
  const { handleAddToWatchList, watchlist } = useContext(MovieContext);
  const inWatchlist = watchlist.some((m) => m.id === MovieObject.id);

  return (
    <div className="relative rounded-xl overflow-hidden shadow group w-48 bg-black">
      <img
        src={
          MovieObject.poster_path
            ? `https://image.tmdb.org/t/p/w300${MovieObject.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Image"
        }
        alt={MovieObject.title}
        title={MovieObject.title}
        className="w-full h-72 object-cover"
      />

      {/* Overlay Toolbar (hover) */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => handleAddToWatchList(MovieObject)}
          disabled={inWatchlist}
          title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          className={`rounded-full bg-green-600 p-2 text-white shadow ${
            inWatchlist ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          +
        </button>

        {/* ✅ HERE IS YOUR BUTTON */}
        <Link to={`/details/${MovieObject.id}`}>
          <button
            title="View Details"
            className="rounded-full bg-blue-600 p-2 text-white shadow hover:bg-blue-700"
          >
            ℹ️
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;
