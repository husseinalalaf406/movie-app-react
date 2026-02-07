import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext";
import "./App.css"; 

const FavoritesPage = () => {
  const { watchlist, removeMovieFromWatchlist } = useGlobalContext();

  return (
    <div className="movies-page" style={{ padding: "20px" }}>
      <h2 className="section-title">My Favorites List</h2>

      {watchlist.length === 0 ? (
        <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          <h3>No movies in your watchlist yet!</h3>
          <Link to="/" style={{ color: "#e50914", textDecoration: "none" }}>
            Go add some movies
          </Link>
        </div>
      ) : (


<div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          
          {watchlist.map((movie) => {
            const imageUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image";

            return (
              <div className="movie-card" key={movie.id} style={{ position: "relative" }}>
                
                <Link to={`/movie/${movie.id}`}>
                  <img src={imageUrl} alt={movie.title || movie.name} />
                </Link>

                <h3>{movie.title || movie.name}</h3>
                
                <button
                  onClick={() => removeMovieFromWatchlist(movie.id)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#e50914", 
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontWeight: "bold"
                  }}
                >
                  Remove ❌
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;