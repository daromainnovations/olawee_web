
// src/pages/user/sections/buyLicense.jsx
import React from "react";
import { useUserData } from "../../../hooks/useUserData";
import ProductsSection from "../../../components/pricesComponents/productsSection/productsSection";
import "../sections/styles/buyLicense.scss";

const BuyLicense = () => {
  const { licenses, orders, loading, getTrialInfo } = useUserData();

  // Contar licencias activas
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  
  // Contar trials activos
  const activeTrials = orders.filter(order => {
    const trialInfo = getTrialInfo(order);
    return trialInfo.isTrial && trialInfo.isActive && order.status !== 'cancelled';
  }).length;

  return (
    <div className="div-principal-licencias">
      {/* Resumen de licencias actuales */}
      <div className="current-licenses-summary">
        <h2>Your Current Licenses</h2>
        <div className="licenses-summary-grid">
          <div className="summary-card">
            <div className="summary-icon">🔑</div>
            <div className="summary-info">
              <h3>{loading ? '...' : activeLicenses}</h3>
              <p>Active Licenses</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">⏰</div>
            <div className="summary-info">
              <h3>{loading ? '...' : activeTrials}</h3>
              <p>Active Trials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivador para comprar más */}
      <div className="products-title-motivator">
        <h2>Get new licenses and unlock more value with Olawee!</h2>
        <p>Explore the plans that best suit your needs and boost your ROI even further.</p>
      </div>
      
      <ProductsSection />
    </div>
  );
};

export default BuyLicense;