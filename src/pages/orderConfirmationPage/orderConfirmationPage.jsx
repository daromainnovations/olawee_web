// src/pages/orderConfirmationPage/orderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/authProviderContext';
import './orderConfirmationPage.scss';

const API_URL = 'https://api.olawee.com/wp-json';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, getToken } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFreeTrial = searchParams.get('trial') === 'true'; 

  const fetchOrder = async () => {
    try {
      const { token } = getToken();
      if (!token) throw new Error('No se encontró token');

      const response = await fetch(`${API_URL}/wc/v3/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener la orden');

      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      setError(err.message);
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

    if (!orderId) {
      navigate('/');
      return;
    }

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isAuthenticated]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="confirmation-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'No se pudo cargar la información del pedido'}</p>
          <Link to="/" className="btn-home">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <svg viewBox="0 0 52 52">
            <circle className="success-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        {isFreeTrial ? (
          <>
            <h1 className="confirmation-title">¡Prueba gratuita activada!</h1>
            <p className="confirmation-subtitle">
              🎉 Tienes 14 días para probar todas las funcionalidades sin coste alguno.
            </p>
          </>
        ) : (
          <>
            <h1 className="confirmation-title">¡Pago completado con éxito!</h1>
            <p className="confirmation-subtitle">
              Gracias por tu compra. Tu pedido ha sido procesado correctamente.
            </p>
          </>
        )}

        <div className="order-details-card">
          <div className="order-header">
            <h2>Detalles del pedido</h2>
            <span className="order-number">#{order.id}</span>
          </div>

          {isFreeTrial && (
            <div className="trial-info-box">
              <h3>📅 Información de tu prueba</h3>
              <ul>
                <li>✓ Acceso completo durante 14 días</li>
                <li>✓ Sin compromiso - cancela cuando quieras</li>
                <li>✓ Tu método de pago está guardado de forma segura</li>
                <li>⏰ Después de 14 días se cobrará automáticamente 50€</li>
              </ul>
              <p className="trial-reminder">
                <strong>Recordatorio:</strong> Te enviaremos un email 3 días antes de que termine tu prueba.
              </p>
            </div>
          )}

          <div className="order-items">
            {order.line_items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  {isFreeTrial && <span className="trial-badge">Periodo de prueba</span>}
                </div>
                <div className="item-price">
                  {isFreeTrial ? '0€' : `${item.total}€`}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{isFreeTrial ? '0€' : `${order.total}€`}</span>
            </div>
            {!isFreeTrial && parseFloat(order.total) > 0 && (
              <div className="summary-row">
                <span>IVA incluido:</span>
                <span>{(parseFloat(order.total) * 0.21).toFixed(2)}€</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total pagado hoy:</span>
              <span>{isFreeTrial ? '0€' : `${order.total}€`}</span>
            </div>
            {isFreeTrial && (
              <div className="future-charge">
                <span>Cargo tras prueba (14 días):</span>
                <span>50€</span>
              </div>
            )}
          </div>

          <div className="billing-info">
            <h3>Información de facturación</h3>
            <p>{order.billing?.first_name} {order.billing?.last_name}</p>
            <p>{order.billing?.email}</p>
            <p>{order.billing?.address_1}</p>
            <p>{order.billing?.postcode} {order.billing?.city}</p>
          </div>
        </div>

        <div className="next-steps">
          <div className="step-card">
            <div className="step-icon">📧</div>
            <h3>Revisa tu email</h3>
            <p>
              {isFreeTrial 
                ? 'Te hemos enviado un email con las instrucciones para empezar tu prueba gratuita.'
                : 'Te hemos enviado un correo con los detalles de tu licencia y las instrucciones de activación.'
              }
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">🔑</div>
            <h3>{isFreeTrial ? 'Empieza a usar Olawee' : 'Activa tu licencia'}</h3>
            <p>
              {isFreeTrial
                ? 'Ya puedes empezar a disfrutar de todas las funcionalidades durante 14 días.'
                : 'Sigue las instrucciones del email para activar tu licencia en tu cuenta.'
              }
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">💬</div>
            <h3>Soporte disponible</h3>
            <p>Si tienes alguna duda, nuestro equipo está aquí para ayudarte.</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/my-account" className="btn-primary">
            {isFreeTrial ? 'Ir a mi cuenta' : 'Ver mis licencias'}
          </Link>
          <Link to="/" className="btn-secondary">
            Volver al inicio
          </Link>
        </div>

        {isFreeTrial && (
          <div className="cancellation-info">
            <p>
              <strong>¿Cambio de planes?</strong> Puedes cancelar tu suscripción en cualquier momento desde tu cuenta. 
              Si cancelas durante el periodo de prueba, no se te cobrará nada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;