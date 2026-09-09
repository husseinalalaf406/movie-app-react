import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "./context/GlobalContext";
import ErrorDisplay from "./ErrorDisplay";
import MovieCard from "./MovieCard";
import IconBadge from "./IconBadge";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import "./App.css"; 

const Movies = () => {
  const { id } = useParams();
  const [moviesDetails, setMoviesDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [previewKey, setPreviewKey] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const isMutedRef = useRef(true);

  // Sync ref with state so message listener always reads the current mute state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const iframeRef = useRef(null);
  const previewTimerRef = useRef(null);
  const [bottomTrailerLoaded, setBottomTrailerLoaded] = useState(false);
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

  const { addMovieToWatchlist, removeMovieFromWatchlist, watchlist } = useGlobalContext();

  const storedMovie = watchlist.find((o) => Number(o.id) === Number(id));
  const isFavorite = storedMovie ? true : false;

  useEffect(() => {
    const isArabic = i18n.language === 'ar';
    const apiLang = isArabic ? 'ar' : 'en-US';
    setLoading(true);
    setError(null);
    setCastLoading(true);
    setTrailerLoading(true);
    setSimilarLoading(true);
    setReviewsLoading(true);
    setReviewsPage(1);
    setExpandedReviews({});
    setPreviewKey(null);
    setTrailerKey(null);
    setIsPlayingPreview(false);
    setPreviewReady(false);
    setIsMuted(true);
    isMutedRef.current = true;
    setIsPaused(false);
    setAutoplayBlocked(false);
    setIsOverviewExpanded(false);
    setBottomTrailerLoaded(false);

    if (!navigator.onLine) {
      setError("offline");
      setLoading(false);
      setCastLoading(false);
      setTrailerLoading(false);
      setSimilarLoading(false);
      setReviewsLoading(false);
      return;
    }
    
    // Fetch details with Arabic primary and English fallback for missing overview/backdrop/title
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("404");
          } else {
            throw new Error("api");
          }
        }
        return res.json();
      })
      .then(async (data) => {
        if (data.success === false) {
          setError("404");
          return;
        }

        // If in Arabic mode and overview, backdrop, or title is empty, fetch English fallback to avoid blank UI
        if (isArabic) {
          const needsOverview = !data.overview || data.overview.trim() === "";
          const needsBackdrop = !data.backdrop_path;
          const needsTitle = !data.title || data.title.trim() === "";

          if (needsOverview || needsBackdrop || needsTitle) {
            try {
              const fallbackRes = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=2efee2658584346c583ece1fb60886e0&language=en-US`
              );
              if (fallbackRes.ok) {
                const enData = await fallbackRes.json();
                if (needsOverview && enData.overview) {
                  data.overview = enData.overview;
                }
                if (needsBackdrop && enData.backdrop_path) {
                  data.backdrop_path = enData.backdrop_path;
                }
                if (needsTitle && (enData.title || data.original_title)) {
                  data.title = enData.title || data.original_title;
                }
                if (!data.tagline && enData.tagline) {
                  data.tagline = enData.tagline;
                }
              }
            } catch (fallbackErr) {
              console.warn("Could not fetch English fallback details:", fallbackErr);
            }
          }
        }

        // If overview is still empty, provide graceful fallback text
        if (!data.overview || data.overview.trim() === "") {
          data.overview = isArabic
            ? "لا يتوفر وصف تفصيلي لقصة هذا العمل حالياً."
            : "No overview available for this title at the moment.";
        }

        setMoviesDetails(data);
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

    // Fetch videos with Clip > Teaser priority for preview (Trailers strictly excluded), and Trailer > Teaser > Clip for official trailer
    const fetchVideos = async () => {
      try {
        let allVideos = [];

        // 1. Try active language first (e.g. 'ar' or 'en-US')
        const primaryRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=2efee2658584346c583ece1fb60886e0&language=${apiLang}`
        );
        if (primaryRes.ok) {
          const primaryData = await primaryRes.json();
          if (primaryData && Array.isArray(primaryData.results)) {
            allVideos = [...primaryData.results];
          }
        }

        // 2. If active language had no videos or is Arabic, also fetch English fallback
        if (allVideos.length === 0 || apiLang !== "en-US") {
          try {
            const enRes = await fetch(
              `https://api.themoviedb.org/3/movie/${id}/videos?api_key=2efee2658584346c583ece1fb60886e0&language=en-US`
            );
            if (enRes.ok) {
              const enData = await enRes.json();
              if (enData && Array.isArray(enData.results)) {
                const existingKeys = new Set(allVideos.map((v) => v.key));
                enData.results.forEach((v) => {
                  if (!existingKeys.has(v.key)) {
                    allVideos.push(v);
                    existingKeys.add(v.key);
                  }
                });
              }
            }
          } catch (enErr) {
            console.warn("Could not fetch English videos fallback:", enErr);
          }
        }

        // 3. Fallback without language parameter if still empty
        if (allVideos.length === 0) {
          try {
            const globalRes = await fetch(
              `https://api.themoviedb.org/3/movie/${id}/videos?api_key=2efee2658584346c583ece1fb60886e0`
            );
            if (globalRes.ok) {
              const globalData = await globalRes.json();
              if (globalData && Array.isArray(globalData.results)) {
                allVideos = [...globalData.results];
              }
            }
          } catch (globalErr) {
            console.warn("Could not fetch global videos fallback:", globalErr);
          }
        }

        // Filter for valid YouTube videos
        const ytVideos = allVideos.filter((v) => v.site === "YouTube" && v.key);

        // LOG ALL RETURNED VIDEO TYPES FOR TMDB VERIFICATION (BUG 1)
        console.log(
          `[TMDB Videos] Movie ID ${id} returned ${ytVideos.length} YouTube videos:`,
          ytVideos.map((v) => ({ name: v.name, type: v.type, official: v.official, key: v.key }))
        );

        // PREVIEW SELECTION: Priority Clip > Teaser ONLY (Trailers and others strictly excluded)
        const clipVid = ytVideos.find((v) => v.type === "Clip");
        const teaserVid = ytVideos.find((v) => v.type === "Teaser");
        const selectedPreview = clipVid || teaserVid || null;

        // DEDICATED TRAILER SELECTION: Priority Trailer > Teaser > Clip > any
        const trailerVid = ytVideos.find((v) => v.type === "Trailer");
        const anyVid = ytVideos[0];
        const selectedTrailer = trailerVid || teaserVid || clipVid || anyVid || null;

        if (selectedPreview) {
          console.log(
            `[TMDB Preview] Selected video for hero preview (Movie ID ${id}): "${selectedPreview.name}" [type: ${selectedPreview.type}, key: ${selectedPreview.key}]` +
            (selectedPreview.type !== "Clip" ? ` (Clip was not available on TMDB for this movie, used Teaser fallback)` : "")
          );
        } else {
          console.log(
            `[TMDB Preview] No Clip or Teaser available on TMDB for Movie ID ${id}. Hero preview disabled (showing static backdrop).`
          );
        }

        setPreviewKey(selectedPreview ? selectedPreview.key : null);
        setTrailerKey(selectedTrailer ? selectedTrailer.key : null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setPreviewKey(null);
        setTrailerKey(null);
      } finally {
        setTrailerLoading(false);
      }
    };
    fetchVideos();

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

  const sendPlayerCommand = useCallback((func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: func,
            args: args,
          }),
          "*"
        );
      } catch (err) {
        console.warn("YouTube player command error:", err);
      }
    }
  }, []);

  // Listen to YouTube player status events
  useEffect(() => {
    const handleYouTubeMessage = (event) => {
      if (!event.origin || !event.origin.includes("youtube.com")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // Player ready or initial delivery: enforce mute immediately if isMuted is true
        if (data.event === "onReady" || data.event === "initialDelivery") {
          if (isMutedRef.current) {
            sendPlayerCommand("mute");
            sendPlayerCommand("setVolume", [0]);
          }
        }

        if (data.event === "onStateChange") {
          // -1: unstarted, 1: playing, 2: paused, 3: buffering, 0: ended
          if (data.info === 1 || data.info === 3 || data.info === -1) {
            // Before or immediately as playback starts, ensure mute is enforced if muted
            if (isMutedRef.current) {
              sendPlayerCommand("mute");
              sendPlayerCommand("setVolume", [0]);
            }
          }

          if (data.info === 1) {
            setPreviewReady(true);
            setIsPaused(false);
            setAutoplayBlocked(false);
          } else if (data.info === 2) {
            setIsPaused(true);
          } else if (data.info === 0) {
            // Preview ended: replay / loop seamlessly
            sendPlayerCommand("seekTo", [0, true]);
            sendPlayerCommand("playVideo");
            if (isMutedRef.current) {
              sendPlayerCommand("mute");
              sendPlayerCommand("setVolume", [0]);
            }
          }
        }
      } catch (err) {
        // non-json message
      }
    };

    window.addEventListener("message", handleYouTubeMessage);
    return () => window.removeEventListener("message", handleYouTubeMessage);
  }, [sendPlayerCommand]);

  // Autoplay after static backdrop is briefly shown
  useEffect(() => {
    setIsPlayingPreview(false);
    setPreviewReady(false);
    setIsMuted(true);
    isMutedRef.current = true;
    setIsPaused(false);
    setAutoplayBlocked(false);

    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }

    if (previewKey && !loading) {
      // Show static backdrop image briefly (1200ms) before starting the muted preview
      previewTimerRef.current = setTimeout(() => {
        setIsPlayingPreview(true);
      }, 1200);
    }

    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, [id, previewKey, loading]);

  // Graceful fallback if autoplay is blocked by browser policy or mobile device
  useEffect(() => {
    let fallbackTimeout = null;
    if (isPlayingPreview && !previewReady) {
      // If after 5 seconds the video has not loaded or started, fallback to static backdrop
      fallbackTimeout = setTimeout(() => {
        if (!previewReady) {
          setAutoplayBlocked(true);
          setIsPlayingPreview(false);
        }
      }, 5000);
    }
    return () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [isPlayingPreview, previewReady]);

  const handleIframeLoaded = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      );
    }
    // Always enforce mute before or immediately as playback starts
    if (isMutedRef.current) {
      sendPlayerCommand("mute");
      sendPlayerCommand("setVolume", [0]);
    }
    sendPlayerCommand("playVideo");
    setPreviewReady(true);

    // Staggered mute enforcement so that whenever YouTube attaches its message listener, it mutes immediately
    [50, 150, 300, 600, 1000].forEach((delay) => {
      setTimeout(() => {
        if (isMutedRef.current) {
          sendPlayerCommand("mute");
          sendPlayerCommand("setVolume", [0]);
        }
      }, delay);
    });
  };

  const toggleMute = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isMuted) {
      sendPlayerCommand("unMute");
      sendPlayerCommand("setVolume", [100]);
      setIsMuted(false);
      isMutedRef.current = false;
    } else {
      sendPlayerCommand("mute");
      sendPlayerCommand("setVolume", [0]);
      setIsMuted(true);
      isMutedRef.current = true;
    }
  };

  const togglePlayPause = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isPaused) {
      sendPlayerCommand("playVideo");
      setIsPaused(false);
    } else {
      sendPlayerCommand("pauseVideo");
      setIsPaused(true);
    }
  };

  const handleManualPlay = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setAutoplayBlocked(false);
    setIsPlayingPreview(true);
    setIsPaused(false);
    if (isMutedRef.current) {
      sendPlayerCommand("mute");
      sendPlayerCommand("setVolume", [0]);
    }
    sendPlayerCommand("playVideo");
  };

  const handleWatchTrailerAction = () => {
    const trailerSection = document.getElementById("movie-trailer-section");
    if (trailerSection) {
      trailerSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div 
        className={`details-hero-banner ${isPlayingPreview && previewReady ? "is-preview-active" : ""}`}
        onClick={isPlayingPreview && previewReady ? togglePlayPause : undefined}
        role={isPlayingPreview && previewReady ? "region" : undefined}
        aria-label={isPlayingPreview && previewReady ? (t("previewBadge") || "Preview trailer") : undefined}
      >
        {moviesDetails ? (
          <>
            {/* 1. Static Backdrop Image (Always present underneath as baseline & fallback) */}
            {moviesDetails.backdrop_path ? (
              <div 
                className={`details-hero-backdrop ${isPlayingPreview && previewReady ? "is-dimmed" : ""}`}
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${moviesDetails.backdrop_path})` }}
              />
            ) : (
              <div className="details-hero-backdrop-placeholder" />
            )}

            {/* 2. Autoplaying YouTube Preview Video (Prefers Clip, fallback to Teaser only; Trailers excluded) */}
            {isPlayingPreview && previewKey && !autoplayBlocked && (
              <div className="hero-video-container">
                <iframe
                  ref={iframeRef}
                  key={`hero-preview-${previewKey}`}
                  src={`https://www.youtube.com/embed/${previewKey}?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&loop=1&playlist=${previewKey}&origin=${encodeURIComponent(window.location.origin)}`}
                  title={`${moviesDetails.title || moviesDetails.original_title} Preview`}
                  className={`hero-video-iframe ${previewReady ? "is-visible" : ""}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={handleIframeLoaded}
                />
              </div>
            )}

            {/* 3. Dark & Vignette Gradient Overlay (Guarantees high contrast for title & overview) */}
            <div className="details-hero-overlay" />

            {/* 4. Active Preview Controls (PREVIEW label, Mute/Unmute toggle, Play/Pause toggle) */}
            {isPlayingPreview && previewReady && !autoplayBlocked && (
              <>
                {/* Netflix-style minimalist plain text PREVIEW label */}
                <div className="hero-preview-badge" aria-hidden="true">
                  <span className="hero-preview-dot" />
                  <span className="hero-preview-text">{t("previewBadge") || "PREVIEW"}</span>
                </div>

                {/* Mute/Unmute speaker icon button */}
                <button
                  type="button"
                  className={`hero-mute-btn ${isMuted ? "is-muted" : "is-unmuted"}`}
                  onClick={toggleMute}
                  aria-label={isMuted ? (t("unmuteAudio") || "Unmute sound") : (t("muteAudio") || "Mute sound")}
                  title={isMuted ? (t("unmuteAudio") || "Unmute sound") : (t("muteAudio") || "Mute sound")}
                >
                  {isMuted ? (
                    <VolumeOffOutlinedIcon className="hero-ctrl-icon" />
                  ) : (
                    <VolumeUpOutlinedIcon className="hero-ctrl-icon" />
                  )}
                </button>

                {/* Center Play/Pause overlay */}
                <button
                  type="button"
                  className={`hero-center-playpause-btn ${isPaused ? "is-paused" : "is-playing"}`}
                  onClick={togglePlayPause}
                  aria-label={isPaused ? (t("playPreview") || "Play preview") : (t("pausePreview") || "Pause preview")}
                  title={isPaused ? (t("playPreview") || "Play preview") : (t("pausePreview") || "Pause preview")}
                >
                  {isPaused ? (
                    <PlayArrowOutlinedIcon className="center-ctrl-icon play" />
                  ) : (
                    <PauseOutlinedIcon className="center-ctrl-icon pause" />
                  )}
                </button>
              </>
            )}

            {/* 5. Fallback Manual Play Button if Autoplay was Blocked */}
            {autoplayBlocked && previewKey && (
              <div className="hero-fallback-overlay">
                <button
                  type="button"
                  className="hero-fallback-play-btn"
                  onClick={handleManualPlay}
                  aria-label={t("playOfficialTrailer") || "Play Preview"}
                >
                  <PlayArrowOutlinedIcon className="play-triangle-mui" />
                  <span>{t("playOfficialTrailer") || "Play Preview"}</span>
                </button>
              </div>
            )}
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
                  <StarBorderOutlinedIcon className="star-icon-mui" />
                  <span className="badge-value">{moviesDetails.vote_average?.toFixed(1)}</span>
                </div>
              )}

              {/* 3. Runtime Badge */}
              {moviesDetails.runtime !== undefined && (
                <div className="premium-metadata-badge badge-runtime">
                  <AccessTimeOutlinedIcon className="clock-icon-mui" />
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
              <div className="details-mobile-genres" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
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
                {t("movieStory") || t("overview")}
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
                  onClick={handleWatchTrailerAction}
                  aria-label={t("watchTrailer")}
                >
                  <PlayArrowOutlinedIcon className="btn-icon play-icon" />
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
                {isFavorite ? (
                  <FavoriteOutlinedIcon className="btn-icon heart-icon" />
                ) : (
                  <FavoriteBorderOutlinedIcon className="btn-icon heart-icon" />
                )}
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
          <span className="trailer-title-icon">
            <BarChartOutlinedIcon />
          </span>
          {t("movieFacts")}
        </h3>
        
        {moviesDetails ? (
          <div className="facts-grid">
            {/* 1. Runtime */}
            <div className="fact-card">
              <IconBadge icon={<AccessTimeOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("runtimeLabel")}</span>
                <span className="fact-value">
                  {moviesDetails.runtime ? `${moviesDetails.runtime} ${t("minutes")}` : t("unknown")}
                </span>
              </div>
            </div>

            {/* 2. Release Date */}
            <div className="fact-card">
              <IconBadge icon={<CalendarTodayOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("releaseDate").replace(":", "")}</span>
                <span className="fact-value">{formatDate(moviesDetails.release_date)}</span>
              </div>
            </div>

            {/* 3. Original Language */}
            <div className="fact-card">
              <IconBadge icon={<LanguageOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("originalLanguage")}</span>
                <span className="fact-value">{getLanguageName(moviesDetails.original_language)}</span>
              </div>
            </div>

            {/* 4. Country */}
            <div className="fact-card">
              <IconBadge icon={<PlaceOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("country")}</span>
                <span className="fact-value">
                  {moviesDetails.production_countries && moviesDetails.production_countries.length > 0
                    ? moviesDetails.production_countries.map((c) => c.name).join(i18n.language === "ar" ? "، " : ", ")
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 5. Production Companies */}
            <div className="fact-card">
              <IconBadge icon={<BusinessOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("productionCompanies")}</span>
                <span className="fact-value">
                  {moviesDetails.production_companies && moviesDetails.production_companies.length > 0
                    ? moviesDetails.production_companies.map((c) => c.name).join(i18n.language === "ar" ? "، " : ", ")
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 6. Genres */}
            <div className="fact-card">
              <IconBadge icon={<TheaterComedyOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("genres")}</span>
                <span className="fact-value">
                  {moviesDetails.genres && moviesDetails.genres.length > 0
                    ? moviesDetails.genres.map((g) => g.name).join(i18n.language === "ar" ? "، " : ", ")
                    : t("unknown")}
                </span>
              </div>
            </div>

            {/* 7. Budget */}
            <div className="fact-card">
              <IconBadge icon={<AttachMoneyOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("budget")}</span>
                <span className="fact-value">{formatCurrency(moviesDetails.budget)}</span>
              </div>
            </div>

            {/* 7. Revenue */}
            <div className="fact-card">
              <IconBadge icon={<TrendingUpOutlinedIcon />} />
              <div className="fact-text-container">
                <span className="fact-title">{t("revenue")}</span>
                <span className="fact-value">{formatCurrency(moviesDetails.revenue)}</span>
              </div>
            </div>

            {/* 8. Popularity */}
            <div className="fact-card">
              <IconBadge icon={<WhatshotOutlinedIcon />} />
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
              <IconBadge icon={<HowToVoteOutlinedIcon />} />
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
                <IconBadge className="skeleton-pulsing" style={{ border: "none", background: "rgba(255,255,255,0.08)" }} />
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
          <span className="trailer-title-icon">
            <MovieOutlinedIcon />
          </span>
          {t("trailer")}
        </h3>
        {trailerLoading ? (
          <div className="responsive-trailer-wrapper skeleton-pulsing">
            <div className="trailer-skeleton-play-btn" />
          </div>
        ) : trailerKey ? (
          <div className="responsive-trailer-wrapper">
            {!bottomTrailerLoaded && (
              <div className="trailer-skeleton-container absolute-loader skeleton-pulsing">
                <div className="trailer-skeleton-play-btn" />
              </div>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setBottomTrailerLoaded(true)}
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
          <span className="trailer-title-icon">
            <RateReviewOutlinedIcon />
          </span>
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
          <span className="trailer-title-icon">
            <AutoAwesomeOutlinedIcon />
          </span>
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
