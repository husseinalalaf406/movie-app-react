import { useEffect, useState } from "react";
import Section from "./show";

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=2efee2658584346c583ece1fb60886e0`
    )
      .then((res) => res.json())
      .then((data) => {
        const trending = data.results.map((movie) => ({
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: movie.title,
          id: movie.id ,

          subtitle: movie.release_date,
          url: `/movie/${movie.id}`,
        }));
        setMovies(trending);
      })
      .catch((err) => console.error(err));
  }, []);

  return <Section items={movies} />;
};

export default TrendingMovies;
