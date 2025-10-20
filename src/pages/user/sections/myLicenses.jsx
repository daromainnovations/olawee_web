// // src/pages/MyLicensesPage/MyLicensesPage.jsx
// import React, { useState, useEffect } from 'react';
// import '../sections/styles/myLicenses.scss';
// import { useAuth } from '../../../context/authProviderContext';

// const API_URL = process.env.REACT_APP_WC_API_URL || 'https://api.olawee.com/wp-json';

// const MyLicensesPage = () => {
//   const { user, getToken } = useAuth();
//   const [licenses, setLicenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!user?.id) return;
    
//     fetchLicenses();
//   }, [user]);

//   const fetchLicenses = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const { token, sessionToken } = getToken();
      
//       const response = await fetch(`${API_URL}/olawee/v1/licenses/user/${user.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'X-Session-Token': sessionToken || ''
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Error al cargar las licencias');
//       }

//       const data = await response.json();
//       setLicenses(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       active: { label: 'Activa', class: 'status-active', icon: '✅' },
//       suspended: { label: 'Suspendida', class: 'status-suspended', icon: '⏸️' },
//       cancelled: { label: 'Cancelada', class: 'status-cancelled', icon: '❌' },
//       expired: { label: 'Expirada', class: 'status-expired', icon: '⏰' }
//     };
    
//     const badge = badges[status] || badges.active;
    
//     return (
//       <span className={`status-badge ${badge.class}`}>
//         <span className="badge-icon">{badge.icon}</span>
//         {badge.label}
//       </span>
//     );
//   };

//   const getLicenseTypeName = (type) => {
//     const types = {
//       explora: 'OLAWEE Explora',
//       impulsa: 'OLAWEE Impulsa',
//       entidad: 'OLAWEE Entidad',
//       standard: 'Licencia Estándar'
//     };
    
//     return types[type] || type;
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     // Aquí podrías mostrar una notificación
//     alert('Clave copiada al portapapeles');
//   };

//   if (loading) {
//     return (
//       <div className="licenses-page">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Cargando licencias...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="licenses-page">
//         <div className="error-message">
//           <h2>⚠️ Error</h2>
//           <p>{error}</p>
//           <button onClick={fetchLicenses} className="btn-retry">
//             Reintentar
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="licenses-page">
//       <div className="licenses-header">
//         <h1>Mis Licencias</h1>
//         <p>Gestiona tus licencias activas de Olawee</p>
//       </div>

//       {licenses.length === 0 ? (
//         <div className="no-licenses">
//           <div className="no-licenses-icon">🔑</div>
//           <h2>No tienes licencias activas</h2>
//           <p>Cuando adquieras un producto, tus licencias aparecerán aquí.</p>
//           <a href="/prices" className="btn-primary">Ver planes</a>
//         </div>
//       ) : (
//         <div className="licenses-grid">
//           {licenses.map((license) => (
//             <div key={license.id} className="license-card">
//               <div className="license-card-header">
//                 <div className="license-type">
//                   <span className="type-icon">🎯</span>
//                   <h3>{getLicenseTypeName(license.type)}</h3>
//                 </div>
//                 {getStatusBadge(license.status)}
//               </div>

//               <div className="license-card-body">
//                 <div className="license-key-section">
//                   <label>Clave de licencia</label>
//                   <div className="license-key-wrapper">
//                     <code className="license-key">{license.key}</code>
//                     <button 
//                       className="btn-copy" 
//                       onClick={() => copyToClipboard(license.key)}
//                       title="Copiar clave"
//                     >
//                       📋
//                     </button>
//                   </div>
//                 </div>

//                 <div className="license-info">
//                   <div className="info-row">
//                     <span className="info-label">Creada:</span>
//                     <span className="info-value">
//                       {new Date(license.created).toLocaleDateString('es-ES')}
//                     </span>
//                   </div>

//                   {license.subscription_id && (
//                     <div className="info-row">
//                       <span className="info-label">Suscripción:</span>
//                       <span className="info-value">#{license.subscription_id}</span>
//                     </div>
//                   )}

//                   {license.order_id && (
//                     <div className="info-row">
//                       <span className="info-label">Pedido:</span>
//                       <span className="info-value">#{license.order_id}</span>
//                     </div>
//                   )}
//                 </div>

//                 {license.status === 'active' && (
//                   <div className="license-actions">
//                     <button className="btn-manage">
//                       Gestionar suscripción
//                     </button>
//                   </div>
//                 )}

//                 {license.status === 'suspended' && (
//                   <div className="license-warning">
//                     <span className="warning-icon">⚠️</span>
//                     <p>Esta licencia está suspendida. Por favor, actualiza tu método de pago.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyLicensesPage;





// src/pages/MyLicensesPage/MyLicensesPage.jsx - VERSIÓN SIMPLE
import React, { useState, useEffect } from 'react';
import '../sections/styles/myLicenses.scss';
import { useAuth } from '../../../context/authProviderContext';
import { 
  obtenerSuscripcionesUsuario, 
  formatearFechaProximoPago,
  verificarProximoVencimiento,
  obtenerEstadoTraducido 
} from '../../../services/wpSwingsAPI';

const API_URL = process.env.REACT_APP_WC_API_URL || 'https://api.olawee.com/wp-json';

const MyLicensesPage = () => {
  const { user, getToken } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('licenses');

  useEffect(() => {
    if (!user?.id) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar licencias
        const { token, sessionToken } = getToken();
        
        const licensesResponse = await fetch(`${API_URL}/olawee/v1/licenses/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Session-Token': sessionToken || ''
          }
        });

        if (!licensesResponse.ok) {
          throw new Error('Error al cargar las licencias');
        }

        const licensesData = await licensesResponse.json();
        setLicenses(licensesData);

        // Cargar suscripciones
        const userIdentifier = user.email || user.username || user.user_email;
        const subsResult = await obtenerSuscripcionesUsuario(userIdentifier);
        
        if (subsResult.success) {
          setSubscriptions(subsResult.data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, getToken]); // ✅ Incluye todas las dependencias

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const { token, sessionToken } = getToken();
      
      // Recargar licencias
      const licensesResponse = await fetch(`${API_URL}/olawee/v1/licenses/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken || ''
        }
      });

      if (licensesResponse.ok) {
        const licensesData = await licensesResponse.json();
        setLicenses(licensesData);
      }

      // Recargar suscripciones
      const userIdentifier = user.email || user.username || user.user_email;
      const subsResult = await obtenerSuscripcionesUsuario(userIdentifier);
      
      if (subsResult.success) {
        setSubscriptions(subsResult.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Activa', class: 'status-active', icon: '✅' },
      suspended: { label: 'Suspendida', class: 'status-suspended', icon: '⏸️' },
      cancelled: { label: 'Cancelada', class: 'status-cancelled', icon: '❌' },
      expired: { label: 'Expirada', class: 'status-expired', icon: '⏰' },
      'on-hold': { label: 'En pausa', class: 'status-suspended', icon: '⏸️' },
      pending: { label: 'Pendiente', class: 'status-pending', icon: '⏳' }
    };
    
    const badge = badges[status] || badges.active;
    
    return (
      <span className={`status-badge ${badge.class}`}>
        <span className="badge-icon">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getLicenseTypeName = (type) => {
    const types = {
      explora: 'OLAWEE Explora',
      impulsa: 'OLAWEE Impulsa',
      entidad: 'OLAWEE Entidad',
      standard: 'Licencia Estándar'
    };
    
    return types[type] || type;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Clave copiada al portapapeles');
  };

  const findRelatedSubscription = (license) => {
    if (!license.subscription_id) return null;
    return subscriptions.find(sub => 
      sub.id === parseInt(license.subscription_id) || 
      sub.parentOrderId === license.order_id?.toString()
    );
  };

  if (loading) {
    return (
      <div className="licenses-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="licenses-page">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="licenses-page">
      <div className="licenses-header">
        <h1>Mis Licencias y Suscripciones</h1>
        <p>Gestiona tus productos activos de Olawee</p>
      </div>

      <div className="licenses-tabs">
        <button 
          className={`tab-button ${activeTab === 'licenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('licenses')}
        >
          <span className="tab-icon">🔑</span>
          Licencias ({licenses.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <span className="tab-icon">💳</span>
          Suscripciones ({subscriptions.length})
        </button>
      </div>

      {activeTab === 'licenses' && (
        <>
          {licenses.length === 0 ? (
            <div className="no-licenses">
              <div className="no-licenses-icon">🔑</div>
              <h2>No tienes licencias activas</h2>
              <p>Cuando adquieras un producto, tus licencias aparecerán aquí.</p>
              <a href="/Prices" className="btn-primary">Ver planes</a>
            </div>
          ) : (
            <div className="licenses-grid">
              {licenses.map((license) => {
                const relatedSub = findRelatedSubscription(license);
                const hasActiveSubscription = relatedSub?.status === 'active';

                return (
                  <div key={license.id} className="license-card">
                    <div className="license-card-header">
                      <div className="license-type">
                        <span className="type-icon">🎯</span>
                        <h3>{getLicenseTypeName(license.type)}</h3>
                      </div>
                      {getStatusBadge(license.status)}
                    </div>

                    <div className="license-card-body">
                      <div className="license-key-section">
                        <label>Clave de licencia</label>
                        <div className="license-key-wrapper">
                          <code className="license-key">{license.key}</code>
                          <button 
                            className="btn-copy" 
                            onClick={() => copyToClipboard(license.key)}
                            title="Copiar clave"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      <div className="license-info">
                        <div className="info-row">
                          <span className="info-label">Creada:</span>
                          <span className="info-value">
                            {new Date(license.created).toLocaleDateString('es-ES')}
                          </span>
                        </div>

                        {license.subscription_id && (
                          <div className="info-row">
                            <span className="info-label">Suscripción:</span>
                            <span className="info-value">#{license.subscription_id}</span>
                          </div>
                        )}

                        {license.order_id && (
                          <div className="info-row">
                            <span className="info-label">Pedido:</span>
                            <span className="info-value">#{license.order_id}</span>
                          </div>
                        )}

                        {relatedSub && (
                          <div className="info-row subscription-link">
                            <span className="info-label">Estado de suscripción:</span>
                            <span className="info-value">
                              {obtenerEstadoTraducido(relatedSub.status)}
                              {hasActiveSubscription && ' ✓'}
                            </span>
                          </div>
                        )}
                      </div>

                      {relatedSub && hasActiveSubscription && (
                        (() => {
                          const vencimiento = verificarProximoVencimiento(relatedSub.nextPaymentDate);
                          if (vencimiento.proximoVencer) {
                            return (
                              <div className="license-warning">
                                <span className="warning-icon">⏰</span>
                                <p>{vencimiento.mensaje}</p>
                              </div>
                            );
                          }
                          return null;
                        })()
                      )}

                      {license.status === 'active' && relatedSub && (
                        <div className="license-actions">
                          <button 
                            className="btn-manage"
                            onClick={() => setActiveTab('subscriptions')}
                          >
                            Ver suscripción
                          </button>
                        </div>
                      )}

                      {license.status === 'suspended' && (
                        <div className="license-warning">
                          <span className="warning-icon">⚠️</span>
                          <p>Esta licencia está suspendida. Por favor, actualiza tu método de pago.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'subscriptions' && (
        <>
          {subscriptions.length === 0 ? (
            <div className="no-licenses">
              <div className="no-licenses-icon">💳</div>
              <h2>No tienes suscripciones activas</h2>
              <p>Cuando adquieras un plan, tus suscripciones aparecerán aquí.</p>
              <a href="/Prices" className="btn-primary">Ver planes</a>
            </div>
          ) : (
            <div className="licenses-grid">
              {subscriptions.map((subscription) => {
                const vencimiento = verificarProximoVencimiento(subscription.nextPaymentDate);

                return (
                  <div key={subscription.id} className="license-card subscription-card">
                    <div className="license-card-header">
                      <div className="license-type">
                        <span className="type-icon">💳</span>
                        <h3>{subscription.productName}</h3>
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>

                    <div className="license-card-body">
                      <div className="subscription-price">
                        <div className="price-amount">
                          ${subscription.recurringAmount}
                          <span className="price-period">/mes</span>
                        </div>
                      </div>

                      <div className="license-info">
                        <div className="info-row">
                          <span className="info-label">ID de suscripción:</span>
                          <span className="info-value">#{subscription.id}</span>
                        </div>

                        <div className="info-row">
                          <span className="info-label">Orden padre:</span>
                          <span className="info-value">#{subscription.parentOrderId}</span>
                        </div>

                        <div className="info-row">
                          <span className="info-label">Próximo pago:</span>
                          <span className="info-value">
                            {formatearFechaProximoPago(subscription.nextPaymentDate)}
                          </span>
                        </div>

                        {subscription.expiryDate !== '—' && (
                          <div className="info-row">
                            <span className="info-label">Expira:</span>
                            <span className="info-value">{subscription.expiryDate}</span>
                          </div>
                        )}
                      </div>

                      {vencimiento.mensaje && subscription.status === 'active' && (
                        <div className={`license-warning ${vencimiento.diasRestantes <= 3 ? 'warning-urgent' : ''}`}>
                          <span className="warning-icon">
                            {vencimiento.diasRestantes <= 3 ? '🚨' : 'ℹ️'}
                          </span>
                          <p>{vencimiento.mensaje}</p>
                        </div>
                      )}

                      <div className="license-actions">
                        <a 
                          href={`https://api.olawee.com/my-account/view-subscription/${subscription.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-manage"
                        >
                          Gestionar en WooCommerce
                        </a>
                        {subscription.status === 'active' && (
                          <a 
                            href="https://api.olawee.com/my-account/payment-methods"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                          >
                            Métodos de pago
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="licenses-footer">
        <button onClick={handleRefresh} className="btn-refresh">
          <span className="refresh-icon">🔄</span>
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default MyLicensesPage;