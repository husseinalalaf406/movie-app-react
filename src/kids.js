// KidsMovies.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./show";
import "./App.css"; // ⬅️ add this line

const KidsMovies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    const apiLang = i18n.language === 'ar' ? 'ar' : 'en-US';
    setError(null);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=2efee2658584346c583ece1fb60886e0&with_genres=16,10751&language=${apiLang}&page=1`
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
        const kidsMovies = data.results.map((m) => ({
          image: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: m.title,
          id:m.id,
          subtitle: m.release_date || "",
          url: `/movie/${m.id}`,
          // optional extras for badges:
          vote: m.vote_average?.toFixed(1) ?? null,
          age: "7+" // you can change per item if you have it
        }));
        setMovies(kidsMovies);
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

  return (
    <div className="kids-page">
      {/* we pass a className to override card styles just for kids page */}
      <Section
        items={movies}
        error={error}
        onRetry={handleRetry}
        className="kids-grid"
      />
    </div>
  );
};

export default KidsMovies;
