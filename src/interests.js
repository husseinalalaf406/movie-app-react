import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./show";
import "./App.css";

const Interests = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem('preferred_genre') || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const API_KEY = "2efee2658584346c583ece1fb60886e0";

  const genres = [
    { id: "28", name: isRtl ? "أكشن" : "Action", emoji: "⚔️", color: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.4)" },
    { id: "35", name: isRtl ? "كوميدي" : "Comedy", emoji: "😂", color: "rgba(234, 179, 8, 0.08)", border: "rgba(234, 179, 8, 0.4)" },
    { id: "18", name: isRtl ? "دراما" : "Drama", emoji: "🎭", color: "rgba(168, 85, 247, 0.08)", border: "rgba(168, 85, 247, 0.4)" },
    { id: "878", name: isRtl ? "خيال علمي" : "Sci-Fi", emoji: "🚀", color: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.4)" },
    { id: "10749", name: isRtl ? "رومانسي" : "Romance", emoji: "💖", color: "rgba(236, 72, 153, 0.08)", border: "rgba(236, 72, 153, 0.4)" },
    { id: "9648", name: isRtl ? "غموض" : "Mystery", emoji: "🔍", color: "rgba(14, 165, 233, 0.08)", border: "rgba(14, 165, 233, 0.4)" },
  ];

  const fetchMoviesByGenre = (genreId) => {
    setLoading(true);
    setError(null);
    const apiLang = i18n.language === 'ar' ? 'ar-AE' : 'en-US';
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=${apiLang}&page=1`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("api");
        }
        return res.json();
      })
      .then((data) => {
        if (data.results) {
          const formatted = data.results.slice(0, 12).map((movie) => ({
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image",
            title: movie.title,
            id: movie.id,
            subtitle: movie.release_date,
            url: `/movie/${movie.id}`,
          }));
          setMovies(formatted);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!navigator.onLine) {
          setError("offline");
        } else {
          setError("network");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre);
    }
  }, [selectedGenre, i18n.language, retryCount]);

  const handleSelectGenre = (genreId) => {
    localStorage.setItem('preferred_genre', genreId);
    setSelectedGenre(genreId);
  };

  const handleReset = () => {
    localStorage.removeItem('preferred_genre');
    setSelectedGenre("");
    setMovies([]);
  };

  if (!selectedGenre) {
    return (
      <div className="movies-page" style={{ padding: "40px 20px" }}>
        <div className="premium-empty-state-wrapper">
          <div className="premium-empty-state-card interests-empty-card">
            <div className="premium-empty-state-icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="premium-empty-state-svg interests-glowing">
                <defs>
                  <linearGradient id="interests-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#25eb81" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="url(#interests-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#interests-grad)" fillOpacity="0.1" />
                <path d="M12 2v15.77" stroke="url(#interests-grad)" strokeWidth="1.5" opacity="0.3" />
              </svg>
            </div>

            <h3 className="premium-empty-state-title">
              {isRtl ? "اكتشف بصمتك السينمائية المفضلة" : "Define Your Cinematic Signature"}
            </h3>

            <p className="premium-empty-state-subtitle">
              {isRtl 
                ? "اختر تصنيفك المفضّل أدناه وسيقوم محرك البحث والتنسيق لدينا ببناء صالة عرض سينمائية مخصصة لك بالكامل."
                : "Select your favorite genre below and our personalized curation engine will compile a tailored showcase of masterworks."}
            </p>

            <div className="genre-selection-grid">
              {genres.map((g) => (
                <button
                  key={g.id}
                  className="genre-select-btn"
                  onClick={() => handleSelectGenre(g.id)}
                  style={{
                    backgroundColor: g.color,
                    borderColor: g.border
                  }}
                >
                  <span className="genre-btn-emoji">{g.emoji}</span>
                  <span className="genre-btn-name">{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="interests-header-actions">
        <button onClick={handleReset} className="interests-change-btn">
          <span className="gear-icon">⚙️</span> {isRtl ? "تعديل الاهتمامات" : "Change Preferences"}
        </button>
      </div>
      <Section items={loading ? [] : movies} error={error} onRetry={() => setRetryCount((p) => p + 1)} />
    </div>
  );
};

export default Interests;
