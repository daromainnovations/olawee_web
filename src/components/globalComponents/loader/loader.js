
import "./loader.scss";

const Loader = ({ message }) => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;