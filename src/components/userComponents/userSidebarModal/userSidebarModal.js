
import React from "react";
import "./userSidebarModal.scss";
import { useAuth } from "../../../context/authProviderContext";
import { deleteWooCommerceSessionCookies } from "../../../utils/sessionUtils";

const UserSidebarModal = ({ isOpen, onClose }) => {

    const { user, logout } = useAuth();
    const firstName = user?.first_name || user?.billing?.first_name;
    const lastName = user?.last_name || user?.billing?.last_name;

    const fullName = firstName
    ? `${firstName} ${lastName || ""}`.trim()
    : user?.username || user?.email || "Usuario";

    if (!user) return null;


    const handleLogout = () => {
        const confirmed = window.confirm("¿Seguro que quieres cerrar sesión?");
        if (confirmed) {
          deleteWooCommerceSessionCookies();
          logout(); // 🔥 limpia el contexto
          onClose(); // 🔒 cierra el modal también
        }
      };

  return (
    <div className={`sidebar-modal ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="top-bar d-flex justify-content-between align-items-center">
            <span className="user-name">{fullName}</span>
            <button className="close-btn" onClick={onClose}>
                <i className="bi bi-x"></i>
            </button>
        </div>
            
        <ul className="sidebar-links text-start">
          <li><a href="/dashboard" className="w-100 d-block">Dashboard</a></li>
          <li><a href="/licenses" className="w-100 d-block">Licenses</a></li>
          <li><a href="/billing" className="w-100 d-block">Billing</a></li>
          <li><a href="/settings" className="w-100 d-block">Settings</a></li>
          <li><button className="logout-btn w-100 d-block" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
      {isOpen && <div className="backdrop" onClick={onClose}></div>}
      
    </div>
  );
};

export default UserSidebarModal;
