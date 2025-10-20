// src/services/wpSwingsAPI.js

const BASE_URL = process.env.REACT_APP_WP_SWINGS_API_BASE;
const CONSUMER_SECRET = process.env.REACT_APP_WP_SWINGS_CONSUMER_SECRET;

/**
 * Obtener todas las suscripciones desde WP Swings
 */
export const obtenerTodasSuscripciones = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/wsp-view-subscription?consumer_secret=${CONSUMER_SECRET}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.code === 200 && result.status === 'success') {
      return {
        success: true,
        data: result.data.map(sub => ({
          id: sub.subscription_id,
          parentOrderId: sub.parent_order_id,
          status: sub.status,
          productName: sub.product_name,
          recurringAmount: sub.recurring_amount,
          userName: sub.user_name,
          nextPaymentDate: sub.next_payment_date,
          expiryDate: sub.subscriptions_expiry_date
        }))
      };
    }
    
    return {
      success: false,
      message: result.message || 'Error al obtener suscripciones'
    };
  } catch (error) {
    console.error('Error en obtenerTodasSuscripciones:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Obtener suscripciones de un usuario específico por email o username
 */
export const obtenerSuscripcionesUsuario = async (userIdentifier) => {
  try {
    const result = await obtenerTodasSuscripciones();
    
    if (!result.success) {
      return { success: false, data: [], message: result.message };
    }
    
    // Filtrar por userName o email
    const userSubs = result.data.filter(sub => 
      sub.userName.toLowerCase() === userIdentifier.toLowerCase()
    );
    
    return {
      success: true,
      data: userSubs
    };
  } catch (error) {
    console.error('Error en obtenerSuscripcionesUsuario:', error);
    return { success: false, data: [], message: error.message };
  }
};

/**
 * Verificar si un usuario tiene alguna suscripción activa
 */
export const verificarSuscripcionActiva = async (userIdentifier) => {
  try {
    const result = await obtenerSuscripcionesUsuario(userIdentifier);
    
    if (!result.success) {
      return { hasActiveSubscription: false, subscriptions: [] };
    }
    
    const activeSubs = result.data.filter(sub => sub.status === 'active');
    
    return {
      hasActiveSubscription: activeSubs.length > 0,
      subscriptions: activeSubs,
      totalActive: activeSubs.length
    };
  } catch (error) {
    console.error('Error en verificarSuscripcionActiva:', error);
    return { hasActiveSubscription: false, subscriptions: [] };
  }
};

/**
 * Verificar acceso completo a la aplicación
 * Retorna si tiene acceso y detalles de las suscripciones
 */
export const verificarAccesoApp = async (userIdentifier) => {
  try {
    const result = await verificarSuscripcionActiva(userIdentifier);
    
    if (!result.hasActiveSubscription) {
      return {
        hasAccess: false,
        message: 'No tienes una suscripción activa',
        redirectTo: '/Prices',
        subscriptions: []
      };
    }
    
    return {
      hasAccess: true,
      message: 'Acceso concedido',
      subscriptions: result.subscriptions,
      totalActive: result.totalActive
    };
  } catch (error) {
    console.error('Error en verificarAccesoApp:', error);
    return {
      hasAccess: false,
      message: 'Error al verificar acceso',
      error: error.message,
      redirectTo: '/Prices'
    };
  }
};

/**
 * Obtener una suscripción específica por ID
 */
export const obtenerSuscripcionPorId = async (subscriptionId) => {
  try {
    const result = await obtenerTodasSuscripciones();
    
    if (!result.success) {
      return { success: false, data: null };
    }
    
    const subscription = result.data.find(sub => sub.id === parseInt(subscriptionId));
    
    return {
      success: !!subscription,
      data: subscription || null
    };
  } catch (error) {
    console.error('Error en obtenerSuscripcionPorId:', error);
    return { success: false, data: null };
  }
};

/**
 * Obtener suscripciones por producto
 */
export const obtenerSuscripcionesPorProducto = async (productName) => {
  try {
    const result = await obtenerTodasSuscripciones();
    
    if (!result.success) {
      return { success: false, data: [] };
    }
    
    const productSubs = result.data.filter(sub => 
      sub.productName.toLowerCase().includes(productName.toLowerCase())
    );
    
    return {
      success: true,
      data: productSubs
    };
  } catch (error) {
    console.error('Error en obtenerSuscripcionesPorProducto:', error);
    return { success: false, data: [] };
  }
};

/**
 * Formatear fecha de próximo pago
 */
export const formatearFechaProximoPago = (fechaStr) => {
  if (fechaStr === '—' || !fechaStr) return 'Sin fecha programada';
  
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return fechaStr;
  }
};

/**
 * Verificar si la suscripción está próxima a vencer
 */
export const verificarProximoVencimiento = (nextPaymentDate, diasAlerta = 7) => {
  if (nextPaymentDate === '—' || !nextPaymentDate) {
    return { proximoVencer: false, diasRestantes: null, mensaje: null };
  }
  
  try {
    const fechaPago = new Date(nextPaymentDate);
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fechaPago - hoy) / (1000 * 60 * 60 * 24));
    
    let mensaje = null;
    if (diferenciaDias <= 3 && diferenciaDias > 0) {
      mensaje = `Tu suscripción se renueva en ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''}`;
    } else if (diferenciaDias === 0) {
      mensaje = 'Tu suscripción se renueva hoy';
    } else if (diferenciaDias < 0) {
      mensaje = 'Tu suscripción está vencida';
    }
    
    return {
      proximoVencer: diferenciaDias <= diasAlerta && diferenciaDias >= 0,
      diasRestantes: diferenciaDias,
      mensaje
    };
  } catch (error) {
    return { proximoVencer: false, diasRestantes: null, mensaje: null };
  }
};

/**
 * Obtener el estado traducido de la suscripción
 */
export const obtenerEstadoTraducido = (status) => {
  const estados = {
    'active': 'Activa',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada',
    'on-hold': 'En pausa',
    'expired': 'Expirada',
    'pending-cancel': 'Pendiente de cancelación'
  };
  
  return estados[status] || status;
};
