
import React, { useState } from "react";
import "./sidebarMenu.scss";
import { BsStars } from "react-icons/bs";
import { FiMenu } from "react-icons/fi"; // Icono hamburguesa
import { IoClose } from "react-icons/io5"; // Icono de cerrar opcional
import { useAuth } from "../../../context/authProviderContext";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";


const SidebarMenu = ({ onSelect, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleToggleSidebar = () => setIsOpen(!isOpen);
  const handleSelect = (section) => {
    onSelect(section);
    setIsOpen(false); // Cierra menú al seleccionar
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // o la ruta de inicio que uses
  };

  return (
    <>
      <button className="hamburger-btn" onClick={handleToggleSidebar}>
        {isOpen ? <IoClose /> : <FiMenu />}
      </button>

      <div className={`sidebar-menu ${!isOpen ? "mobile-hidden" : ""}`}>
        <h2 className="sidebar-title text-center">My OKAPI</h2>
        <ul className="menu-list">
          <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => handleSelect("dashboard")}>Dashboard</li>
          <li className={activeSection === "buy-license" ? "active" : ""} onClick={() => handleSelect("buy-license")}>Buy License</li>
          <li className={activeSection === "projects" ? "active" : ""} onClick={() => handleSelect("projects")}>My Projects</li>
          <li className={activeSection === "profile" ? "active" : ""} onClick={() => handleSelect("profile")}>Profile</li>
          <li className={activeSection === "magicOkapi" ? "active" : ""} onClick={() => handleSelect("magicOkapi")}>
            <BsStars className="icon-magic-sidebar" />
            Magic OKAPI
          </li>
          <li className={activeSection === "settings" ? "active" : ""} onClick={() => handleSelect("settings")}>Settings</li>
          <li onClick={handleLogout} className="menu-item logout-btn">
            <BiLogOut />
            <span className="logout-text">Sign Out</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarMenu;
