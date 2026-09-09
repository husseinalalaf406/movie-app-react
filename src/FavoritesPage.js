import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext";
import { useTranslation } from "react-i18next";
import MovieCard from "./MovieCard";
import IconBadge from "./IconBadge";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
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
              <IconBadge 
                icon={<FavoriteBorderOutlinedIcon sx={{ fontSize: 36 }} />} 
                size="large"
              />
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
              <MovieOutlinedIcon className="cta-icon-mui" />
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