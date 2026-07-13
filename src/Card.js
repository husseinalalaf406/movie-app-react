import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Section = ({ title, url }) => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const results = data.results.map((m) => ({
          image: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: m.title || m.name,     
          id: m.id,
          subtitle: m.release_date || m.first_air_date || "",
          genre_ids: m.genre_ids || [],
        }));
        setItems(results);
      })
      .catch(console.error);
  }, [url]);

  const handleMovieClick = (movie) => {
    if (movie.genre_ids && movie.genre_ids.length > 0) {
      const favoriteGenre = movie.genre_ids[0];
      localStorage.setItem('preferred_genre', favoriteGenre);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollWidth = el.scrollWidth - el.clientWidth;
    const newProgress = (el.scrollLeft / scrollWidth) * 100;
    setProgress(newProgress);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>

      <div className="scroll-container">
        <button className="scroll-btn left" onClick={scrollLeft}>
          ◀
        </button>

        <div className="scroll-wrapper" ref={scrollRef} onScroll={handleScroll}>
          {items.map((m, i) => (
            <div className="movie-card" key={i}>
              <Link to={`/movie/${m.id}`} onClick={() => handleMovieClick(m)}> 
                <img src={m.image} alt={m.title} />
              </Link>

              <h3>{m.title}</h3>
              <p>{m.subtitle}</p>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>
          ▶
        </button>
      </div>

      <div className="scroll-progress">
        <div
          className="scroll-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const MoviesPage = () => {
  const API_KEY = "2efee2658584346c583ece1fb60886e0";
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedGenre = localStorage.getItem('preferred_genre');
    if (savedGenre) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${savedGenre}&sort_by=popularity.desc&language=en-US&page=1`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setRecommendations(data.results.slice(0, 4));
          }
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className="movies-page">
      {localStorage.getItem('preferred_genre') && (
        <Section
          title="Based on your interests"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${localStorage.getItem('preferred_genre')}&sort_by=popularity.desc&language=en-US&page=1`}
        />
      )}
      <Section
        title="Popular TV Shows"
        url={`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`}
      />
      <Section
        title="Kids & Family"
        url={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16,10751&language=en-US&page=1`}
      />
      <Section
        title="Top Rated Movies"
        url={`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`}
      />
    </div>
  );
};

export default MoviesPage;