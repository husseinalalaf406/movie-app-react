// src/context/GlobalContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("movie-watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("movie-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addMovieToWatchlist = (movie) => {
    setWatchlist((prev) => {
      const found = prev.find((o) => o.id === movie.id);
      if (found) return prev;
      return [...prev, movie];
    });
  };

  const removeMovieFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("site-theme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("site-theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <GlobalContext.Provider
      value={{
        watchlist,
        addMovieToWatchlist,
        removeMovieFromWatchlist,
        theme,        
        toggleTheme, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);