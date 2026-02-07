import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "./context/GlobalContext"; // استيراد الكونتكست
import "./App.css";

const Navbar = ({ searchText, setSearchText }) => {
  const History = useNavigate();
  // استدعاء دالة تغيير الثيم والحالة الحالية
  const { theme, toggleTheme } = useGlobalContext(); 

  const upateSearchText = (e) => {
    History("/Search");
    setSearchText(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (searchText.trim() !== "") {
      History("/Search");
    }
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownItems = [
    { title: "Trending", subtitle: "Most watched by fans worldwide.", path: "/trending" },
    { title: "Now Playing", subtitle: "Movies currently in theaters.", path: "/now-playing" },
    { title: "Upcoming", subtitle: "New releases coming soon.", path: "/upcoming" },
    { title: "Top Rated", subtitle: "Highest rated movies of all time.", path: "/top-rated" },
    { title: "Tv shows", subtitle: "What’s hot this week on NetMovies.", path: "/TV" },
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="navbar">
      <div className="brand">NetMovies</div>

      <button
        className="hamburger"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <div className={`menu ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>

        <div className="dropdown">
          <button onClick={() => toggleDropdown("Other")}>▼ Other</button>
          {openDropdown === "Other" && (
            <div className="dropdown-content grid-desktop-mobile">
              {dropdownItems.map((item, idx) => (
                <div key={idx} className="dropdown-item">
                  <Link to={item.path}>
                    {item.title} <br />
                    <p>{item.subtitle}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/kids">Kids</Link>
        <Link to="/ComedyMovies">ComedyMovies</Link>
        <Link to="/ActionMovies">ActionMovies</Link>
        <Link to="/favorites">Favorites ❤️</Link>

        <button 
           onClick={toggleTheme} 
           style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", marginRight: "10px" }}
           title="Toggle Dark Mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={upateSearchText}
          />
          <button onClick={handleSubmit}>Search</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;