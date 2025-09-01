
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./backArrow.scss";
import { FaArrowLeftLong } from "react-icons/fa6";

const BackArrow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // Si estamos en la página '/faq', redirigimos a la página de inicio
    if (location.pathname === '/faq') {
      navigate('/');
    } else {
      navigate(-1);  // En cualquier otra página, volvemos a la página anterior
    }
  };

  return (
    <div className="back-arrow-container d-flex align-items-center" onClick={handleClick}>
        <button className="back-arrow">
            <FaArrowLeftLong size={18} />
        </button>
        <p className="back">Back</p>
    </div>
    
  );
};

export default BackArrow;
