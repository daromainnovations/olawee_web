
import React, { useState } from "react";

import "./UserPanel.scss"; // Estilos generales del panel
import Dashboard from "../../../pages/user/sections/dashboard";

import SidebarMenu from "../sidebarMenu/sidebarMenu";
import BuyLicense from "../../../pages/user/sections/buyLicense";
import Profile from "../../../pages/user/sections/profile";

import MyOrders from "../../../pages/user/sections/myOrders";
import MyLicenses from "../../../pages/user/sections/myLicenses";

const UserPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = (section) => {
    switch (section) {
      case "dashboard":
        return <Dashboard />;
      case "licenses":
        return <MyLicenses />;
      case "orders":
        return <MyOrders />;
      case "buy-license":
        return <BuyLicense />;
      
      case "profile":
        return <Profile />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="user-panel">
      <SidebarMenu onSelect={setActiveSection} activeSection={activeSection} />
      <div className="user-panel-content">
        {renderSection(activeSection)}
      </div>
    </div>
  );
};

export default UserPanel;
