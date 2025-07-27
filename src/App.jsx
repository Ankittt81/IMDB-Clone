import Navbar from "./components/Navbar";
import "./App.css";
import Banner from "./components/Banner";
import Watchlist from "./components/Watchlist";
import MovieRecommendationAI from "./components/MovieRecommendationAI";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./components/Movies";
import { useEffect, useState } from "react";
import { MovieContext } from "./components/MovieContext";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import MovieDetails from "./components/MovieDetails";

function AppContent() {
  const { isDark } = useTheme();
  const [watchlist, setWatchlist] = useState([]);

  const handleAddToWatchList = (movieObj) => {
    let updatedWatchList = [...watchlist, movieObj];
    setWatchlist(updatedWatchList);
    localStorage.setItem("movies", JSON.stringify(updatedWatchList));
  };

  // const handleRemoveFromWatchList = (movieObj) => {
  //   let updatedWatchList = watchlist.filter(
  //     (movie) => movie.id !== movieObj.id
  //   );
  //   setWatchlist(updatedWatchList);
  //   localStorage.setItem("movies", JSON.stringify(updatedWatchList));
  // };

  useEffect(() => {
    let moviesFormLs = localStorage.getItem("movies");
    if (!moviesFormLs) {
      return;
    }
    setWatchlist(JSON.parse(moviesFormLs));
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <MovieContext.Provider value={{ handleAddToWatchList, watchlist }}>
        <BrowserRouter>
          <Navbar />
          <div className="space-y-10 flex flex-wrap">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Banner />
                    <Movies />
                  </>
                }
              />
              <Route
                path="/Watchlist"
                element={<Watchlist watchlist={watchlist} />}
              />
              <Route
                path="/Recommend"
                element={<MovieRecommendationAI watchlist={watchlist} />}
              />
              <Route path="/details/:id" element={<MovieDetails />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MovieContext.Provider>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
