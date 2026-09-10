import MoviesPage from "./Card";
import Hero from "./Hero";
import { useEffect, useState } from "react";
import Interests from "./interests";
const Home = () => {
  const [trending, setTrending] = useState([]);
  const [heroImage, setHeroImage] = useState([]);

  useEffect(() => {
    // 🔥 fetch trending movies when page loads
    fetch(
      `/api/tmdb/trending/movie/week`
    )
      .then((res) => res.json())
      .then((data) => {
        const movies = data.results.map((movie) => ({
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: movie.title,
          subtitle: movie.release_date,
          url: `/movie/${movie.id}`,
        }));
        setTrending(movies);
      })
      .catch((err) => console.error(err));
  }, []);

 useEffect(() => {
    // 🔥 fetch trending movies when page loads
    fetch(
      `/api/tmdb/trending/movie/week`
    )
      .then((res) => res.json())
      .then((data) => {
        const posters = data.results.map((movie) =>
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : ""
        );
        setHeroImage(posters);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Hero items={heroImage} gradientColor="black" />
      <div id="explore-movies-section" className="scroll-reveal">
        <MoviesPage />
      </div>
    </>
  );
};

export default Home;
