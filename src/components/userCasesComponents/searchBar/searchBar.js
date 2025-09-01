
import "./searchBar.scss";

const SearchBar = ({ onSearch, onCategorySelect, selectedCategory }) => {

  const categories = ["all", "personal savings", "startup", "big projects", "hardware", "ai technology"];

  return (
    <div className="container d-flex flex-column justify-content-center">
        <input
        type="text"
        placeholder="Search cases..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-bar mt-5 mb-3 w-100"
        />
        {/* 📌 Botones de categorías */}
      <div className="category-buttons mt-1 mb-5">
        {categories.map((category, index) => (
          <button 
            key={index} 
            className={`category-btn ${selectedCategory === category ? "active" : ""}`} 
            onClick={() => selectedCategory !== category && onCategorySelect(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
     </div>
  );
};

export default SearchBar;