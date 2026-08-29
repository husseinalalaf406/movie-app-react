import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "./context/GlobalContext";
import ErrorDisplay from "./ErrorDisplay";
import MovieCard from "./MovieCard";
import "./App.css"; 

const Movies = () => {
  const { id } = useParams();
  const [moviesDetails, setMoviesDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [castLoading, setCastLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { t, i18n } = useTranslation();

  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const carouselRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const { addMovieToWatchlist, removeMovieFromWatchlist, watchlist } = useGlobalContext();

  const storedMovie = watchlist.find((o) => o.id == id);
  const isFavorite = storedMovie ? true : false;

  useEffect(() => {
    const apiLang = i18n.language === 'ar' ? 'ar-AE' : 'en-US';
    setLoading(true);
    setError(null);
    setCastLoading(true);
    setTrailerLoading(true);
    setSimilarLoading(true);
    setReviewsLoading(true);
    setReviewsPage(1);
    setExpandedReviews({});
    setIframeLoaded(false);
    setIsOverviewExpanded(false);

    if (!navigator.onLine) {
      setError("offline");
      setLoading(false);
      setCastLoading(false);
      setTrailerLoading(false);
      setSimilarLoading(false);
      setReviewsLoading(false);
      return;
    }
    
    // Fetch details
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("404");
          } else {
            throw new Error("api");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          setError("404");
        } else {
          setMoviesDetails(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "404") {
          setError("404");
        } else if (err.message === "api") {
          setError("api");
        } else {
          setError("network");
        }
      })
      .finally(() => setLoading(false));

    // Fetch credits (cast)
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.cast) {
          setCast(data.cast.slice(0, 10));
        }
      })
      .catch((err) => console.error("Error fetching cast:", err))
      .finally(() => setCastLoading(false));

    // Fetch videos (trailer)
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.results) {
          const trailer = data.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer");
          if (trailer) {
            setTrailerKey(trailer.key);
          } else {
            setTrailerKey(null);
          }
        } else {
          setTrailerKey(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching trailer:", err);
        setTrailerKey(null);
      })
      .finally(() => setTrailerLoading(false));

    // Fetch similar movies
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.results) {
          // Slice top 12 similar movies
          setSimilarMovies(data.results.slice(0, 12));
        } else {
          setSimilarMovies([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching similar movies:", err);
        setSimilarMovies([]);
      })
      .finally(() => setSimilarLoading(false));

    // Fetch reviews (no language restriction, fallback to standard or English is natural)
    fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=2efee2658584346c583ece1fb60886e0`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.results) {
          setReviews(data.results);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      })
      .finally(() => setReviewsLoading(false));
  }, [id, i18n.language, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("unknown");
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", options);
    } catch (e) {
      return dateString;
    }
  };

  const getLanguageName = (code) => {
    if (!code) return t("unknown");
    const languages = {
      en: i18n.language === "ar" ? "الإنجليزية" : "English",
      ar: i18n.language === "ar" ? "العربية" : "Arabic",
      fr: i18n.language === "ar" ? "الفرنسية" : "French",
      es: i18n.language === "ar" ? "الإسبانية" : "Spanish",
      de: i18n.language === "ar" ? "الألمانية" : "German",
      it: i18n.language === "ar" ? "الإيطالية" : "Italian",
      ja: i18n.language === "ar" ? "اليابانية" : "Japanese",
      ko: i18n.language === "ar" ? "الكورية" : "Korean",
      zh: i18n.language === "ar" ? "الصينية" : "Chinese",
      ru: i18n.language === "ar" ? "الروسية" : "Russian",
      hi: i18n.language === "ar" ? "الهندية" : "Hindi",
      tr: i18n.language === "ar" ? "التركية" : "Turkish"
    };
    return languages[code.toLowerCase()] || code.toUpperCase();
  };

  const formatCurrency = (amount) => {
    if (!amount) return t("unknown");
    return new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    if (avatarPath.startsWith("/http")) return avatarPath.substring(1);
    return `https://image.tmdb.org/t/p/w150_and_h150_face${avatarPath}`;
  };

  const toggleExpandReview = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const scrollToTrailer = () => {
    const element = document.getElementById("movie-trailer-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const checkScrollLimits = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const currentScroll = Math.abs(scrollLeft);
      const maxScroll = scrollWidth - clientWidth;
      
      setAtStart(currentScroll < 15);
      setAtEnd(currentScroll >= maxScroll - 15);
    }
  };

  useEffect(() => {
    setAtStart(true);
    setAtEnd(false);
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollLimits();
    }, 300);
    return () => clearTimeout(timer);
  }, [similarMovies]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const clientWidth = carouselRef.current.clientWidth;
      const scrollAmount = clientWidth * 0.75;
      const finalAmount = direction === "left" ? -scrollAmount : scrollAmount;
      
      carouselRef.current.scrollBy({
        left: finalAmount,
        behavior: "smooth"
      });
    }
  };

  const reviewsPerPage = 3;
  const totalReviews = reviews.length;
  const totalReviewPages = Math.ceil(totalReviews / reviewsPerPage);

  const getPagedReviews = () => {
    const startIndex = (reviewsPage - 1) * reviewsPerPage;
    return reviews.slice(startIndex, startIndex + reviewsPerPage);
  };

  const handlePrevPage = () => {
    if (reviewsPage > 1) {
      setReviewsPage((prev) => prev - 1);
      const element = document.getElementById("movie-reviews-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNextPage = () => {
    if (reviewsPage < totalReviewPages) {
      setReviewsPage((prev) => prev + 1);
      const element = document.getElementById("movie-reviews-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (error) {
    return <ErrorDisplay type={error} onRetry={handleRetry} />;
  }

  return (
    <div className="details-page animate-on-load">
      {/* Cinematic Backdrop Banner Section */}
      <div className="details-hero-banner">
        {moviesDetails ? (
          <>
            {moviesDetails.backdrop_path ? (
              <div 
                className="details-hero-backdrop" 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${moviesDetails.backdrop_path})` }}
              />
            ) : (
              <div className="details-hero-backdrop-placeholder" />
            )}
            <div className="details-hero-overlay" />
          </>
        ) : (
          <div className="details-hero-skeleton">
            <div className="details-hero-skeleton-overlay" />
          </div>
        )}
      </div>

      {/* Overlapping Content Container outside the clipping banner */}
      {moviesDetails ? (
        <div className="details-hero-container">
          <div className="details-poster">
            {moviesDetails.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500/${moviesDetails.poster_path}`}
                alt={moviesDetails.title || moviesDetails.original_title}
              />
            ) : (
              <div className="no-poster">{t("noPoster")}</div>
            )}
          </div>

          <div className="details-content">
            {/* Metadata Badges Container */}
            <div className="details-meta-badges">
              {/* 1. Year Badge */}
              {moviesDetails.release_date && (
                <div className="premium-metadata-badge badge-year">
                  <span className="badge-value">{moviesDetails.release_date.split("-")[0]}</span>
                </div>
              )}

              {/* 2. IMDb Rating Badge */}
              {moviesDetails.vote_average !== undefined && (
                <div className="premium-metadata-badge badge-rating">
                  <span className="star-icon">★</span>
                  <span className="badge-value">{moviesDetails.vote_average?.toFixed(1)}</span>
                </div>
              )}

              {/* 3. Runtime Badge */}
              {moviesDetails.runtime !== undefined && (
                <div className="premium-metadata-badge badge-runtime">
                  <span className="clock-icon">🕒</span>
                  <span className="badge-value">{moviesDetails.runtime} {t("minutes")}</span>
                </div>
              )}

              {/* 4. Genre Badges (Desktop/Tablet only) */}
              {moviesDetails.genres && moviesDetails.genres.map((genre) => (
                <div key={genre.id} className="premium-metadata-badge badge-genre desktop-only-genre">
                  <span className="badge-value">{genre.name}</span>
                </div>
              ))}
            </div>

            {/* Mobile Genre Chips (Hidden on desktop, visible on mobile) */}
            {moviesDetails.genres && moviesDetails.genres.length > 0 && (
              <div className="details-mobile-genres">
                {moviesDetails.genres.map((genre) => (
                  <span key={genre.id} className="mobile-genre-pill">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* 5. Title */}
            <h1 className="movie-title">{moviesDetails.title || moviesDetails.original_title}</h1>
            
            {/* 6. Tagline */}
            <span className="details-hero-tagline">
              {moviesDetails.tagline || (i18n.language === "ar" ? "العرض السينمائي المميز" : "FEATURED PRESENTATION")}
            </span>

            {/* 7. Overview */}
            <div className="overview-section">
              <h3 className="section-header elegant-title">
                {t("overview")}
              </h3>
              <p className={`overview-text ${isOverviewExpanded ? "expanded" : "collapsed"}`}>
                {moviesDetails.overview}
              </p>
              {moviesDetails.overview && moviesDetails.overview.length > 150 && (
                <button 
                  className="overview-read-more-btn"
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                >
                  {isOverviewExpanded ? t("readLess") : t("readMore")}
                  {isOverviewExpanded ? " ↑" : " ↓"}
                </button>
              )}
            </div>

            {/* 8. Buttons */}
            <div className="action-buttons">
              {trailerKey && (
                <button
                  className="btn-action btn-primary-trailer"
                  onClick={scrollToTrailer}
                >
                  <span className="btn-icon play-icon">▶</span>
                  <span className="btn-text">{t("watchTrailer")}</span>
                </button>
              )}

              <button
                className={`btn-action btn-secondary-favorite ${isFavorite ? "favorite-active" : ""}`}
                onClick={() => {
                  if (isFavorite) {
                    removeMovieFromWatchlist(moviesDetails.id);
                  } else {
                    addMovieToWatchlist(moviesDetails);
                  }
                }}
              >
                <span className="btn-icon heart-icon">{isFavorite ? "♥" : "♡"}</span>
                <span className="btn-text">{isFavorite ? t("removeFavorites") : t("addFavorites")}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="details-hero-skeleton-container">
          <div className="details-skeleton-poster skeleton-pulsing" style={{ borderRadius: "12px" }} />
          <div className="details-skeleton-content">
            {/* Badges row skeleton */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }} className="skeleton-badges-row">
              <div className="skeleton-text skeleton-pulsing" style={{ height: "32px", width: "70px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton-text skeleton-pulsing" style={{ height: "32px", width: "80px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton-text skeleton-pulsing" style={{ height: "32px", width: "110px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton-text skeleton-pulsing" style={{ height: "32px", width: "90px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton-text skeleton-pulsing" style={{ height: "32px", width: "85px", borderRadius: "12px", background: "rgba(255,255,255,0.1)" }} />
            </div>
            
            {/* Title skeleton */}
            <div className="skeleton-text skeleton-pulsing skeleton-title-el" style={{ height: "48px", width: "75%", borderRadius: "8px", marginBottom: "12px", background: "rgba(255,255,255,0.12)" }} />
            
            {/* Tagline skeleton */}
            <div className="skeleton-text skeleton-pulsing skeleton-tagline-el" style={{ height: "16px", width: "40%", borderRadius: "4px", marginBottom: "25px", background: "rgba(255,255,255,0.1)" }} />
            
            {/* Overview skeleton */}
            <div className="skeleton-text skeleton-pulsing skeleton-overview-el" style={{ height: "20px", width: "100%", marginBottom: "12px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }} />
            <div className="skeleton-text skeleton-pulsing skeleton-overview-el" style={{ height: "20px", width: "95%", marginBottom: "12px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }} />
            <div className="skeleton-text skeleton-pulsing skeleton-overview-el" style={{ height: "20px", width: "85%", marginBottom: "35px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }} />
            
            {/* Action buttons skeleton */}
            <div className="skeleton-action-buttons">
              <div className="skeleton-text skeleton-pulsing skeleton-btn" />
              <div className="skeleton-text skeleton-pulsing skeleton-btn" />
            </div>
          </div>
        </div>
      )}

      {/* Movie Facts Section */}
      <div className="movie-facts-section">
        <h3 className="section-header elegant-title">
          <span className="trailer-title-icon">📊</span>
          {t("movieFacts")}
        </h3>
        
        {moviesDetails ? (
          <div className="facts-grid">
            {/* 1. Runtime */}
            <div className="fact-card">
              <div className="fact-icon-container runtime-icon">⏱️</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("runtimeLabel")}</span>
                <span className="fact-value">
                  {moviesDetails.runtime ? `${moviesDetails.runtime} ${t("minutes")}` : t("unknown")}
                </span>
              </div>
            </div>

            {/* 2. Release Date */}
            <div className="fact-card">
              <div className="fact-icon-container release-icon">📅</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("releaseDate").replace(":", "")}</span>
                <span className="fact-value">{formatDate(moviesDetails.release_date)}</span>
              </div>
            </div>

            {/* 3. Original Language */}
            <div className="fact-card">
              <div className="fact-icon-container language-icon">🌐</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("originalLanguage")}</span>
                <span className="fact-value">{getLanguageName(moviesDetails.original_language)}</span>
              </div>
            </div>

            {/* 4. Country */}
            <div className="fact-card">
              <div className="fact-icon-container country-icon">📍</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("country")}</span>
                <span className="fact-value">
                  {moviesDetails.production_countries && moviesDetails.production_countries.length > 0
                    ? moviesDetails.production_countries.map((c) => c.name).join(", ")
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 5. Production Companies */}
            <div className="fact-card">
              <div className="fact-icon-container companies-icon">🏢</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("productionCompanies")}</span>
                <span className="fact-value">
                  {moviesDetails.production_companies && moviesDetails.production_companies.length > 0
                    ? moviesDetails.production_companies.map((c) => c.name).join(", ")
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 6. Budget */}
            <div className="fact-card">
              <div className="fact-icon-container budget-icon">💰</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("budget")}</span>
                <span className="fact-value">{formatCurrency(moviesDetails.budget)}</span>
              </div>
            </div>

            {/* 7. Revenue */}
            <div className="fact-card">
              <div className="fact-icon-container revenue-icon">📈</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("revenue")}</span>
                <span className="fact-value">{formatCurrency(moviesDetails.revenue)}</span>
              </div>
            </div>

            {/* 8. Popularity */}
            <div className="fact-card">
              <div className="fact-icon-container popularity-icon">🔥</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("popularity")}</span>
                <span className="fact-value">
                  {moviesDetails.popularity
                    ? new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 1 }).format(moviesDetails.popularity)
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 9. Vote Count */}
            <div className="fact-card">
              <div className="fact-icon-container votes-icon">🗳️</div>
              <div className="fact-text-container">
                <span className="fact-title">{t("voteCount")}</span>
                <span className="fact-value">
                  {moviesDetails.vote_count
                    ? new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-US").format(moviesDetails.vote_count)
                    : t("unknown")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="facts-grid">
            {[...Array(9)].map((_, idx) => (
              <div className="fact-card" key={`fact-sk-${idx}`}>
                <div className="fact-icon-container skeleton-pulsing" style={{ border: "none", background: "rgba(255,255,255,0.08)" }} />
                <div className="fact-text-container" style={{ width: "100%" }}>
                  <div className="skeleton-pulsing" style={{ height: "12px", width: "50%", borderRadius: "4px", marginBottom: "8px" }} />
                  <div className="skeleton-pulsing" style={{ height: "16px", width: "80%", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cast Section */}
      <div className="cast-section">
        <h3 className="section-header elegant-title">{t("cast")}</h3>
        {castLoading ? (
          <div className="cast-list">
            {[...Array(6)].map((_, idx) => (
              <div className="cast-card skeleton-cast" key={idx}>
                <div className="cast-photo-wrapper skeleton-pulsing" style={{ border: 'none', background: 'rgba(255,255,255,0.08)' }} />
                <div className="skeleton-pulsing" style={{ height: '14px', width: '80px', borderRadius: '4px', margin: '8px auto 4px' }} />
                <div className="skeleton-pulsing" style={{ height: '11px', width: '60px', borderRadius: '4px', margin: '4px auto' }} />
              </div>
            ))}
          </div>
        ) : cast && cast.length > 0 ? (
          <div className="cast-list">
            {cast.map((actor) => (
              <div className="cast-card" key={actor.id}>
                <div className="cast-photo-wrapper">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185/${actor.profile_path}`}
                      alt={actor.name}
                      className="cast-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="cast-photo-placeholder">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="cast-info">
                  <h4 className="cast-name">{actor.name}</h4>
                  <p className="cast-character">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-cast-text">{i18n.language === "ar" ? "معلومات طاقم العمل غير متوفرة." : "Cast information not available."}</p>
        )}
      </div>

      {/* Trailer Section */}
      <div className="trailer-section" id="movie-trailer-section">
        <h3 className="section-header elegant-title">
          <span className="trailer-title-icon">🎬</span>
          {t("trailer")}
        </h3>
        {trailerLoading ? (
          <div className="responsive-trailer-wrapper skeleton-pulsing">
            <div className="trailer-skeleton-play-btn" />
          </div>
        ) : trailerKey ? (
          <div className="responsive-trailer-wrapper">
            {!iframeLoaded && (
              <div className="trailer-skeleton-container absolute-loader skeleton-pulsing">
                <div className="trailer-skeleton-play-btn" />
              </div>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>
        ) : (
          <div className="trailer-not-available">
            <div className="no-trailer-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="not-available-svg">
                <path d="M2 2L22 22" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 5.26L16.32 9L19.5 10.87C20.17 11.26 20.17 12.23 19.5 12.61L18 13.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.3 5.3C5.7 5.6 5.3 6.2 5.3 6.9V17.1C5.3 17.8 6.1 18.2 6.7 17.9L13 14.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>{t("trailerNotAvailable")}</h4>
            <p>
              {i18n.language === "ar"
                ? "نأسف، لا يوجد عرض دعائي متوفر لهذا العمل حالياً."
                : "We're sorry, there is no official trailer available for this movie right now."}
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" id="movie-reviews-section">
        <h3 className="section-header elegant-title">
          <span className="trailer-title-icon">💬</span>
          {t("reviews")}
        </h3>

        {reviewsLoading ? (
          <div className="reviews-container">
            {[...Array(2)].map((_, idx) => (
              <div className="review-card" key={`review-sk-${idx}`}>
                <div className="review-header">
                  <div className="review-author-info">
                    <div className="skeleton-review-avatar skeleton-pulsing" />
                    <div className="review-author-details" style={{ width: "120px" }}>
                      <div className="skeleton-pulsing" style={{ height: "14px", width: "80%", borderRadius: "4px", marginBottom: "6px" }} />
                      <div className="skeleton-pulsing" style={{ height: "11px", width: "60%", borderRadius: "4px" }} />
                    </div>
                  </div>
                  <div className="skeleton-pulsing" style={{ height: "24px", width: "60px", borderRadius: "12px" }} />
                </div>
                <div className="review-content-wrapper">
                  <div className="skeleton-pulsing" style={{ height: "14px", width: "100%", borderRadius: "4px", marginBottom: "8px" }} />
                  <div className="skeleton-pulsing" style={{ height: "14px", width: "95%", borderRadius: "4px", marginBottom: "8px" }} />
                  <div className="skeleton-pulsing" style={{ height: "14px", width: "70%", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <>
            <div className="reviews-container">
              {getPagedReviews().map((review) => {
                const avatarUrl = getAvatarUrl(review.author_details?.avatar_path);
                const isExpanded = !!expandedReviews[review.id];
                const isLongText = review.content && review.content.length > 300;
                const displayedText = isLongText && !isExpanded 
                  ? review.content.slice(0, 300) + "..." 
                  : review.content;

                return (
                  <div className="review-card" key={review.id}>
                    <div className="review-header">
                      <div className="review-author-info">
                        <div className="review-avatar-wrapper">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={review.author} 
                              className="review-avatar"
                              loading="lazy"
                            />
                          ) : (
                            <div className="review-avatar-placeholder">
                              {review.author ? review.author.charAt(0) : "U"}
                            </div>
                          )}
                        </div>
                        <div className="review-author-details">
                          <span className="review-username">{review.author}</span>
                          <span className="review-date">{formatDate(review.created_at)}</span>
                        </div>
                      </div>

                      {review.author_details?.rating != null && (
                        <div className="review-rating-badge">
                          <span className="review-rating-star">⭐</span>
                          <span>{review.author_details.rating}/10</span>
                        </div>
                      )}
                    </div>

                    <div className="review-content-wrapper">
                      <p className="review-text">
                        {displayedText}
                      </p>
                      {isLongText && (
                        <button 
                          className="read-more-btn"
                          onClick={() => toggleExpandReview(review.id)}
                        >
                          {isExpanded ? t("readLess") : t("readMore")}
                          {isExpanded ? " ↑" : " ↓"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalReviewPages > 1 && (
              <div className="reviews-pagination">
                <button 
                  className="pagination-btn"
                  onClick={handlePrevPage}
                  disabled={reviewsPage === 1}
                >
                  <span style={{ transform: i18n.language === "ar" ? "rotate(180deg)" : "none", display: "inline-block" }}>←</span>
                  {t("previous")}
                </button>
                <span className="pagination-info">
                  {t("pageOf", { current: reviewsPage, total: totalReviewPages })}
                </span>
                <button 
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={reviewsPage === totalReviewPages}
                >
                  {t("next")}
                  <span style={{ transform: i18n.language === "ar" ? "rotate(180deg)" : "none", display: "inline-block" }}>→</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="no-cast-text">
            {t("noReviews")}
          </p>
        )}
      </div>

      {/* Similar Movies Section */}
      <div className="similar-movies-section">
        <h3 className="section-header elegant-title">
          <span className="trailer-title-icon">🍿</span>
          {t("similarMovies")}
        </h3>
        
        {similarLoading ? (
          <div className="recommendations-grid">
            {[...Array(12)].map((_, idx) => (
              <div 
                className="premium-movie-card skeleton-only" 
                key={`similar-sk-${idx}`}
              >
                <div className="premium-card-poster-container skeleton-pulsing" style={{ aspectRatio: "2/3", borderRadius: "12px", background: "rgba(255,255,255,0.08)" }} />
                <div className="skeleton-pulsing" style={{ height: "16px", width: "80%", borderRadius: "4px", marginTop: "12px" }} />
                <div className="skeleton-pulsing" style={{ height: "12px", width: "50%", borderRadius: "4px", marginTop: "6px" }} />
              </div>
            ))}
          </div>
        ) : similarMovies && similarMovies.length > 0 ? (
          <div className="recommendations-grid">
            {similarMovies.slice(0, 12).map((movie) => (
              <MovieCard 
                key={movie.id} 
                item={movie} 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
              />
            ))}
          </div>
        ) : (
          <p className="no-cast-text">
            {i18n.language === "ar" 
              ? "لا توجد أفلام مشابهة متاحة حالياً." 
              : "No similar movies available right now."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Movies;
