
import React from "react";
import PropTypes from "prop-types";
import "./customCard.scss";

const CustomCard = ({
  title,
  price,
  features,
  buttonText,
  onButtonClick,
  imageUrl,
  className = "",
  style = {},
  featuresAsList = true,
  badge,
}) => {
  return (
    <div className={`custom-card ${className}`} style={style} onClick={onButtonClick} >
      {badge && <div className="card-badge">{badge}</div>}
      {/* 📌 Imagen en la parte superior (40% de la altura del card) */}
      {imageUrl && (
        <div className="card-image-container">
          <img src={imageUrl} alt={title} className="card-image" />
        </div>
      )}
      
      {/* 📌 Contenido del Card */}
      <div className="card-content">
        <span className="card-label">{title}</span>
        {/* {price && <h2 className="card-price">{price}</h2>} */}
        <h2 className={`card-price${!price ? " card-price--empty" : ""}`}>
          {price}
        </h2>
        {features.length > 0 &&
        (featuresAsList ? (
          <ul className="card-features">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="card-description">{features.join(" ")}</p> // Muestra como texto
        ))}
        {buttonText && (
          <div className="container-btn-get-started">
            <button className="custom-card-button btn-card-price" onClick={onButtonClick}>{buttonText}</button>
          </div>
        )}
      </div>
    </div>
  );
};

// 📌 Definimos las props por defecto
CustomCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  imageUrl: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  featuresAsList: PropTypes.bool,
};

// 📌 Valores por defecto
CustomCard.defaultProps = {
  price: "",
  features: [],
};

export default CustomCard;
