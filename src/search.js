import { Link } from "react-router-dom";

const Search = ({ searchResults, searchText }) => {
  const titleText = searchText ? `Results for: "${searchText}"` : "Waiting for input...";

  // OPTION 1: Use a more reliable external link (gray background, black text)
  const notFoundImage = "https://dummyimage.com/500x750/cfcfcf/000000.jpg&text=No+Image+Found";

  return (
    <div className="section">
      <h2 className="section-title">{titleText}</h2>
      
      <div className="cards-wrapper">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((movie, i) => {
            
            // 1. Determine which image to show initially
            const image = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : notFoundImage;
            
            const subtitle = movie.release_date 
              ? movie.release_date.substring(0, 4) 
              : "N/A";

            return (
              <div className="movie-card" key={movie.id || i}>
                <Link to={`/movie/${movie.id}`}>
                  <img 
                    src={image} 
                    alt={movie.title} 
                    style={{ width: "100%", height: "auto" }} // Ensures image fills the card
                    // 2. Safety Net: If the TMDB image breaks, switch to placeholder
                    onError={(e) => { 
                      e.target.onerror = null; // Prevents infinite loop
                      e.target.src = notFoundImage; 
                    }}
                  />
                </Link>
                <h3>{movie.title}</h3>
                <p>{subtitle}</p>
              </div>
            );
          })
        ) : (
          <p style={{ color: "white", paddingLeft: "20px" }}>
            {searchText ? "No movies found." : "Type in the search bar to find movies."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;