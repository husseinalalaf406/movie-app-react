import { useEffect, useState } from "react";
import Section from "./show";

const Tv = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=2efee2658584346c583ece1fb60886e0`
    )
      .then((res) => res.json())
      .then((data) => {
        const tvShows = data.results.map((show) => ({
          image: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          title: show.name,
          id:show.id,

          subtitle: show.first_air_date,
          url: `/tv/${show.id}`, // detail page if you want later
        }));
        setShows(tvShows);
      })
      .catch((err) => console.error(err));
  }, []);
 
return(<Section items={shows}  />)
}



export default Tv;
