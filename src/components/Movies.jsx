import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import Pagination from "./Pagination";
function Movies() {
  // creating state for movies data
  const [movies, Setmovies] = useState([]);
  // creating state for pagination
  const [page, Setpage] = useState(1);
//   console.log(movies);
  // pagination next
  const handleNext = () => {
    Setpage(page + 1);
  };
  // pagination previous
  const handlePrevious = () => {
    if (page > 1) {
      Setpage(page - 1);
    }
  };
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=bb26d7d1ea7067759a6efcc8b0b6d4e8&language=en-US&page=${page}`
      )
      .then((response) => {
        Setmovies(response.data.results);
      })
      .catch((err) => {
        console.log(err + "Cannot fetch API Data");
      });
  }, [page]);
  return (
    <div>
      <div className="flex justify-evenly flex-wrap gap-8">
        {movies.map((MovieObj) => (
          <MovieCard MovieObject={MovieObj}/>
        ))}
      </div>
      <Pagination
        PageNumber={page}
        Previousfn={handlePrevious}
        Nextfn={handleNext}
      />
    </div>
  );
}

export default Movies;
