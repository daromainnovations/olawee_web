import { useState } from "react";
import "./footer.scss"
import logo from "../../../media/img/Imagotipo_Okapi_cabeza.png"
import ContactForm from "../../contacto/contactForm"

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
    <footer className="footer">
      <div className="footer-columns">
        {/* Columna 1: Logo e enlaces */}
        <div className="footer-column container-logo-footer">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>

        {/* Columna 2: Título y 4 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">OLAWEE</h4>
          <ul className="footer-links">
            <li><a href="#servicio1">Inicio</a></li>
            <li><a href="#servicio2">Precios</a></li>
            <li><a href="#servicio3">Casos de uso</a></li>
            <li><a href="#servicio4">Personalizar Agentes</a></li>
          </ul>
        </div>

        {/* Columna 3: Título y 3 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">GENERAL</h4>
          <ul className="footer-links">
            <li><a href="#contact" onClick={handleOpenModal}>Contacto</a></li>
            <li><a href="#terms">Términos de servicio</a></li>
            <li><a href="#agreement">Acuerdo para equipos</a></li>
            <li><a href="#privacy">Privacidad</a></li>
          </ul>
        </div>

        {/* Columna 4: Título y 3 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">CONECTA</h4>
          <ul className="footer-links">
            <li><a href="#linkedin">LinkedIn</a></li>
            <li><a href="#twitter">X / Twitter</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>
      </div>

      {/* Texto centrado debajo de las columnas */}
      <div className="footer-bottom">
        <p>© 2025 All rights reserved</p>
      </div>
    </footer>

    {showModal && <ContactForm onClose={handleCloseModal} />}
  </>
  );
};

export default Footer;
