import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext";
import { useTranslation } from "react-i18next";
import MovieCard from "./MovieCard";
import "./App.css"; 

const FavoritesPage = () => {
  const { watchlist } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div className="movies-page" style={{ padding: "20px" }}>
      <h2 className="section-title">{t("myFavorites")}</h2>

      {watchlist.length === 0 ? (
        <div className="premium-empty-state-wrapper">
          <div className="premium-empty-state-card">
            <div className="premium-empty-state-icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="premium-empty-state-svg heart-glowing">
                <defs>
                  <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#25eb81" />
                    <stop offset="100%" stopColor="#18a055" />
                  </linearGradient>
                </defs>
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  fill="url(#heart-grad)" 
                  opacity="0.15" 
                />
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  stroke="url(#heart-grad)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <polygon points="10 8 16 12 10 16 10 8" fill="#25eb81" />
              </svg>
            </div>
            
            <h3 className="premium-empty-state-title">
              {isRtl ? "شاشتك المفضلة فارغة حالياً" : "Your Cinemafiles is Empty"}
            </h3>
            
            <p className="premium-empty-state-subtitle">
              {t("noFavoritesText")}
            </p>
            
            <p className="premium-empty-state-description">
              {isRtl 
                ? "انقر على أيقونة القلب في أي ملصق فيلم لحفظه في هذه القائمة، حتى تتمكن من العثور على اختياراتك المفضلة وسهراتك بسهولة تامة."
                : "Tap the heart icon on any movie poster to add it to your watchlist. Build your ultimate digital library and never lose track of a great title again."}
            </p>
            
            <Link to="/" className="premium-empty-state-cta">
              <span className="cta-icon">🎬</span>
              <span className="cta-text">{t("exploreMovies")}</span>
            </Link>
          </div>
        </div>
      ) : (


        <div className="cards-wrapper">
          {watchlist.map((movie) => (
            <MovieCard item={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;