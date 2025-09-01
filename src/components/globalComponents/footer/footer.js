import "./footer.scss"
import logo from "../../../media/img/Imagotipo_Okapi_cabeza.png"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Columna 1: Logo e enlaces */}
        <div className="footer-column container-logo-footer">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>

        {/* Columna 2: Título y 4 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">OKAPI</h4>
          <ul className="footer-links">
            <li><a href="#servicio1">Home</a></li>
            <li><a href="#servicio2">Prices</a></li>
            <li><a href="#servicio3">User Cases</a></li>
            <li><a href="#servicio4">Customize RoI</a></li>
          </ul>
        </div>

        {/* Columna 3: Título y 3 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">GENERAL</h4>
          <ul className="footer-links">
            <li><a href="#contact">Contact</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#agreement">Teams agreement</a></li>
            <li><a href="#privacy">Privacy</a></li>
          </ul>
        </div>

        {/* Columna 4: Título y 3 enlaces */}
        <div className="footer-column">
          <h4 className="footer-title">CONNECT</h4>
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
  );
};

export default Footer;
