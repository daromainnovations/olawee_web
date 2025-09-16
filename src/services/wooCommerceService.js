
// // ✅ ARCHIVO ACTUALIZADO: wooCommerceService.js
// import axios from "axios";

// const API_URL = process.env.REACT_APP_WC_API_URL;
// const CONSUMER_KEY = process.env.REACT_APP_WC_CONSUMER_KEY;
// const CONSUMER_SECRET = process.env.REACT_APP_WC_CONSUMER_SECRET;

// // Extrae y estructura el usuario desde la respuesta del registro
// const buildUserFromRegister = (responseUser = {}, extraFields = {}, email, username) => {
//   return {
//     id: responseUser.id || null,
//     username: username,
//     email: email,
//     displayName: responseUser.displayName || `${extraFields.first_name || ""} ${extraFields.last_name || ""}`.trim(),
//     firstName: responseUser.first_name || extraFields.first_name || "",
//     lastName: responseUser.last_name || extraFields.last_name || "",
//     phone: responseUser.phone || extraFields.phone || "",
//     company: responseUser.company || extraFields.company || "",
//     country: responseUser.country || extraFields.country || "",
//     state: responseUser.state || extraFields.state || "",
//     city: responseUser.city || extraFields.city || "",
//     job: responseUser.job || extraFields.job || "",
//     meta: {},
//   };
// };

// export const registerUser = async (email, username, password, extraFields = {}) => {
//   try {
//     const response = await axios.post(
//       "https://api.olawee.com/wp-json/custom-api/register",
//       {
//         email,
//         username,
//         password,
//         first_name: extraFields.first_name,
//         last_name: extraFields.last_name,
//         phone: extraFields.phone,
//         company: extraFields.company,
//         country: extraFields.country,
//         state: extraFields.state,
//         city: extraFields.city,
//         job: extraFields.job,
//       },
//       {
//         timeout: 20000,
//       }
//     );

//     // Si no tiene user.id, enriquecemos localmente
//     const enrichedUser = buildUserFromRegister(response.data?.user || {}, extraFields, email, username);
//     return { ...response.data, user: enrichedUser };
//   } catch (error) {
//     console.error("🚨 Error registrando usuario:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export const getCurrentUser = async (identifier) => {
//   try {
//     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

//     const response = await axios.get(`${API_URL}/customers`, {
//       auth: {
//         username: CONSUMER_KEY,
//         password: CONSUMER_SECRET,
//       },
//       params: isEmail ? { email: identifier } : { username: identifier },
//     });

//     return response.data.length > 0 ? response.data[0] : null;
//   } catch (error) {
//     console.error("🚨 Error obteniendo usuario:", error.response?.data || error.message);
//     return null;
//   }
// };

// export const getProducts = async () => {
//   try {
//     const response = await axios.get("https://api.olawee.com/wp-json/okapi/v1/public-products");
//     return response.data;
//   } catch (error) {
//     console.error("🚨 Error obteniendo productos:", error.message);
//     return [];
//   }
// };













// ✅ ARCHIVO ACTUALIZADO: wooCommerceService.js
import axios from "axios";

// ✅ CORREGIDO: URLs y configuración para Olawee
const API_URL = process.env.REACT_APP_WC_API_URL;
const CONSUMER_KEY = process.env.REACT_APP_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.REACT_APP_WC_CONSUMER_SECRET;

// URLs base de Olawee
const OLAWEE_API_BASE = "https://api.olawee.com/wp-json";

// Extrae y estructura el usuario desde la respuesta del registro
const buildUserFromRegister = (responseUser = {}, extraFields = {}, email, username) => {
  return {
    id: responseUser.id || null,
    username: username,
    email: email,
    displayName: responseUser.name || `${extraFields.firstName || ""} ${extraFields.lastName || ""}`.trim(),
    firstName: responseUser.first_name || extraFields.firstName || "",
    lastName: responseUser.last_name || extraFields.lastName || "",
    phone: responseUser.phone || extraFields.phone || "",
    company: responseUser.empresa || extraFields.company || "", // ✅ CORREGIDO: usar 'empresa'
    country: responseUser.country || extraFields.country || "",
    state: responseUser.state || extraFields.state || "",
    city: responseUser.city || extraFields.city || "",
    job: responseUser.job || extraFields.job || "",
    roles: responseUser.roles || [],
    meta: {},
  };
};

export const registerUser = async (email, username, password, extraFields = {}) => {
  try {
    // ✅ CORREGIDO: URL y endpoint correctos de Olawee
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/register`, // ✅ CORREGIDO: custom-api en lugar de custom-api
      {
        email,
        username,
        password,
        // ✅ CORREGIDO: Parámetros según lo que espera el plugin de Olawee
        firstName: extraFields.first_name || extraFields.firstName,
        lastName: extraFields.last_name || extraFields.lastName,
        phone: extraFields.phone,
        company: extraFields.company,
        country: extraFields.country,
        state: extraFields.state,
        city: extraFields.city,
        job: extraFields.job,
      },
      {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log("✅ Respuesta de registro:", response.data);

    // ✅ CORREGIDO: Manejar respuesta del plugin de Olawee
    const { success, token, user: userData } = response.data;
    
    if (!success || !userData?.id) {
      throw new Error("Error en el registro o datos de usuario incompletos");
    }

    // Enriquecer usuario con campos adicionales
    const enrichedUser = buildUserFromRegister(userData, extraFields, email, username);
    
    return { 
      success,
      token,
      user: enrichedUser 
    };
  } catch (error) {
    console.error("🚨 Error registrando usuario:", error.response?.data || error.message);
    
    // Mejorar manejo de errores específicos del plugin
    if (error.response?.data) {
      const { code, message } = error.response.data;
      
      // Crear un error más descriptivo basado en el código
      const errorMessages = {
        'email_exists': 'Este email ya está registrado',
        'username_exists': 'Este nombre de usuario ya existe',
        'weak_password': 'La contraseña no cumple con los requisitos de seguridad',
        'missing_fields': 'Faltan campos obligatorios',
        'invalid_email': 'El formato del email es inválido'
      };
      
      const friendlyMessage = errorMessages[code] || message || 'Error en el registro';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;
      
      throw enhancedError;
    }
    
    throw error;
  }
};

export const getCurrentUser = async (identifier) => {
  try {
    // ✅ MANTENER: Esta función sigue usando WooCommerce API si está configurada
    if (!API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
      console.warn("⚠️ Credenciales de WooCommerce no configuradas");
      return null;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const response = await axios.get(`${API_URL}/customers`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
      params: isEmail ? { email: identifier } : { username: identifier },
      timeout: 15000,
    });

    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("🚨 Error obteniendo usuario:", error.response?.data || error.message);
    return null;
  }
};

// ✅ NUEVO: Función para obtener usuario por ID usando el plugin de Olawee
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/user/${userId}`, {
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo usuario por ID:", error.response?.data || error.message);
    return null;
  }
};

// ✅ NUEVO: Función para buscar usuarios usando el plugin de Olawee
export const searchUsers = async (searchTerm, limit = 10) => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/search-users`, {
      params: {
        search: searchTerm,
        limit: limit
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error buscando usuarios:", error.response?.data || error.message);
    return { success: false, users: [], total: 0 };
  }
};

// ✅ NUEVO: Función para verificar múltiples usuarios por email
export const verifyUsersByEmail = async (emails) => {
  try {
    const response = await axios.post(`${OLAWEE_API_BASE}/olawee/v1/verify-users`, {
      emails: emails
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error verificando usuarios por email:", error.response?.data || error.message);
    return { success: false, found_users: [], not_found: emails };
  }
};

// ✅ COMENTADO: Endpoint de productos que no existe en el plugin actual
export const getProducts = async () => {
  try {
    // ⚠️ NOTA: Este endpoint no existe en el plugin actual de Olawee
    // Si necesitas productos, debes implementar este endpoint en el plugin
    console.warn("⚠️ Endpoint de productos no disponible en el plugin actual");
    
    // TODO: Cuando implementes el endpoint en el plugin, descomenta:
    // const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/products`);
    // return response.data;
    
    return [];
  } catch (error) {
    console.error("🚨 Error obteniendo productos:", error.message);
    return [];
  }
};

// ✅ NUEVO: Función para obtener notificaciones del usuario
export const getUserNotifications = async (userEmail) => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/notifications/${encodeURIComponent(userEmail)}`, {
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo notificaciones:", error.response?.data || error.message);
    return { notifications: [], count: 0 };
  }
};

// ✅ NUEVO: Función para enviar webhook de cambio de estado de prompt
export const sendPromptStatusWebhook = async (promptData) => {
  try {
    const response = await axios.post(`${OLAWEE_API_BASE}/olawee/v1/webhooks/prompt-status-changed`, 
      promptData,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("🚨 Error enviando webhook:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ NUEVO: Función helper para construir URLs de API
export const getApiUrl = (endpoint) => {
  return `${OLAWEE_API_BASE}${endpoint}`;
};

// ✅ NUEVO: Función para verificar la salud del API
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/debug-test/simple`, {
      timeout: 5000,
    });

    return {
      healthy: true,
      data: response.data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("🚨 API no disponible:", error.message);
    return {
      healthy: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
};