
import React, { useState } from "react";

import "./UserPanel.scss"; // Estilos generales del panel
import Dashboard from "../../../pages/user/sections/dashboard";

import SidebarMenu from "../sidebarMenu/sidebarMenu";
import BuyLicense from "../../../pages/user/sections/buyLicense";
import Projects from "../../../pages/user/sections/projects";
import Profile from "../../../pages/user/sections/profile";
import { Settings } from "lucide-react";
import MagicOkapi from "../../../pages/user/sections/magicOkapi";

const UserPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = (section) => {
    switch (section) {
        case "dashboard":
            return <Dashboard />;
        case "buy-license":
            return <BuyLicense />;
        case "projects":
            return <Projects />;
        case "profile":
            return <Profile />;
        case "magicOkapi":
            return <MagicOkapi />;
        case "settings":
            return <Settings />;
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
