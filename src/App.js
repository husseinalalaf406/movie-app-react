import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./Home.js";
import Tv from './TV.js';
import Navbar from './navbar.js';
import KidsMovies from './kids.js'
import TrendingMovies from './trending.js'
import NowPlayingMovies from "./Now-playing.js";
import UpcomingMovies from "./upcoming.js";
import TopRatedMovies from "./top-rated.js";
import ComedyMovies from "./comady.js"
import ActionMovies from "./action.js"
import Movies from './detels.js';
import { useState, useEffect } from 'react';
import Search from './search.js';
import  Interests from './interests.js';
import { useTranslation } from 'react-i18next';

import { GlobalProvider } from './context/GlobalContext'; 
import FavoritesPage from './FavoritesPage'
import Footer from "./Footer";
import ErrorDisplay from "./ErrorDisplay";

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    localStorage.setItem("app-language", i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      // Set highly performant scroll-y CSS variable for parallax scrolling calculations
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      
      // Toggle back to top button visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Scroll reveal Intersection Observer setup
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60px 0px", // trigger slightly before entering viewport fully
      threshold: 0.1,
    };

    const handleIntersect = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          obs.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Common selector elements to register for reveals
    const selectors = [
      ".movie-section",
      ".section-title",
      ".hero-section",
      ".ai-hero",
      ".favorites-container",
      ".search-page-container",
      ".movie-grid",
      ".movie-card",
      ".scroll-reveal"
    ];

    const registerElements = () => {
      const elements = document.querySelectorAll(selectors.join(", "));
      elements.forEach((el) => {
        if (!el.classList.contains("scroll-reveal")) {
          el.classList.add("scroll-reveal");
        }
        observer.observe(el);
      });
    };

    // Initial register
    registerElements();

    // Re-run registration to capture lazy-loaded or API-fetched content
    const intervalId = setInterval(registerElements, 1000);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (searchText) {
      setSearchLoading(true);
      const apiLang = i18n.language === 'ar' ? 'ar' : 'en-US';
      fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(searchText)}&language=${apiLang}`)
        .then(Response => Response.json())
        .then((data) => {
          setSearchResults(data.results || []);
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchLoading(false);
        });
    } else {
      setSearchResults([]);
      setSearchLoading(false);
    }
  }, [searchText, i18n.language])

  return (
    <GlobalProvider>
      <div>
        <Navbar searchText={searchText} setSearchText={setSearchText} searchLoading={searchLoading} />
        
        {isOffline ? (
          <ErrorDisplay type="offline" onRetry={() => setIsOffline(!navigator.onLine)} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Interests" element={<Interests />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/kids" element={<KidsMovies />} />
            <Route path="/trending" element={<TrendingMovies />} />
            <Route path="/top-rated" element={<TopRatedMovies />} />
            <Route path="/upcoming" element={<UpcomingMovies />} />
            <Route path="/now-playing" element={<NowPlayingMovies />} />
            <Route path="/ComedyMovies" element={<ComedyMovies />} />
            <Route path="/ActionMovies" element={<ActionMovies />} />

            <Route path="/favorites" element={<FavoritesPage />} />
            {/* ------------------------------------------------------- */}

            <Route path="/movie/:id" element={<Movies />} />
            <Route path="/search" element={<Search searchText={searchText} searchResults={searchResults} searchLoading={searchLoading} />} />
            
            {/* Fallback 404 Route */}
            <Route path="*" element={<ErrorDisplay type="404" />} />
          </Routes>
        )}

        <Footer />

        {/* Modern Smooth Back-to-Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`back-to-top-btn ${showBackToTop ? "is-visible" : ""}`}
          aria-label={i18n.language === "en" ? "Scroll to top" : "الرجوع للأعلى"}
          title={i18n.language === "en" ? "Scroll to top" : "الرجوع للأعلى"}
        >
          <span className="arrow-icon">▲</span>
        </button>
      </div>
    </GlobalProvider>
  );
}

export default App;