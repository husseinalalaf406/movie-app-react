import { useEffect, useState } from "react";
import Section from "./show";

const ActionMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=2efee2658584346c583ece1fb60886e0&with_genres=28&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        const actionMovies = data.results.map((movie) => ({
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: movie.title,
id:movie.id, 
             
          subtitle: movie.release_date,
          url: `/movie/${movie.id}`,
        }));
        setMovies(actionMovies);
      })
      .catch((err) => console.error(err));
  }, []);

  return <Section items={movies} />;
};

export default ActionMovies ;
