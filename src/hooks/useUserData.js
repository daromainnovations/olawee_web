
// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authProviderContext';

const API_URL = 'https://api.olawee.com/wp-json';

export const useUserData = () => {
  const { user, getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { token } = getToken();
      if (!token) throw new Error('No token available');

      // Fetch orders
      const ordersResponse = await fetch(`${API_URL}/wc/v3/orders?customer=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!ordersResponse.ok) throw new Error('Error fetching orders');
      const ordersData = await ordersResponse.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // Fetch licenses
      try {
        const licensesResponse = await fetch(`${API_URL}/lmfwc/v2/licenses?user_id=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (licensesResponse.ok) {
          const licensesData = await licensesResponse.json();
          setLicenses(Array.isArray(licensesData.data) ? licensesData.data : []);
        } else {
          setLicenses([]);
        }
      } catch (err) {
        console.log('No licenses endpoint available');
        setLicenses([]);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Helper para detectar trials
  const getTrialInfo = (order) => {
    const total = parseFloat(order.total);
    if (total === 0 || total === '0.00') {
      const orderDate = new Date(order.date_created);
      const trialEndDate = new Date(orderDate);
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      
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

  return {
    orders,
    licenses,
    loading,
    error,
    refetch: fetchUserData,
    getTrialInfo
  };
};