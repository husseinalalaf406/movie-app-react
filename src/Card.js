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
    const apiLang = i18n.language === 'ar' ? 'ar' : 'en-US';
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

  const isRtl = i18n.language === 'ar';

  // Reset scroll progress if language changes
  useEffect(() => {
    setProgress(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [i18n.language]);

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
    if (scrollWidth <= 0) {
      setProgress(100);
      return;
    }
    const currentScroll = Math.abs(el.scrollLeft);
    const newProgress = Math.min(100, Math.max(0, (currentScroll / scrollWidth) * 100));
    setProgress(newProgress);
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // In LTR: Left button scrolls back (disabled at start), Right button scrolls forward (disabled at end)
  // In RTL: Left button scrolls forward (disabled at end), Right button scrolls back (disabled at start)
  const isLeftDisabled = isRtl ? progress >= 99 : progress <= 1;
  const isRightDisabled = isRtl ? progress <= 1 : progress >= 99;

  const leftLabel = isRtl ? t("scrollNext", "Scroll forward") : t("scrollLeft", "Scroll left");
  const rightLabel = isRtl ? t("scrollPrev", "Scroll back") : t("scrollRight", "Scroll right");

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>

      <div className={`scroll-container ${progress <= 1 ? "at-start" : ""} ${progress >= 99 ? "at-end" : ""}`}>
        <button 
          className={`scroll-btn left ${isLeftDisabled ? "disabled" : ""}`} 
          onClick={scrollLeft}
          aria-label={leftLabel}
          disabled={isLeftDisabled}
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
          className={`scroll-btn right ${isRightDisabled ? "disabled" : ""}`} 
          onClick={scrollRight}
          aria-label={rightLabel}
          disabled={isRightDisabled}
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
  const [recommendations, setRecommendations] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const savedGenre = localStorage.getItem('preferred_genre');
    if (savedGenre) {
      const url = `/api/tmdb/discover/movie?with_genres=${savedGenre}&sort_by=popularity.desc&language=en-US&page=1`;
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
          url={`/api/tmdb/discover/movie?with_genres=${localStorage.getItem('preferred_genre')}&sort_by=popularity.desc&page=1`}
        />
      )}
      <Section
        title={t("popularTvShows")}
        url={`/api/tmdb/tv/popular?page=1`}
      />
      <Section
        title={t("kidsFamily")}
        url={`/api/tmdb/discover/movie?with_genres=16,10751&page=1`}
      />
      <Section
        title={t("topRatedMovies")}
        url={`/api/tmdb/movie/top_rated?page=1`}
      />
    </div>
  );
};

export default MoviesPage;