import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "./context/GlobalContext";
import "./App.css"; 

const Movies = () => {
  const { id } = useParams();
  const [moviesDetails, setMoviesDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const { addMovieToWatchlist, removeMovieFromWatchlist, watchlist } = useGlobalContext();

  const storedMovie = watchlist.find((o) => o.id == id);
  const isFavorite = storedMovie ? true : false;

  useEffect(() => {
    
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=2efee2658584346c583ece1fb60886e0&language=en-US`)
      .then((res) => res.json())
      .then((data) => setMoviesDetails(data))
      .catch((err) => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=2efee2658584346c583ece1fb60886e0&language=en-US`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer");
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch((err) => console.error("Error fetching trailer:", err));
  }, [id]);

  return (
    <div className="details-page">
      <div className="details-card">
        
        <div className="details-poster">
          {moviesDetails ? (
            moviesDetails.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500/${moviesDetails.poster_path}`}
                alt={moviesDetails.original_title}
              />
            ) : (
              <div className="no-poster">No Poster</div>
            )
          ) : (
            <Skeleton height="100%" style={{ minHeight: "500px", lineHeight: "1" }} baseColor="#202020" highlightColor="#444" />
          )}
        </div>

        <div className="details-content">
          {moviesDetails ? (
            <>
              <h1 className="movie-title">{moviesDetails.original_title}</h1>
              
              <div className="movie-meta">
                {moviesDetails.release_date && (
                  <span className="badge date">{moviesDetails.release_date.split("-")[0]}</span>
                )}
                <span className="badge star">★ {moviesDetails.vote_average?.toFixed(1)}</span>
                <span className="badge runtime">{moviesDetails.runtime} min</span>
              </div>

              {moviesDetails.tagline && <p className="tagline">"{moviesDetails.tagline}"</p>}

              <h3 className="section-header">Overview</h3>
              <p className="overview-text">{moviesDetails.overview}</p>

              <div className="action-buttons">
                <button
                  className={`btn-action ${isFavorite ? "btn-remove" : "btn-add"}`}
                  onClick={() => {
                    if (isFavorite) {
                      removeMovieFromWatchlist(moviesDetails.id);
                    } else {
                      addMovieToWatchlist(moviesDetails);
                    }
                  }}
                >
                  {isFavorite ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
                </button>

                {trailerKey && (
                  <button
                    className="btn-action btn-trailer"
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    {showTrailer ? "Close Trailer X" : "▶ Watch Trailer"}
                  </button>
                )}
              </div>

              {showTrailer && trailerKey && (
                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </>
          ) : (
            <div style={{ paddingTop: "20px" }}>
              <Skeleton count={1} height={40} width={`80%`} baseColor="#f9f9f9" highlightColor="#f9f9f9" /> <br />
              <div style={{ display: "flex", gap: "10px" }}>
                  <Skeleton width={60} height={30} baseColor="#f9f9f9" highlightColor="#f9f9f9" />
                  <Skeleton width={60} height={30} baseColor="#f9f9f9" highlightColor="#f9f9f9" />
                  <Skeleton width={60} height={30} baseColor="#f9f9f9" highlightColor="#f9f9f9" />
              </div> <br />
              <Skeleton count={5} baseColor="#f9f9f9" highlightColor="#f9f9f9" /> <br />
              <Skeleton width={200} height={50} baseColor="#f9f9f9" highlightColor="#f9f9f9" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;