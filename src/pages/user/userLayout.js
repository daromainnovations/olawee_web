
// src/pages/user/UserLayout.js
import React from "react";
import Sidebar from "../../components/userComponents/Sidebar/Sidebar";
import "./userLayout.scss";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="user-layout d-flex">
      <Sidebar />
      <div className="user-content p-4 w-100">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
