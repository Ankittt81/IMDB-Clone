import React, { useState } from "react";
import Modal from "react-modal";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⬇️ Use your actual API keys for local/dev use only.
const genAI = new GoogleGenerativeAI("AIzaSyCs8bXkSXY6jCpxAnt9JXkJ1bhSBpLbfq4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const TMDB_API_KEY = "bb26d7d1ea7067759a6efcc8b0b6d4e8";

// More flexible parser for Gemini results
const parseRecommendations = (text) => {
  const lines = text.split("\n").filter((line) => line.trim());
  const parsed = [];
  for (const line of lines) {
    // Try pattern: **Title:** summary. Reason: why.
    let match = line.match(/\*\*(.+?)\*\*:\s*([^\.]+)\.\s*Reason:\s*(.+)/i);
    if (match) {
      parsed.push({
        title: match[1].trim(),
        overview: match[2].trim(),
        reason: match[3].trim().replace(/\.$/, "") + ".",
      });
      continue;
    }
    // Try: **Title:** summary because reason.
    match = line.match(/\*\*(.+?)\*\*:\s*([^.]+)\.*\s*because\s*(.+)/i);
    if (match) {
      parsed.push({
        title: match[1].trim(),
        overview: match[2].trim(),
        reason: "Because " + match[3].trim().replace(/\.$/, "") + ".",
      });
      continue;
    }
    // Try unbolded Title: summary. Reason: why.
    match = line.match(/^([^:]+):\s*([^\.]+)\.\s*Reason:\s*(.+)/i);
    if (match) {
      parsed.push({
        title: match[1].trim(),
        overview: match[2].trim(),
        reason: match[3].trim().replace(/\.$/, "") + ".",
      });
      continue;
    }
    // Try unbolded Title: summary because reason.
    match = line.match(/^([^:]+):\s*([^.]+)\.*\s*because\s*(.+)/i);
    if (match) {
      parsed.push({
        title: match[1].trim(),
        overview: match[2].trim(),
        reason: "Because " + match[3].trim().replace(/\.$/, "") + ".",
      });
      continue;
    }
  }
  return parsed.slice(0, 5);
};

// Fetch poster/details from TMDB
const fetchMovieMeta = async (title) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}`
  );
  const data = await res.json();
  return data.results?.[0] || null;
};

function MovieRecommendationAI({ watchlist }) {
  const [recommendations, setRecommendations] = useState([]);
  const [metaMap, setMetaMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);

  const getRecommendations = async () => {
    if (!watchlist || watchlist.length === 0) {
      setError("Your watchlist is empty. Please add some movies first.");
      return;
    }
    setLoading(true);
    setError("");
    setRecommendations([]);
    setMetaMap({});

    const prompt = `
You are a movie recommendation engine.
The user has watched: ${watchlist.map((w) => w.title).join(", ")}.
Recommend 5 movies. For each, output one line formatted as:
**Movie Title:** short summary. Reason: why this matches the user's taste.
DO NOT use bullets or numbers. Only use this format for each movie.
`;

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const geminiText = result.response.text();
      console.log("Raw Gemini response:", geminiText); // See formatting

      const parsed = parseRecommendations(geminiText);
      setRecommendations(parsed);

      for (const rec of parsed) {
        const meta = await fetchMovieMeta(rec.title);
        setMetaMap((prev) => ({ ...prev, [rec.title]: meta }));
      }
      if (parsed.length === 0) {
        setError(
          "Could not parse recommendations. Try again or check your watchlist."
        );
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong while getting recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 px-4 w-full">
      <button
        onClick={getRecommendations}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-6 py-3 rounded hover:shadow-lg transition"
      >
        {loading ? "Thinking..." : "✨ Recommend 5 Movies"}
      </button>
      {error && (
        <div className="text-red-500 font-semibold mt-4 text-center">
          {error}
        </div>
      )}
      {!loading && recommendations.length === 0 && !error && (
        <div className="mt-4 text-center text-gray-500">
          Click the button above to get recommendations.
        </div>
      )}
      <div className="mt-6 flex gap-6 overflow-x-auto pb-4">
        {recommendations.map((rec, idx) => {
          const meta = metaMap[rec.title];
          const posterUrl = meta?.poster_path
            ? `https://image.tmdb.org/t/p/w300${meta.poster_path}`
            : "https://via.placeholder.com/220x330?text=No+Image";
          const isTruncated = rec.overview.length > 100;
          const shortText = isTruncated
            ? rec.overview.slice(0, 100) + "..."
            : rec.overview;

          return (
            <div
              key={idx}
              className="bg-white border shadow-md rounded-xl overflow-hidden flex-shrink-0"
              style={{ width: 220 }}
            >
              <div className="relative">
                <img
                  src={posterUrl}
                  alt={rec.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full px-2 py-1 backdrop-blur bg-black/60 text-white text-sm font-semibold text-center">
                  {rec.title}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-medium">
                {shortText}
                {isTruncated && (
                  <button
                    className="ml-2 underline text-xs"
                    onClick={() =>
                      setModalData({
                        ...rec,
                        posterUrl,
                      })
                    }
                  >
                    Read more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for full details */}
      {modalData && (
        <Modal
          isOpen={true}
          onRequestClose={() => setModalData(null)}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center px-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-gray-800">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl">{modalData.title}</h2>
              <button
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <img
              src={modalData.posterUrl}
              alt={modalData.title}
              className="rounded mt-4 mb-2 mx-auto w-40 shadow"
            />
            <p className="text-sm mb-2">{modalData.overview}</p>
            <p className="text-sm text-indigo-600 font-semibold">
              {modalData.reason}
            </p>
            <div className="text-center mt-4">
              <button
                onClick={() => setModalData(null)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MovieRecommendationAI;
