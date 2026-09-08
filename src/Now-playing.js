import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./show";

const NowPlayingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    const apiLang = i18n.language === 'ar' ? 'ar' : 'en-US';
    setError(null);
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}&page=1`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("api");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.results) {
          throw new Error("api");
        }
        const nowPlaying = data.results.map((movie) => ({
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: movie.title,
          id:movie.id,
          subtitle: movie.release_date,
          url: `/movie/${movie.id}`,
        }));
        setMovies(nowPlaying);
      })
      .catch((err) => {
        console.error(err);
        if (!navigator.onLine) {
          setError("offline");
        } else {
          setError("network");
        }
      });
  }, [i18n.language, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return <Section items={movies} error={error} onRetry={handleRetry} />;
};

export default NowPlayingMovies;
