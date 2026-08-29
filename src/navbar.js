import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext";
import { useTranslation } from "react-i18next";
import "./App.css";

const Navbar = ({ searchText, setSearchText, searchLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useGlobalContext();
  const { t, i18n } = useTranslation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Premium AI Search additional state
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isTabletSearchFocused, setIsTabletSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recent-searches") || "[]");
      setRecentSearches(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setRecentSearches([]);
    }
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || term.trim() === "") return;
    const trimmed = term.trim();
    const updated = [trimmed, ...recentSearches.filter(x => x !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  // Track page scroll to apply dynamic styling to sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close menu and dropdowns when changing page location
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const upateSearchText = (e) => {
    const value = e.target.value;
    setSearchText(value);
    // Only redirect to search if not already on the search page
    if (location.pathname !== "/search" && value.trim() !== "") {
      navigate("/search");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (searchText.trim() !== "") {
      saveRecentSearch(searchText.trim());
      navigate("/search");
      setIsSearchFocused(false);
      setIsTabletSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  }

  const handleSelectTerm = (term) => {
    setSearchText(term);
    saveRecentSearch(term);
    navigate("/search");
    setIsSearchFocused(false);
    setIsTabletSearchFocused(false);
    setIsMobileSearchFocused(false);
  };

  const handleDeleteTerm = (term, e) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = recentSearches.filter(x => x !== term);
    setRecentSearches(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  const handleClearAllTerms = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches([]);
    localStorage.setItem("recent-searches", JSON.stringify([]));
  };

  const popularSearches = i18n.language === "ar"
    ? ["أكشن", "كوميديا", "خيال علمي", "دراما", "مسلسلات"]
    : ["Inception", "Interstellar", "Batman", "Avengers", "Titanic"];

  const browseDropdownItems = [
    { title: t("trending"), subtitle: t("trendingSub"), path: "/trending" },
    { title: t("nowPlaying"), subtitle: t("nowPlayingSub"), path: "/now-playing" },
    { title: t("upcoming"), subtitle: t("upcomingSub"), path: "/upcoming" },
    { title: t("topRated"), subtitle: t("topRatedSub"), path: "/top-rated" },
    { title: t("tvShows"), subtitle: t("tvShowsSub"), path: "/tv" },
  ];

  const genresDropdownItems = [
    { title: t("comedy"), subtitle: t("comedySub"), path: "/ComedyMovies" },
    { title: t("action"), subtitle: t("actionSub"), path: "/ActionMovies" },
    { title: t("kids"), subtitle: t("kidsSub"), path: "/kids" },
    { title: t("interests"), subtitle: t("interestsSub"), path: "/Interests" },
  ];

  const handleDropdownToggle = (name, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close dropdowns when clicking anywhere else
  useEffect(() => {
    const handleCloseAll = () => setOpenDropdown(null);
    window.addEventListener("click", handleCloseAll);
    return () => window.removeEventListener("click", handleCloseAll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const renderSearchDropdown = (focused, setFocused) => {
    if (!focused) return null;

    return (
      <div className="navbar-search-dropdown" onMouseDown={(e) => e.preventDefault()}>
        {searchText.trim() === "" ? (
          <>
            {recentSearches.length > 0 ? (
              <div className="search-dropdown-section">
                <div className="dropdown-section-header">
                  <span className="dropdown-section-title">
                    {i18n.language === "ar" ? "عمليات البحث الأخيرة" : "Recent Searches"}
                  </span>
                  <button 
                    type="button" 
                    onClick={handleClearAllTerms} 
                    className="dropdown-clear-all"
                  >
                    {i18n.language === "ar" ? "مسح الكل" : "Clear All"}
                  </button>
                </div>
                <ul className="dropdown-item-list">
                  {recentSearches.map((term, index) => (
                    <li key={index} className="dropdown-item-row" onClick={() => handleSelectTerm(term)}>
                      <span className="dropdown-item-left">
                        <span className="dropdown-item-icon">🕒</span>
                        <span className="dropdown-item-text">{term}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTerm(term, e)}
                        className="dropdown-item-delete"
                        title={i18n.language === "ar" ? "حذف" : "Delete"}
                        aria-label="Delete query"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="search-dropdown-section">
              <div className="dropdown-section-header">
                <span className="dropdown-section-title">
                  {i18n.language === "ar" ? "عمليات بحث شائعة" : "Trending Searches"}
                </span>
              </div>
              <div className="dropdown-chips-grid">
                {popularSearches.map((term, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleSelectTerm(term)}
                    className="dropdown-chip"
                  >
                    🚀 {term}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="search-dropdown-preview">
            <div className="search-preview-scanner"></div>
            <div className="search-preview-info">
              <span className="search-preview-sparkle">✨</span>
              <span>
                {searchLoading 
                  ? (i18n.language === "ar" ? "جاري المسح الذكي لـ..." : "AI scanning matches for...") 
                  : (i18n.language === "ar" ? "اضغط Enter للبحث عن:" : "Press Enter to search:")}
              </span>
              <strong className="search-preview-query"> "{searchText}"</strong>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`navbar-container ${isScrolled ? "scrolled" : ""}`} id="main-app-navbar">
      <div className="navbar-brand-wrapper">
        <Link to="/" className="navbar-brand" id="navbar-brand-logo">
          <span className="brand-accent">🎬</span> {t("logo")}
        </Link>
      </div>

      {/* Tablet Search Bar - always visible on tablet viewport outside hamburger menu */}
      <form className="navbar-search-form tablet-search-form" onSubmit={handleSubmit}>
        <div className={`navbar-search-input-wrapper ${isTabletSearchFocused ? "focused" : ""}`}>
          <span className={`navbar-search-icon-container ${searchLoading ? "searching" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="navbar-search-svg">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder={i18n.language === "ar" ? "ابحث عن أفلام ومسلسلات..." : "Search movies, shows..."}
            value={searchText}
            onChange={upateSearchText}
            onFocus={() => setIsTabletSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsTabletSearchFocused(false), 200)}
            className="navbar-search-input"
            id="navbar-search-field-tablet"
            aria-label={t("searchPlaceholder")}
            autoComplete="off"
          />
          {searchText && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => setSearchText("")}
              aria-label={t("clearSearch")}
            >
              ✕
            </button>
          )}
          {renderSearchDropdown(isTabletSearchFocused, setIsTabletSearchFocused)}
        </div>
      </form>

      {/* Mobile Search Bar - always visible inside navbar, compact, expandable */}
      <form className="navbar-search-form mobile-navbar-search-form" onSubmit={handleSubmit}>
        <div className={`navbar-search-input-wrapper ${isMobileSearchFocused ? "focused" : ""}`}>
          <span className={`navbar-search-icon-container ${searchLoading ? "searching" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="navbar-search-svg">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder={i18n.language === "ar" ? "ابحث..." : "Search..."}
            value={searchText}
            onChange={upateSearchText}
            onFocus={() => setIsMobileSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsMobileSearchFocused(false), 200)}
            className="navbar-search-input"
            id="navbar-search-field-mobile"
            aria-label={t("searchPlaceholder")}
            autoComplete="off"
          />
          {searchText && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => setSearchText("")}
              aria-label={t("clearSearch")}
            >
              ✕
            </button>
          )}
          {renderSearchDropdown(isMobileSearchFocused, setIsMobileSearchFocused)}
        </div>
      </form>

      <button
        className={`navbar-hamburger ${isMobileMenuOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsMobileMenuOpen(!isMobileMenuOpen);
        }}
        aria-label="Toggle Navigation Menu"
        id="navbar-hamburger-btn"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`navbar-menu-wrapper ${isMobileMenuOpen ? "is-open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <ul className="navbar-links-list">
          <li className="navbar-link-item">
            <Link to="/" className={`navbar-nav-link ${location.pathname === "/" ? "active" : ""}`}>
              {t("home")}
            </Link>
          </li>

          {/* Browse Dropdown */}
          <li className="navbar-link-item navbar-dropdown-wrapper">
            <button
              onClick={(e) => handleDropdownToggle("browse", e)}
              className={`navbar-dropdown-trigger ${openDropdown === "browse" ? "is-active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "browse"}
              id="navbar-browse-dropdown"
            >
              {t("discover")} <span className="dropdown-caret">▼</span>
            </button>
            {openDropdown === "browse" && (
              <div className="navbar-dropdown-pane" onClick={(e) => e.stopPropagation()}>
                {browseDropdownItems.map((item, idx) => (
                  <div key={idx} className="navbar-dropdown-cell">
                    <Link to={item.path} className="navbar-dropdown-link">
                      <span className="dropdown-cell-title">{item.title}</span>
                      <span className="dropdown-cell-subtitle">{item.subtitle}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </li>

          {/* Genres Dropdown */}
          <li className="navbar-link-item navbar-dropdown-wrapper">
            <button
              onClick={(e) => handleDropdownToggle("genres", e)}
              className={`navbar-dropdown-trigger ${openDropdown === "genres" ? "is-active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "genres"}
              id="navbar-genres-dropdown"
            >
              {t("genres")} <span className="dropdown-caret">▼</span>
            </button>
            {openDropdown === "genres" && (
              <div className="navbar-dropdown-pane" onClick={(e) => e.stopPropagation()}>
                {genresDropdownItems.map((item, idx) => (
                  <div key={idx} className="navbar-dropdown-cell">
                    <Link to={item.path} className="navbar-dropdown-link">
                      <span className="dropdown-cell-title">{item.title}</span>
                      <span className="dropdown-cell-subtitle">{item.subtitle}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </li>

          <li className="navbar-link-item">
            <Link to="/favorites" className={`navbar-nav-link ${location.pathname === "/favorites" ? "active" : ""}`}>
              {t("favorites")} <span role="img" aria-label="Favorites heart icon" className="fav-heart">❤️</span>
            </Link>
          </li>

          {/* Language Dropdown */}
          <li className="navbar-link-item navbar-dropdown-wrapper">
            <button
              onClick={(e) => handleDropdownToggle("language", e)}
              className={`navbar-dropdown-trigger ${openDropdown === "language" ? "is-active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "language"}
              id="navbar-language-dropdown"
            >
              <span className="lang-icon">🌐</span> {i18n.language === "en" ? "Language" : "اللغة"} <span className="dropdown-caret">▼</span>
            </button>
            {openDropdown === "language" && (
              <div className="navbar-dropdown-pane language-dropdown-pane" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    changeLanguage("en");
                    setOpenDropdown(null);
                  }}
                  className={`language-dropdown-item ${i18n.language === "en" ? "is-active-lang" : ""}`}
                >
                  <span className="lang-text">English</span>
                  <span className="lang-flag">🇺🇸</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeLanguage("ar");
                    setOpenDropdown(null);
                  }}
                  className={`language-dropdown-item ${i18n.language === "ar" ? "is-active-lang" : ""}`}
                >
                  <span className="lang-text">العربية</span>
                  <span className="lang-flag">🇮🇶</span>
                </button>
              </div>
            )}
          </li>
        </ul>

        <div className="navbar-controls-wrapper">
          {/* Dynamic Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            title={theme === "light" ? t("themeSwitchDark") : t("themeSwitchLight")}
            aria-label="Toggle color theme"
            id="navbar-theme-toggler"
          >
            {theme === "light" ? (
              <span role="img" aria-label="Dark mode moon" className="theme-icon">🌙</span>
            ) : (
              <span role="img" aria-label="Light mode sun" className="theme-icon">☀️</span>
            )}
          </button>

          {/* Desktop Search container */}
          <form className="navbar-search-form desktop-search-form" onSubmit={handleSubmit}>
            <div className={`navbar-search-input-wrapper ${isSearchFocused ? "focused" : ""}`}>
              <span className={`navbar-search-icon-container ${searchLoading ? "searching" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="navbar-search-svg">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder={i18n.language === "ar" ? "ابحث عن أفلام ومسلسلات..." : "Search movies, shows, genres..."}
                value={searchText}
                onChange={upateSearchText}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="navbar-search-input"
                id="navbar-search-field"
                aria-label={t("searchPlaceholder")}
                autoComplete="off"
              />
              {searchText && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={() => setSearchText("")}
                  aria-label={t("clearSearch")}
                >
                  ✕
                </button>
              )}
              {renderSearchDropdown(isSearchFocused, setIsSearchFocused)}
            </div>
            <button type="submit" className="navbar-search-submit" id="navbar-search-submit-btn">
              {t("searchButton")}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;