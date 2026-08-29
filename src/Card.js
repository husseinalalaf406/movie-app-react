import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import MovieCard from "./MovieCard";
import "./App.css";

const Section = ({ title, url }) => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const apiLang = i18n.language === 'ar' ? 'ar-AE' : 'en-US';
    // Dynamically insert or replace the language query parameter in TMDB API calls
    let urlWithLang = url;
    if (url.includes('language=')) {
      urlWithLang = url.replace(/language=[a-zA-Z0-9-]+/g, `language=${apiLang}`);
    } else {
      urlWithLang = url.includes('?') ? `${url}&language=${apiLang}` : `${url}?language=${apiLang}`;
    }

    fetch(urlWithLang)
      .then((res) => res.json())
      .then((data) => {
        const results = data.results.map((m) => ({
          image: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: m.title || m.name,     
          id: m.id,
          subtitle: m.release_date || m.first_air_date || "",
          genre_ids: m.genre_ids || [],
          vote_average: m.vote_average,
        }));
        setItems(results);
      })
      .catch(console.error);
  }, [url, i18n.language]);

  const handleMovieClick = (movie) => {
    if (movie.genre_ids && movie.genre_ids.length > 0) {
      const favoriteGenre = movie.genre_ids[0];
      localStorage.setItem('preferred_genre', favoriteGenre);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollWidth = el.scrollWidth - el.clientWidth;
    const newProgress = (el.scrollLeft / scrollWidth) * 100;
    setProgress(newProgress);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>

      <div className={`scroll-container ${progress <= 1 ? "at-start" : ""} ${progress >= 99 ? "at-end" : ""}`}>
        <button 
          className={`scroll-btn left ${progress <= 1 ? "disabled" : ""}`} 
          onClick={scrollLeft}
          aria-label={t("scrollLeft", "Scroll left")}
          disabled={progress <= 1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-btn-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="scroll-wrapper" ref={scrollRef} onScroll={handleScroll}>
          {items.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="premium-movie-card skeleton-only" key={`skeleton-${i}`}>
                <div className="premium-card-poster-container skeleton-pulsing">
                  <div className="premium-card-skeleton" />
                </div>
                <div className="premium-card-details">
                  <div className="skeleton-text skeleton-title skeleton-pulsing" style={{ width: "80%" }} />
                  <div className="skeleton-text skeleton-meta skeleton-pulsing" style={{ width: "40%" }} />
                </div>
              </div>
            ))
          ) : (
            items.map((m, i) => (
              <MovieCard item={m} key={m.id || i} onClick={() => handleMovieClick(m)} />
            ))
          )}
        </div>

        <button 
          className={`scroll-btn right ${progress >= 99 ? "disabled" : ""}`} 
          onClick={scrollRight}
          aria-label={t("scrollRight", "Scroll right")}
          disabled={progress >= 99}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-btn-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="scroll-progress">
        <div
          className="scroll-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const MoviesPage = () => {
  const API_KEY = "2efee2658584346c583ece1fb60886e0";
  const [recommendations, setRecommendations] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const savedGenre = localStorage.getItem('preferred_genre');
    if (savedGenre) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${savedGenre}&sort_by=popularity.desc&language=en-US&page=1`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setRecommendations(data.results.slice(0, 4));
          }
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className="movies-page">
      {localStorage.getItem('preferred_genre') && (
        <Section
          title={t("basedOnInterests")}
          url={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${localStorage.getItem('preferred_genre')}&sort_by=popularity.desc&page=1`}
        />
      )}
      <Section
        title={t("popularTvShows")}
        url={`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=1`}
      />
      <Section
        title={t("kidsFamily")}
        url={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16,10751&page=1`}
      />
      <Section
        title={t("topRatedMovies")}
        url={`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`}
      />
    </div>
  );
};

export default MoviesPage;