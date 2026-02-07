import "./App.css";
import { Link } from "react-router-dom";

const Section = ({ items }) => {
  return (
    <div className="section">
      <h2 className="section-title">{items.title}</h2>
      <div className="cards-wrapper">
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
    </div>
  );
};

export default Section;
