
// import React, { useState } from "react";
// import "./sidebarMenu.scss";
// import { BsStars } from "react-icons/bs";
// import { FiMenu } from "react-icons/fi"; // Icono hamburguesa
// import { IoClose } from "react-icons/io5"; // Icono de cerrar opcional
// import { useAuth } from "../../../context/authProviderContext";
// import { useNavigate } from "react-router-dom";
// import { BiLogOut } from "react-icons/bi";


// const SidebarMenu = ({ onSelect, activeSection }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleToggleSidebar = () => setIsOpen(!isOpen);
//   const handleSelect = (section) => {
//     onSelect(section);
//     setIsOpen(false); // Cierra menú al seleccionar
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/"); // o la ruta de inicio que uses
//   };

//   return (
//     <>
//       <button className="hamburger-btn" onClick={handleToggleSidebar}>
//         {isOpen ? <IoClose /> : <FiMenu />}
//       </button>

//       <div className={`sidebar-menu ${!isOpen ? "mobile-hidden" : ""}`}>
//         <h2 className="sidebar-title text-center">My OKAPI</h2>
//         <ul className="menu-list">
//           <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => handleSelect("dashboard")}>Dashboard</li>
//           <li className={activeSection === "buy-license" ? "active" : ""} onClick={() => handleSelect("buy-license")}>Buy License</li>
//           <li className={activeSection === "projects" ? "active" : ""} onClick={() => handleSelect("projects")}>My Projects</li>
//           <li className={activeSection === "profile" ? "active" : ""} onClick={() => handleSelect("profile")}>Profile</li>
//           <li className={activeSection === "magicOkapi" ? "active" : ""} onClick={() => handleSelect("magicOkapi")}>
//             <BsStars className="icon-magic-sidebar" />
//             Magic OKAPI
//           </li>
//           <li className={activeSection === "settings" ? "active" : ""} onClick={() => handleSelect("settings")}>Settings</li>
//           <li onClick={handleLogout} className="menu-item logout-btn">
//             <BiLogOut />
//             <span className="logout-text">Sign Out</span>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default SidebarMenu;








// src/components/sidebarMenu/sidebarMenu.jsx (ACTUALIZADO)
import React, { useState } from "react";
import "./sidebarMenu.scss";
import { BsStars } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard, MdShoppingCart } from "react-icons/md";
import { FaKey, FaBoxOpen, FaFolderOpen, FaUser, FaCog } from "react-icons/fa";
import { useAuth } from "../../../context/authProviderContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../media/img/Logo_Olawee_Web.png";

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
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/"); // O la ruta de tu página principal
  };

  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <MdDashboard className="menu-icon" />
    },
    { 
      id: "licenses", 
      label: "My Licenses", 
      icon: <FaKey className="menu-icon" />,
      showBadge: true // Puedes agregar lógica para mostrar badge con trials activos
    },
    { 
      id: "orders", 
      label: "My Orders", 
      icon: <FaBoxOpen className="menu-icon" />
    },
    { 
      id: "buy-license", 
      label: "Buy License", 
      icon: <MdShoppingCart className="menu-icon" />
    },
    { 
      id: "projects", 
      label: "My Projects", 
      icon: <FaFolderOpen className="menu-icon" />
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: <FaUser className="menu-icon" />
    },
    { 
      id: "magicOkapi", 
      label: "Magic OKAPI", 
      icon: <BsStars className="menu-icon icon-magic-sidebar" />
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <FaCog className="menu-icon" />
    }
  ];

  return (
    <>
      <button className="hamburger-btn" onClick={handleToggleSidebar}>
        {isOpen ? <IoClose /> : <FiMenu />}
      </button>

      <div className={`sidebar-menu ${!isOpen ? "mobile-hidden" : ""}`}>
        {/* <h2 className="sidebar-title text-center">My OKAPI</h2> */}
        <div className="logo-container-sidebar text-center">
          <button 
              className="back-arrow-btn" 
              onClick={handleGoHome}
              title="Back to Home"
          >
              <IoArrowBack />
          </button>
          <img src={logo} alt="logo olawee" className="sidebar-logo"></img>
        </div>
        
        
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleSelect(item.id)}
            >
              {item.icon}
              <span className="menu-text">{item.label}</span>
              {item.showBadge && <span className="badge-dot"></span>}
            </li>
          ))}
          
          <li onClick={handleLogout} className="menu-item logout-btn">
            <BiLogOut className="menu-icon" />
            <span className="logout-text">Sign Out</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarMenu;