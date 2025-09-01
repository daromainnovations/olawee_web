

import React from "react";
import { useAuth } from "../../../context/authProviderContext";
import "../sections/styles/dashboard.scss"
import NewsPreviewSection from "./newsPreviewSection";

const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.first_name || user?.billing?.first_name || user?.username || user?.email || "User";

  return (
    <div className="dashboard-content">
      <header className="dashboard-header d-flex justify-content-center flex-column align-items-center">
        <h1>Welcome {userName}</h1>
        <p>Here's a quick overview of your activity</p>
      </header>

      <div className="first-section d-flex flex-wrap gap-4 equal-height-sections">
        <section className="dashboard-widgets-section flex-fill">
          <h6 className="dashboard-widgets-title text-start">QUICK ACTIONS</h6>
          <div className="dashboard-widgets d-flex justify-content-around flex-wrap">
            <div className="widget-card d-flex flex-column align-items-center">
              <i className="bi bi-shield-fill-check icon-widget"></i>
              <h4>Active Licenses</h4>
            </div>
            <div className="widget-card d-flex flex-column align-items-center">
              <i className="bi bi-envelope-plus-fill icon-widget"></i>
              <h4>New Message</h4>
            </div>
            <div className="widget-card d-flex flex-column align-items-center">
              <i className="bi bi-gear-fill icon-widget"></i>
              <h4>Manage Settings</h4>
            </div>
          </div>
        </section>

        <section className="dashboard-widgets-section flex-fill">
          <h6 className="dashboard-widgets-title text-center">MIS PROYECTOS</h6>
          <div className="d-flex justify-content-around flex-wrap">
            {/* Aquí puedes añadir los proyectos */}
          </div>
        </section>
      </div>
      
      <NewsPreviewSection />
    </div>
  );
};

export default Dashboard;
