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
          id: m.id ,
          subtitle: m.release_date || m.first_air_date || "",
        }));
        setItems(results);
      })
      .catch(console.error);
  }, [url]);

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
          <Link to={`/movie/${m.id}`}> 
          
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

      {/* Progress bar */}
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

  return (
    <div className="movies-page">
      <Section
        title="Popular Movies"
        url={`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`}
      />
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














