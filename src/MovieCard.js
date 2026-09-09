import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext";
import { useTranslation } from "react-i18next";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function MovieCard({ item, onClick }) {
  const { watchlist, addMovieToWatchlist, removeMovieFromWatchlist } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  // Normalize movie fields to handle both mapped and unmapped data
  const id = item.id;
  const title = item.title || item.name || item.original_title || "Unknown Title";
  const subtitle = item.subtitle || item.release_date || item.first_air_date || "";
  const year = subtitle ? subtitle.toString().substring(0, 4) : "";
  const rawRating = item.vote_average || item.rating || 7.5;
  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : "7.5";

  let image = item.image;
  if (!image) {
    image = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";
  }

  // Check if this movie is already in the favorites/watchlist list
  const isFavorite = watchlist.some((movie) => movie.id === id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeMovieFromWatchlist(id);
    } else {
      // Normalize item to the schema stored in FavoritesPage/watchlist
      const movieToSave = {
        id: id,
        title: title,
        name: title,
        poster_path: item.poster_path || (item.image ? item.image.replace("https://image.tmdb.org/t/p/w500", "") : ""),
        vote_average: rawRating,
        release_date: item.release_date || item.subtitle || "",
      };
      addMovieToWatchlist(movieToSave);
    }
  };

  const handleWatchTrailer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTrailerModal(true);
    setIsLoadingTrailer(true);

    const apiLang = i18n.language === "ar" ? "ar" : "en-US";
    try {
      let foundTrailerKey = null;

      // 1. Try fetching movie videos first
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=${apiLang}`
      );
      if (movieRes.ok) {
        const data = await movieRes.json();
        const trailer = data.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        ) || data.results?.find(
          (vid) => vid.site === "YouTube"
        );
        if (trailer) foundTrailerKey = trailer.key;
      }

      // 2. If no movie trailer in Arabic, fallback to English movie videos
      if (!foundTrailerKey && apiLang !== "en-US") {
        const enMovieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        if (enMovieRes.ok) {
          const enData = await enMovieRes.json();
          const trailer = enData.results?.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          ) || enData.results?.find(
            (vid) => vid.site === "YouTube"
          );
          if (trailer) foundTrailerKey = trailer.key;
        }
      }

      // 3. If no movie trailer, try fetching TV videos
      if (!foundTrailerKey) {
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=${apiLang}`
        );
        if (tvRes.ok) {
          const data = await tvRes.json();
          const trailer = data.results?.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          ) || data.results?.find(
            (vid) => vid.site === "YouTube"
          );
          if (trailer) foundTrailerKey = trailer.key;
        }
      }

      // 4. Fallback for TV videos in English
      if (!foundTrailerKey && apiLang !== "en-US") {
        const enTvRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        if (enTvRes.ok) {
          const data = await enTvRes.json();
          const trailer = data.results?.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          ) || data.results?.find(
            (vid) => vid.site === "YouTube"
          );
          if (trailer) foundTrailerKey = trailer.key;
        }
      }

      setTrailerKey(foundTrailerKey);
    } catch (err) {
      console.error("Failed to fetch trailer key:", err);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <>
      <div className="premium-movie-card">
        <Link to={`/movie/${id}`} onClick={onClick} className="premium-card-link">
          {/* Main Poster Area */}
          <div className="premium-card-poster-container">
            {/* Loading skeleton wrapper */}
            {!isLoaded && <div className="premium-card-skeleton" />}

            <img
              src={image}
              alt={title}
              className={`premium-card-poster ${isLoaded ? "loaded" : "loading"}`}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://dummyimage.com/500x750/1c1c1e/ffffff.png&text=No+Image+Found";
                setIsLoaded(true);
              }}
              loading="lazy"
            />

            {/* Glowing Gradient Border/Vignette Overlay */}
            <div className="premium-card-glow-overlay" />

            {/* Interactive Animated Favorite Toggle Button */}
            <button
              className={`premium-card-fav-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? t("removeFavorites") : t("addFavorites")}
            >
              {isFavorite ? (
                <FavoriteOutlinedIcon className="card-fav-icon" />
              ) : (
                <FavoriteBorderOutlinedIcon className="card-fav-icon" />
              )}
            </button>

            {/* IMDb and Rating Badges (top-left) */}
            <div className="premium-card-badges">
              <span className="premium-card-imdb">IMDb</span>
              <span className="premium-card-rating">{rating}</span>
            </div>

            {/* Slide-Up Cinematic Hover Overlay with Glassmorphism */}
            <div className="premium-card-overlay">
              <div className="premium-card-overlay-inner">
                {/* Watch Trailer CTA */}
                <button className="premium-card-play-btn" onClick={handleWatchTrailer}>
                  <PlayArrowOutlinedIcon className="play-triangle-mui" />
                  <span className="btn-text">{t("watchTrailer") || "Watch Trailer"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Elegant Movie Details/Typography Block */}
          <div className="premium-card-details">
            <h3 className="premium-card-title" title={title}>
              {title}
            </h3>
            <div className="premium-card-meta">
              {year && <span className="premium-card-year">{year}</span>}
              <span className="premium-card-dot">•</span>
              <span className="premium-card-star-small">★ {rating}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Cinematic Modal Player Overlay */}
      {showTrailerModal && (
        <div
          className="premium-trailer-modal-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setShowTrailerModal(false);
          }}
        >
          <div className="premium-trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="premium-trailer-modal-close" onClick={() => setShowTrailerModal(false)} aria-label="Close trailer">
              <CloseOutlinedIcon className="modal-close-icon-mui" />
            </button>
            {isLoadingTrailer ? (
              <div className="premium-video-wrapper skeleton-pulsing" style={{ minHeight: "315px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                <div className="trailer-skeleton-play-btn" />
              </div>
            ) : trailerKey ? (
              <div className="premium-video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="premium-trailer-status-box">
                <p>
                  ⚠️{" "}
                  {i18n.language === "ar"
                    ? "عذراً، لم نتمكن من العثور على عرض دعائي لهذا الفيلم."
                    : "Sorry, no trailer available for this movie."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
