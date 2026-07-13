import { useEffect, useState } from "react";
import Section from "./show";
import "./App.css";

const Interests = () => {
  const [movies, setMovies] = useState([]);
  const API_KEY = "2efee2658584346c583ece1fb60886e0";

  useEffect(() => {
    const savedGenre = localStorage.getItem('preferred_genre');
    if (savedGenre) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${savedGenre}&sort_by=popularity.desc&language=en-US&page=1`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setMovies(data.results.slice(0, 8));
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  
    return ( 
      
            <Section items={movies} />
    
    );
}


export default Interests;