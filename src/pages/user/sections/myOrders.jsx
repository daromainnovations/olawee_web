
// src/pages/user/sections/myOrders.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../../../hooks/useUserData";
import "../sections/styles/myOrders.scss";

const MyOrders = () => {
  const { orders, loading, getTrialInfo } = useUserData();

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-section">
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>When you make a purchase, it will appear here.</p>
          <Link to="/prices" className="btn-primary">
            View Plans
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const trialInfo = getTrialInfo(order);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.date_created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {trialInfo.isTrial && (
                      <span className="trial-label">
                        {trialInfo.isActive 
                          ? '⏰ Active trial period' 
                          : '✓ Trial completed'}
                      </span>
                    )}
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {order.status === 'completed' && '✓ Completed'}
                    {order.status === 'processing' && '⏳ Processing'}
                    {order.status === 'pending' && '⏰ Pending'}
                    {order.status === 'cancelled' && '✗ Cancelled'}
                  </span>
                </div>

                <div className="order-items">
                  {order.line_items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="item-price">
                        {trialInfo.isTrial ? '0€ (Trial)' : `${item.total}€`}
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
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;