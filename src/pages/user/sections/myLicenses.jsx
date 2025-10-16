
// src/pages/user/sections/myLicenses.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authProviderContext";
import { useUserData } from "../../../hooks/useUserData";
import "../sections/styles/myLicenses.scss";

const MyLicenses = () => {
  const { getToken } = useAuth();
  const { licenses, orders, loading, getTrialInfo, refetch } = useUserData();

  const handleCancelTrial = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu periodo de prueba?')) {
      return;
    }

    try {
      const { token } = getToken();
      const response = await fetch(`https://api.olawee.com/wp-json/wc/v3/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        alert('Periodo de prueba cancelado exitosamente');
        refetch();
      } else {
        alert('Error al cancelar. Contacta con soporte.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar. Contacta con soporte.');
    }
  };

  if (loading) {
    return (
      <div className="licenses-loading">
        <div className="spinner"></div>
        <p>Loading licenses...</p>
      </div>
    );
  }

  // Filtrar trials activos
  const activeTrials = orders.filter(order => {
    const trialInfo = getTrialInfo(order);
    return trialInfo.isTrial && trialInfo.isActive && order.status !== 'cancelled';
  });

  return (
    <div className="my-licenses-section">
      <div className="section-header">
        <h2>Your Active Licenses</h2>
        <Link to="/prices" className="btn-new-license">
          + New License
        </Link>
      </div>

      {/* Trials Activos */}
      {activeTrials.map(order => {
        const trialInfo = getTrialInfo(order);
        return (
          <div key={order.id} className="trial-card">
            <div className="trial-badge">
              <span className="badge-icon">⏰</span>
              <span>Trial Period</span>
            </div>
            
            <div className="trial-header">
              <h3>{order.line_items[0]?.name || 'Premium Plan'}</h3>
              <div className="trial-timer">
                <strong>{trialInfo.daysLeft}</strong> days left
              </div>
            </div>

            <div className="trial-info">
              <p>✓ Full access to all features</p>
              <p>✓ No commitment - cancel anytime</p>
              <p className="trial-end">
                Ends on: <strong>{trialInfo.endDate.toLocaleDateString()}</strong>
              </p>
              <p className="trial-charge">
                After trial period: <strong>50€</strong>
              </p>
            </div>

            <div className="trial-actions">
              <Link to="/prices" className="btn-upgrade">
                Upgrade Now
              </Link>
              <button 
                onClick={() => handleCancelTrial(order.id)}
                className="btn-cancel-trial"
              >
                Cancel Trial
              </button>
            </div>

            <div className="trial-note">
              <small>
                💡 Cancel during trial period and you won't be charged anything.
              </small>
            </div>
          </div>
        );
      })}

      {/* Licencias Normales */}
      {licenses.length === 0 && activeTrials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔑</div>
          <h3>No active licenses</h3>
          <p>Get your first license to start enjoying all features.</p>
          <Link to="/prices" className="btn-primary">
            View Available Plans
          </Link>
        </div>
      ) : (
        <div className="licenses-grid">
          {licenses.map((license) => (
            <div key={license.id} className="license-card">
              <div className="license-header">
                <span className={`license-status ${license.status}`}>
                  {license.status === 'active' ? '✓ Active' : '⚠ Inactive'}
                </span>
                <span className="license-type">Premium</span>
              </div>

              <div className="license-body">
                <h3>{license.product_name || 'Olawee License'}</h3>
                <div className="license-key">
                  <code>{license.license_key}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(license.license_key)}
                    className="btn-copy"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>

                <div className="license-details">
                  <div className="detail-row">
                    <span>Activations:</span>
                    <span>{license.times_activated || 0} / {license.times_activated_max || '∞'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Valid until:</span>
                    <span>
                      {license.expires_at 
                        ? new Date(license.expires_at).toLocaleDateString() 
                        : 'Unlimited'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="license-actions">
                <Link to="/prices" className="btn-change-plan">
                  Change Plan
                </Link>
                <button className="btn-renew">Renew</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLicenses;