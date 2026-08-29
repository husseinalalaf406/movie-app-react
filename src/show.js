import "./App.css";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MovieCard from "./MovieCard";
import ErrorDisplay from "./ErrorDisplay";

const Section = ({ items, error, onRetry }) => {
  const location = useLocation();
  const { t } = useTranslation();

  if (error) {
    return <ErrorDisplay type={error} onRetry={onRetry} />;
  }

  // Get localized header and subheader based on route
  let pageTitle = "";
  let pageSubtitle = "";

  const path = location.pathname.toLowerCase();
  if (path === "/trending") {
    pageTitle = t("trending");
    pageSubtitle = t("trendingSub");
  } else if (path === "/now-playing") {
    pageTitle = t("nowPlaying");
    pageSubtitle = t("nowPlayingSub");
  } else if (path === "/upcoming") {
    pageTitle = t("upcoming");
    pageSubtitle = t("upcomingSub");
  } else if (path === "/top-rated") {
    pageTitle = t("topRated");
    pageSubtitle = t("topRatedSub");
  } else if (path === "/tv") {
    pageTitle = t("tvShows");
    pageSubtitle = t("tvShowsSub");
  } else if (path === "/comedymovies") {
    pageTitle = t("comedy");
    pageSubtitle = t("comedySub");
  } else if (path === "/actionmovies") {
    pageTitle = t("action");
    pageSubtitle = t("actionSub");
  } else if (path === "/kids") {
    pageTitle = t("kids");
    pageSubtitle = t("kidsSub");
  } else if (path === "/interests") {
    pageTitle = t("interests");
    pageSubtitle = t("interestsSub");
  }

  return (
    <div className="section" id="movies-grid-section">
      <div className="category-header-block">
        <h2 className="section-title">{pageTitle}</h2>
        {pageSubtitle && <p className="section-subtitle">{pageSubtitle}</p>}
      </div>
      <div className="cards-wrapper">
        {items.length === 0 ? (
          Array.from({ length: 12 }).map((_, i) => (
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
            <MovieCard item={m} key={m.id || i} />
          ))
        )}
      </div>
    </div>
  );
};

export default Section;
