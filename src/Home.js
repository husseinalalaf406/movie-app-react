import MoviesPage from "./Card";
import Hero from "./Hero";
import { useEffect, useState } from "react";

const Home = () => {
  const [heroImage, setHeroImage] = useState([]);

  useEffect(() => {
    // 🔥 fetch trending movie posters for Hero carousel when page loads
    fetch(`/.netlify/functions/tmdb?path=/trending/movie/week`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          const posters = data.results.map((movie) =>
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : ""
          );
          setHeroImage(posters);
        }
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
