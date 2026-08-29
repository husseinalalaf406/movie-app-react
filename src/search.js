import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

const Search = ({ searchResults, searchText, searchLoading }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const titleText = searchText 
    ? `${t("searchResults")}: "${searchText}"` 
    : isRtl ? "استكشف محتوى نت موفيز" : "Explore NetMovies";

  // Category chips to display in empty / default states
  const shortcutCategories = [
    { name: t("trending") || "Trending", path: "/trending", emoji: "🔥" },
    { name: t("topRated") || "Top Rated", path: "/top-rated", emoji: "⭐" },
    { name: t("tvShows") || "TV Shows", path: "/tv", emoji: "📺" },
    { name: t("comedy") || "Comedy", path: "/ComedyMovies", emoji: "😂" },
    { name: t("action") || "Action", path: "/ActionMovies", emoji: "⚔️" },
    { name: t("kids") || "Kids", path: "/kids", emoji: "🎈" },
  ];

  return (
    <div className="section search-page-container">
      <div className="search-header-block">
        <h2 className="section-title search-results-title">{titleText}</h2>
        {searchText && searchLoading && (
          <div className="search-status-badge">
            <span className="search-pulsing-dot"></span>
            {isRtl ? "جاري البحث..." : "Searching..."}
          </div>
        )}
      </div>

      {searchLoading ? (
        <div className="search-loading-wrapper">
          <div className="search-loading-bar-container">
            <div className="search-loading-bar-glowing"></div>
          </div>
          <div className="cards-wrapper">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="premium-movie-card skeleton-only" key={index}>
                <div className="premium-card-poster-container">
                  <div className="premium-card-skeleton" />
                </div>
                <div className="premium-card-details">
                  <div className="skeleton-line title" style={{ height: "16px", width: "80%", background: "rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "8px" }}></div>
                  <div className="skeleton-line meta" style={{ height: "12px", width: "50%", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="cards-wrapper">
          {searchResults.map((movie, i) => (
            <MovieCard item={movie} key={movie.id || i} />
          ))}
        </div>
      ) : (
        <div className="premium-empty-state-wrapper">
          <div className="premium-empty-state-card search-empty-state-elevated">
            <div className="premium-empty-state-icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="premium-empty-state-svg search-glowing">
                <defs>
                  <linearGradient id="search-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#25eb81" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
                <circle cx="11" cy="11" r="7" stroke="url(#search-grad)" strokeWidth="1.5" />
                <path d="M20 20l-3-3" stroke="url(#search-grad)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 11h6" stroke="#25eb81" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <circle cx="11" cy="11" r="3" fill="#25eb81" opacity="0.1" />
              </svg>
            </div>
            
            <h3 className="premium-empty-state-title">
              {searchText 
                ? (isRtl ? `لم نجد أي نتائج لـ "${searchText}"` : `No matches found for "${searchText}"`)
                : (isRtl ? "ما الذي ترغب بمشاهدته اليوم؟" : "What are you in the mood to watch today?")
              }
            </h3>
            
            <p className="premium-empty-state-subtitle">
              {searchText 
                ? (isRtl 
                    ? "تأكد من كتابة الكلمات بشكل صحيح، أو جرب كلمات مفتاحية أخرى، أو تصفح الأقسام المميزة المتاحة أدناه." 
                    : "Double-check the spelling, search for alternative titles, or start exploring our popular curated categories below."
                  )
                : (isRtl 
                    ? "اكتب اسم فيلم، أو تصنيف رائج لتجد سهرتك المفضلة، أو تصفح مجموعتنا المختارة."
                    : "Type a movie name, a genre, or tap on any of our popular curated collections to discover outstanding cinema."
                  )
              }
            </p>

            <div className="premium-empty-state-suggestions-section">
              <h4 className="premium-suggestions-title">
                {isRtl ? "تصفح الأقسام والروابط السريعة" : "Curated Suggestions & Quick Links"}
              </h4>
              <div className="premium-suggestions-grid">
                {shortcutCategories.map((cat, idx) => (
                  <Link to={cat.path} key={idx} className="premium-suggestion-chip">
                    <span className="premium-chip-emoji">{cat.emoji}</span>
                    <span className="premium-chip-name">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
