// src/pages/MyAccountPage/MyAccountPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authProviderContext';
import './myAccountPage.scss';

const API_URL = 'https://api.olawee.com/wp-json';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, getToken } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [activeTab, setActiveTab] = useState('licenses'); // licenses, orders, settings
  const [loading, setLoading] = useState(true);

  const api = {
    async getOrders(userId, token) {
      const res = await fetch(`${API_URL}/olawee/v1/orders?customer_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'No se pudieron cargar los pedidos');
      return Array.isArray(data) ? data : (data.orders || []);
    },
  
    async updateOrder(orderId, payload, token) {
      const res = await fetch(`${API_URL}/olawee/v1/orders/${orderId}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          // si tu backend usa orígenes por cabecera:
          // 'X-Origin': 'app',
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'No se pudo actualizar el pedido');
      return data;
    },
  
    // Mantén LMFWC como estaba; si no existe, devolvemos []
    async getLicenses(userId, token) {
      try {
        const res = await fetch(`${API_URL}/lmfwc/v2/licenses?user_id=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        return Array.isArray(data?.data) ? data.data : [];
      } catch {
        return [];
      }
    }
  };
  

  const fetchUserData = async () => {
    try {
      const { token } = getToken();
      if (!token) throw new Error('No token');
  
      // Pedidos por endpoint JWT propio
      const ordersData = await api.getOrders(user.id, token);
      setOrders(ordersData);
  
      // Licencias (si hay LMFWC)
      const licensesData = await api.getLicenses(user.id, token);
      setLicenses(licensesData);
  
    } catch (err) {
      console.error('Error al cargar datos del usuario:', err);
      setOrders([]);
      setLicenses([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type: 'login' } }));
      navigate('/');
      return;
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePlan = (currentLicenseId) => {
    // Redirigir a la página de precios para seleccionar nuevo plan
    navigate('/prices', { 
      state: { 
        upgradeMode: true, 
        currentLicenseId 
      } 
    });
  };

  const handleCancelTrial = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu periodo de prueba?')) return;
  
    try {
      const { token } = getToken();
      await api.updateOrder(orderId, { status: 'cancelled', add_note: 'Trial cancelado por el usuario' }, token);
  
      alert('Periodo de prueba cancelado exitosamente');
      fetchUserData();
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar. Contacta con soporte.');
    }
  };
  

  // Helper para detectar órdenes en periodo de prueba
  const getTrialInfo = (order) => {
    const total = parseFloat(order.total);
    if (total === 0 || total === '0.00') {
      // Es periodo de prueba
      const orderDate = new Date(order.date_created);
      const trialEndDate = new Date(orderDate);
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 días de prueba
      
      const now = new Date();
      const daysLeft = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));
      
      return {
        isTrial: true,
        endDate: trialEndDate,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        isActive: daysLeft > 0
      };
    }
    return { isTrial: false };
  };

  if (loading) {
    return (
      <div className="myaccount-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myaccount-page">
      <div className="myaccount-container">
        <div className="account-header">
          <div>
            <h1>Mi Cuenta</h1>
            <p>Hola, {user?.firstName || user?.email} 👋</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>

        <div className="account-tabs">
          <button
            className={`tab ${activeTab === 'licenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('licenses')}
          >
            <span className="tab-icon">🔑</span>
            Mis Licencias
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">📦</span>
            Mis Pedidos
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="tab-icon">⚙️</span>
            Configuración
          </button>
        </div>

        <div className="account-content">
          {/* TAB: LICENCIAS */}
          {activeTab === 'licenses' && (
            <div className="licenses-section">
              <div className="section-header">
                <h2>Tus licencias activas</h2>
                <Link to="/prices" className="btn-new-license">
                  + Nueva licencia
                </Link>
              </div>

              {/* Mostrar órdenes en periodo de prueba primero */}
              {orders.filter(order => {
                const trialInfo = getTrialInfo(order);
                return trialInfo.isTrial && trialInfo.isActive && order.status !== 'cancelled';
              }).map(order => {
                const trialInfo = getTrialInfo(order);
                return (
                  <div key={order.id} className="trial-card">
                    <div className="trial-badge">
                      <span className="badge-icon">⏰</span>
                      <span>Periodo de prueba</span>
                    </div>
                    
                    <div className="trial-header">
                      <h3>{order.line_items[0]?.name || 'Plan Premium'}</h3>
                      <div className="trial-timer">
                        <strong>{trialInfo.daysLeft}</strong> días restantes
                      </div>
                    </div>

                    <div className="trial-info">
                      <p>✓ Acceso completo a todas las funcionalidades</p>
                      <p>✓ Sin compromiso - cancela cuando quieras</p>
                      <p className="trial-end">
                        Termina el: <strong>{trialInfo.endDate.toLocaleDateString()}</strong>
                      </p>
                      <p className="trial-charge">
                        Después del periodo de prueba se cobrará: <strong>50€</strong>
                      </p>
                    </div>

                    <div className="trial-actions">
                      <Link to="/prices" className="btn-upgrade">
                        Actualizar ahora
                      </Link>
                      <button 
                        onClick={() => handleCancelTrial(order.id)}
                        className="btn-cancel-trial"
                      >
                        Cancelar prueba
                      </button>
                    </div>

                    <div className="trial-note">
                      <small>
                        💡 Si cancelas durante el periodo de prueba, no se te cobrará nada.
                      </small>
                    </div>
                  </div>
                );
              })}

              {/* Mostrar licencias normales */}
              {licenses.length === 0 && orders.filter(o => getTrialInfo(o).isTrial).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔑</div>
                  <h3>No tienes licencias activas</h3>
                  <p>Adquiere tu primera licencia para empezar a disfrutar de todas las funcionalidades.</p>
                  <Link to="/prices" className="btn-primary">
                    Ver planes disponibles
                  </Link>
                </div>
              ) : (
                <div className="licenses-grid">
                  {licenses.map((license) => (
                    <div key={license.id} className="license-card">
                      <div className="license-header">
                        <span className={`license-status ${license.status}`}>
                          {license.status === 'active' ? '✓ Activa' : '⚠ Inactiva'}
                        </span>
                        <span className="license-type">Premium</span>
                      </div>

                      <div className="license-body">
                        <h3>{license.product_name || 'Licencia Olawee'}</h3>
                        <div className="license-key">
                          <code>{license.license_key}</code>
                          <button 
                            onClick={() => navigator.clipboard.writeText(license.license_key)}
                            className="btn-copy"
                            title="Copiar"
                          >
                            📋
                          </button>
                        </div>

                        <div className="license-details">
                          <div className="detail-row">
                            <span>Activaciones:</span>
                            <span>{license.times_activated || 0} / {license.times_activated_max || '∞'}</span>
                          </div>
                          <div className="detail-row">
                            <span>Válida hasta:</span>
                            <span>{license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Sin límite'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="license-actions">
                        <button 
                          onClick={() => handleChangePlan(license.id)}
                          className="btn-change-plan"
                        >
                          Cambiar plan
                        </button>
                        <button className="btn-renew">Renovar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>Historial de pedidos</h2>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No tienes pedidos</h3>
                  <p>Cuando realices una compra, aparecerá aquí.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const trialInfo = getTrialInfo(order);
                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Pedido #{order.id}</h3>
                            <p className="order-date">
                              {new Date(order.date_created).toLocaleDateString()}
                            </p>
                            {trialInfo.isTrial && (
                              <span className="trial-label">
                                {trialInfo.isActive ? '⏰ Periodo de prueba activo' : '✓ Prueba completada'}
                              </span>
                            )}
                          </div>
                          <span className={`order-status status-${order.status}`}>
                            {order.status === 'completed' && '✓ Completado'}
                            {order.status === 'processing' && '⏳ Procesando'}
                            {order.status === 'pending' && '⏰ Pendiente'}
                            {order.status === 'cancelled' && '✗ Cancelado'}
                          </span>
                        </div>

                        <div className="order-items">
                          {order.line_items?.map((item, idx) => (
                            <div key={idx} className="order-item">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="item-price">
                                {trialInfo.isTrial ? '0€ (Prueba)' : `${item.total}€`}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            Total: <strong>{trialInfo.isTrial ? '0€' : `${order.total}€`}</strong>
                          </div>
                          <Link 
                            to={`/order-confirmation/${order.id}${trialInfo.isTrial ? '?trial=true' : ''}`}
                            className="btn-view-details"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: CONFIGURACIÓN */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Configuración de la cuenta</h2>

              <div className="settings-card">
                <h3>Información personal</h3>
                <div className="settings-info">
                  <div className="info-row">
                    <span>Email:</span>
                    <strong>{user?.email}</strong>
                  </div>
                  <div className="info-row">
                    <span>Nombre:</span>
                    <strong>{user?.firstName} {user?.lastName}</strong>
                  </div>
                </div>
                <button className="btn-edit">Editar información</button>
              </div>

              <div className="settings-card">
                <h3>Seguridad</h3>
                <button className="btn-edit">Cambiar contraseña</button>
              </div>

              <div className="settings-card danger">
                <h3>Zona de peligro</h3>
                <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
                <button className="btn-danger">Eliminar cuenta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;