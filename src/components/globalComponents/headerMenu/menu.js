
import { useEffect, useRef, useState } from "react";
import "./menu.scss";
import "../../../../src/styles/hiddenProvisional.scss"
import logo from "../../../media/img/Logo_Okapi_Web.png"

import { useLocation } from "react-router-dom";
import BackArrow from "../backArrow/backArrow";
import AuthModal from "../login/authModal";
import { useAuth } from "../../../context/authProviderContext";
// import LogOutButton from "../login/logOutButton";
import UserCircle  from "../../userComponents/UserCircle/UserCircle";


const Menu = ({ bannerHeight, customClass = "" }) => {
  const [menuTop, setMenuTop] = useState(0);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const offcanvasRef = useRef(null); // Usaremos una referencia para el offcanvas
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const { user } = useAuth();

  const [modalType, setModalType] = useState(null);


  // Actualizar la posición del menú cuando cambia el bannerHeight
  useEffect(() => {
    if (bannerHeight > 0) {
      setMenuTop(bannerHeight);
    }
  }, [bannerHeight]);

  // Manejo de eventos para abrir y cerrar el offcanvas
  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;

    if (!offcanvasElement) return; // Evitar errores si el elemento no está disponible

    const handleShow = () => {
      setIsOffcanvasOpen(true); // Hacer el overlay visible cuando se abre el offcanvas
    };
    const handleHide = () => {
      setIsOffcanvasOpen(false); // Hacer el overlay invisible cuando se cierra el offcanvas
    };

    // Escuchamos los eventos para el offcanvas (mostrar y ocultar)
    offcanvasElement.addEventListener("shown.bs.offcanvas", handleShow);
    offcanvasElement.addEventListener("hidden.bs.offcanvas", handleHide);

    return () => {
      offcanvasElement.removeEventListener("shown.bs.offcanvas", handleShow);
      offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleHide);
    };
  }, []);

  return (
    <>
      {/* Capa de fondo oscuro cuando el offcanvas está abierto */}
      <div className={`overlay ${isOffcanvasOpen ? "active" : ""}`}></div>

      <nav
        className={`navbar navbar-expand-lg fixed-top ${customClass}`}
        style={{ top: `${menuTop}px`, width: "100%", transition: "top 0.5s ease-in-out" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center w-100">
          {/* Logo */}{/* Reemplaza el logo solo en la página caseStudyPage */}
          <div className="logo" >
            {location.pathname.startsWith('/case-study/') || location.pathname === '/faq' ? (
                <BackArrow/>  // Si estamos en la página 'caseStudyPage', mostramos el nuevo componente
              ) : (
                <img src={logo} alt="Logo" style={{ width: "1300px", height: "auto" }} />  // Si no, mostramos el logo original
              )}
          </div>

          {/* Botón de hamburguesa para pantallas pequeñas */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú de navegación */}
          <div className="offcanvas offcanvas-top" id="navbarContent" ref={offcanvasRef}>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">OKAPI</h5>
              <button
                type="button"
                className="btn-close text-reset custom-close-btn"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div className="d-flex flex-column flex-lg-row align-items-lg-center w-100 justify-content-end">
                <div className="navbar-nav d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                  <a className={`nav-link ${location.pathname === "/" ? "active" : ""}`} href="/">Home</a>
                  <a className={`nav-link ${location.pathname === "/Prices" ? "active" : ""}`} href="/Prices">Prices</a>
                  <a className={`nav-link ${location.pathname === "/customize" ? "active" : ""}`} href="/customize">Customize Roi</a>
                  <a className={`nav-link hiddenProvisional ${location.pathname === "/user-cases" ? "active" : ""}`} href="/user-cases">User Cases</a>
                  <a className={`nav-link hiddenProvisional ${location.pathname === "/integrate" ? "active" : ""}`} href="/integrate">Integrate</a>
                  <li
                    className={`nav-item hiddenProvisional dropdown ${location.pathname.startsWith("/customize") ? "active" : ""}`}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <a
                      className="nav-link dropdown-toggle"
                      href="#/"
                      id="customizeRoIDropdown"
                      role="button"
                      aria-expanded={isDropdownOpen}
                    >
                      Customize RoI
                    </a>
                    <ul
                      className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                      aria-labelledby="customizeRoIDropdown"
                    >
                      <li>
                        <a className={`dropdown-item ${location.pathname === "/customize/idi" ? "active" : ""}`} href="/customize/idi">
                          I+D+I
                        </a>
                      </li>
                      <li>
                        <a className={`dropdown-item ${location.pathname === "/customize/ia" ? "active" : ""}`} href="/customize/ia">
                          IA
                        </a>
                      </li>
                      <li>
                        <a className={`dropdown-item ${location.pathname === "/customize/ia" ? "active" : ""}`} href="/customize/socialProyect">
                          Social Proyect
                        </a>
                      </li>
                      <li>
                        <a className={`dropdown-item ${location.pathname === "/customize/ia" ? "active" : ""}`} href="/customize/socialProyect">
                          BI (Business Intelligence)
                        </a>
                      </li>
                    </ul>
                  </li>
                  <a className={`nav-link ${location.pathname === "/faq" ? "active" : ""}`} href="/faq">FAQ</a>
                </div>

                <div className="container-buttons d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3 mt-3 mt-lg-0">
                  {!user ? (
                    <>
                      <button className="btn-login" onClick={() => setModalType("login")}>
                        Log In
                      </button>
                      <button className="btn-signUp" onClick={() => setModalType("signup")}>
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <UserCircle />
                  )}
                  {modalType && <AuthModal modalType={modalType} setModalType={setModalType} />}
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Menu;
