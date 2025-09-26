
// config/api.js
const API_CONFIG = {
    // Base URL de tu API de Olawee
    BASE_URL: 'https://api.olawee.com',
    
    // Endpoints según tu plugin de WordPress
    ENDPOINTS: {
      // Autenticación
      LOGIN: '/wp-json/custom-api/login',
      REGISTER: '/wp-json/custom-api/register',
      VALIDATE_TOKEN: '/wp-json/custom-api/validate',
      
      // Reset de contraseña
      REQUEST_PASSWORD_RESET: '/wp-json/custom-api/request-password-reset',
      RESET_PASSWORD: '/wp-json/custom-api/reset-password', // Este también verifica el token
      VERIFY_RESET_TOKEN: '/wp-json/custom-api/verify-reset-token',
      
      // Usuarios
      VERIFY_USERS: '/wp-json/olawee/v1/verify-users',
      GET_USER: '/wp-json/olawee/v1/user',
      SEARCH_USERS: '/wp-json/olawee/v1/search-users',
      
      // Notificaciones
      NOTIFICATIONS: '/wp-json/olawee/v1/notifications',
      WEBHOOK_PROMPT_STATUS: '/wp-json/olawee/v1/webhooks/prompt-status-changed'
    }
  };
  
  // Función helper para construir URLs completas
  export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
  };
  
  // Función para construir URLs con parámetros
  export const getApiUrlWithParams = (endpoint, params = {}) => {
    let url = getApiUrl(endpoint);
    
    // Para endpoints que necesitan parámetros en la URL
    if (endpoint === 'GET_USER' && params.id) {
      url += `/${params.id}`;
    } else if (endpoint === 'NOTIFICATIONS' && params.email) {
      url += `/${params.email}`;
    }
    
    return url;
  };
  
  // Headers comunes para las peticiones
  export const getAuthHeaders = (token = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };
  
  // Exportar configuración
  export default API_CONFIG;