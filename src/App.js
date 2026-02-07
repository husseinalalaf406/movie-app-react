import { Routes, Route } from 'react-router-dom';
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

import { GlobalProvider } from './context/GlobalContext'; 
import FavoritesPage from './FavoritesPage'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (searchText) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=2efee2658584346c583ece1fb60886e0&query=${encodeURIComponent(searchText)}`)
        .then(Response => Response.json())
        .then((data) => {
          setSearchResults(data.results || []);
        })
    }
  }, [searchText])

  return (
    <GlobalProvider>
      <div>
        <Navbar searchText={searchText} setSearchText={setSearchText} />
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/search" element={<Search searchText={searchText} searchResults={searchResults} />} />
        </Routes>
      </div>
    </GlobalProvider>
  );
}

export default App;