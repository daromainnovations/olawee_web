
import axios from "axios";

// ✅ Configuración de URLs - Tu servidor WordPress/WooCommerce
const OLAWEE_BASE = process.env.REACT_APP_OLAWEE_BASE_URL || "https://api.olawee.com";
const OLAWEE_API_BASE = `${OLAWEE_BASE}/wp-json`;

// ✅ Detectar origen actual
const getCurrentOrigin = () => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('app.olawee.com') || 
      hostname.includes('localhost:5173') ||
      hostname.includes('localhost:5174')) {
    return 'app';
  } else if (hostname.includes('olawee.com') || 
             hostname.includes('www.olawee.com') ||
             hostname.includes('localhost:3000') ||
             hostname.includes('localhost:3001')) {
    return 'web';
  }
  
  return 'web';
};

// ✅ Headers comunes con origen
const getCommonHeaders = () => {
  const origin = getCurrentOrigin();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Origin': origin,
  };
  
  console.log(`📤 [SERVICE] Sending headers:`, headers);
  
  return headers;
};

// ============================================
// FUNCIONES DE AUTENTICACIÓN (NUEVAS/ACTUALIZADAS)
// ============================================

/**
 * LOGIN - Inicia sesión con email y contraseña
 * Ahora devuelve session_token y detecta conflictos
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/login`,
      { email, password },
      { timeout: 30000, headers: getCommonHeaders() }
    );

    console.log("✅ Respuesta de login:", response.data);

    const { success, token, session_token, user: userData, conflict_detected, message, origin } = response.data;

    // ⚠️ Verificar si hay conflicto de sesión
    if (conflict_detected) {
      return {
        success: false,
        conflict: true,
        message: message || 'Ya existe una sesión activa en otro dispositivo',
        origin: origin,
        user: userData,
      };
    }

    // Login exitoso
    if (!success || !token || !userData?.id) {
      throw new Error("Error en el login o datos de usuario incompletos");
    }

    return {
      success: true,
      conflict: false,
      token,
      sessionToken: session_token,
      origin: origin,
      user: userData,
    };
  } catch (error) {
    console.error("🚨 Error en login:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message } = error.response.data;

      const errorMessages = {
        'invalid_credentials': 'Email o contraseña incorrectos',
        'missing_fields': 'Email y contraseña son obligatorios',
        'invalid_email': 'El formato del email es inválido',
      };

      const friendlyMessage = errorMessages[code] || message || 'Error al iniciar sesión';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;

      throw enhancedError;
    }

    throw error;
  }
};

/**
 * FORCE LOGIN - Fuerza el inicio de sesión (cierra otras sesiones)
 */
export const forceLoginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/login-force`,
      { email, password },
      {
        timeout: 30000,
        headers: getCommonHeaders(), // ✅ CORREGIDO: Ahora usa getCommonHeaders()
      }
    );

    console.log("✅ Respuesta de force login:", response.data);

    const { success, token, session_token, user: userData, origin } = response.data;

    if (!success || !token || !userData?.id) {
      throw new Error("Error en el force login o datos de usuario incompletos");
    }

    return {
      success: true,
      token,
      sessionToken: session_token,
      origin: origin,
      user: userData,
    };
  } catch (error) {
    console.error("🚨 Error en force login:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message } = error.response.data;

      const errorMessages = {
        'invalid_credentials': 'Email o contraseña incorrectos',
        'missing_fields': 'Email y contraseña son obligatorios',
      };

      const friendlyMessage = errorMessages[code] || message || 'Error al forzar inicio de sesión';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;

      throw enhancedError;
    }

    throw error;
  }
};

/**
 * VALIDATE TOKEN - Valida el token actual
 * Ahora requiere session_token como query param
 */
export const validateToken = async (token, sessionToken) => {
  try {
    const response = await axios.get(
      `${OLAWEE_API_BASE}/custom-api/validate`,
      {
        params: { session_token: sessionToken || '' },
        headers: {
          ...getCommonHeaders(), // ✅ CORREGIDO: Incluye getCommonHeaders()
          'Authorization': `Bearer ${token}`,
        },
        timeout: 15000,
      }
    );

    console.log("✅ Token válido:", response.data);

    const { valid, user, origin } = response.data;

    return {
      valid,
      user,
      origin,
    };
  } catch (error) {
    console.error("🚨 Error validando token:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message, origin } = error.response.data;

      // Si la sesión fue invalidada, lanzar error específico
      if (code === 'session_invalidated' || error.response.status === 401) {
        const enhancedError = new Error(
          message || `Tu sesión en ${origin} ha sido cerrada porque iniciaste sesión desde otro dispositivo`
        );
        enhancedError.code = 'session_invalidated';
        enhancedError.origin = origin;
        enhancedError.originalResponse = error.response.data;
        throw enhancedError;
      }

      const enhancedError = new Error(message || 'Token inválido');
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;
      throw enhancedError;
    }

    throw error;
  }
};

/**
 * LOGOUT - Cierra sesión
 */
export const logoutUser = async (token) => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/logout`,
      {},
      {
        headers: {
          ...getCommonHeaders(), // ✅ CORREGIDO: Incluye getCommonHeaders()
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    console.log("✅ Logout exitoso:", response.data);

    return {
      success: true,
      message: response.data.message || 'Sesión cerrada correctamente',
      origin: response.data.origin,
    };
  } catch (error) {
    console.error("🚨 Error en logout:", error.response?.data || error.message);

    // Aunque falle la petición, devolver éxito para limpiar localmente
    return {
      success: true,
      message: 'Sesión cerrada localmente',
    };
  }
};

/**
 * REQUEST PASSWORD RESET - Solicita reseteo de contraseña
 */
export const requestPasswordReset = async (email, origin = 'web') => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/request-password-reset`,
      { email, origin },
      {
        timeout: 20000,
        headers: getCommonHeaders(), // ✅ CORREGIDO
      }
    );

    console.log("✅ Solicitud de reset enviada:", response.data);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("🚨 Error solicitando reset:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message } = error.response.data;

      const errorMessages = {
        'invalid_email': 'Email inválido',
        'email_error': 'Error enviando el email. Inténtalo más tarde',
      };

      const friendlyMessage = errorMessages[code] || message || 'Error al solicitar reseteo';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;

      throw enhancedError;
    }

    throw error;
  }
};

/**
 * VERIFY RESET TOKEN - Verifica el token de reseteo
 */
export const verifyResetToken = async (token, email) => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/verify-reset-token`,
      { token, email },
      {
        timeout: 15000,
        headers: getCommonHeaders(), // ✅ CORREGIDO
      }
    );

    console.log("✅ Token de reset verificado:", response.data);

    return {
      success: response.data.success,
      message: response.data.message,
      userId: response.data.user_id,
    };
  } catch (error) {
    console.error("🚨 Error verificando token de reset:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message } = error.response.data;

      const errorMessages = {
        'invalid_token': 'Token inválido o expirado',
        'expired_token': 'El link ha expirado. Solicita un nuevo reseteo',
        'missing_data': 'Datos faltantes',
      };

      const friendlyMessage = errorMessages[code] || message || 'Error verificando token';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;

      throw enhancedError;
    }

    throw error;
  }
};

/**
 * RESET PASSWORD - Resetea la contraseña
 */
export const resetPassword = async (token, email, newPassword) => {
  try {
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/reset-password`,
      { token, email, password: newPassword },
      {
        timeout: 20000,
        headers: getCommonHeaders(), // ✅ CORREGIDO
      }
    );

    console.log("✅ Contraseña reseteada:", response.data);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("🚨 Error reseteando contraseña:", error.response?.data || error.message);

    if (error.response?.data) {
      const { code, message } = error.response.data;

      const errorMessages = {
        'invalid_token': 'Token inválido o expirado',
        'expired_token': 'El token ha expirado. Solicita un nuevo reseteo',
        'weak_password': 'La contraseña no cumple con los requisitos de seguridad',
        'missing_data': 'Datos faltantes',
      };

      const friendlyMessage = errorMessages[code] || message || 'Error al resetear contraseña';
      const enhancedError = new Error(friendlyMessage);
      enhancedError.code = code;
      enhancedError.originalResponse = error.response.data;

      throw enhancedError;
    }

    throw error;
  }
};

// ============================================
// FUNCIÓN DE REGISTRO (ACTUALIZADA)
// ============================================

const buildUserFromRegister = (responseUser = {}, extraFields = {}, email, username) => {
  return {
    id: responseUser.id || null,
    username: username,
    email: email,
    displayName: responseUser.name || `${extraFields.firstName || ""} ${extraFields.lastName || ""}`.trim(),
    firstName: responseUser.first_name || extraFields.firstName || "",
    lastName: responseUser.last_name || extraFields.lastName || "",
    phone: responseUser.phone || extraFields.phone || "",
    company: responseUser.empresa || extraFields.company || "",
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
    const response = await axios.post(
      `${OLAWEE_API_BASE}/custom-api/register`,
      {
        email,
        username,
        password,
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
        headers: getCommonHeaders(), // ✅ CORREGIDO
      }
    );

    console.log("✅ Respuesta de registro:", response.data);

    const { success, token, session_token, user: userData, origin } = response.data;
    
    if (!success || !userData?.id) {
      throw new Error("Error en el registro o datos de usuario incompletos");
    }

    const enrichedUser = buildUserFromRegister(userData, extraFields, email, username);
    
    return { 
      success,
      token,
      sessionToken: session_token,
      origin: origin,
      user: enrichedUser 
    };
  } catch (error) {
    console.error("🚨 Error registrando usuario:", error.response?.data || error.message);
    
    if (error.response?.data) {
      const { code, message } = error.response.data;
      
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

// ============================================
// FUNCIONES DE USUARIOS
// ============================================

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

export const verifyUsersByEmail = async (emails) => {
  try {
    const response = await axios.post(`${OLAWEE_API_BASE}/olawee/v1/verify-users`, {
      emails: emails
    }, {
      timeout: 15000,
      headers: getCommonHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error verificando usuarios por email:", error.response?.data || error.message);
    return { success: false, found_users: [], not_found: emails };
  }
};

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

export const getProducts = async (params = {}) => {
  try {
    const { 
      page = 1, 
      perPage = 20, 
      orderby = 'date', 
      order = 'desc' 
    } = params;

    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/products`, {
      params: {
        page,
        per_page: perPage,
        orderby,
        order
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo productos:", error.response?.data || error.message);
    return {
      success: false,
      products: [],
      total: 0,
      pages: 0,
      current_page: 1
    };
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/products/${productId}`, {
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo producto:", error.response?.data || error.message);
    return { success: false, product: null };
  }
};

export const getProductsByCategory = async (categorySlug, perPage = 20) => {
  try {
    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/products/category/${categorySlug}`, {
      params: { per_page: perPage },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo productos por categoría:", error.response?.data || error.message);
    return {
      success: false,
      products: [],
      category: categorySlug,
      total: 0
    };
  }
};

export const searchProducts = async (searchTerm, perPage = 20) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return {
        success: false,
        message: 'Término de búsqueda vacío',
        products: [],
        total: 0
      };
    }

    const response = await axios.get(`${OLAWEE_API_BASE}/olawee/v1/products/search`, {
      params: {
        search: searchTerm,
        per_page: perPage
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error buscando productos:", error.response?.data || error.message);
    return {
      success: false,
      products: [],
      search_term: searchTerm,
      total: 0
    };
  }
};

// ============================================
// FUNCIONES DE NOTIFICACIONES
// ============================================

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

// ============================================
// WEBHOOKS
// ============================================

export const sendPromptStatusWebhook = async (promptData) => {
  try {
    const response = await axios.post(`${OLAWEE_API_BASE}/olawee/v1/webhooks/prompt-status-changed`, 
      promptData,
      {
        timeout: 10000,
        headers: getCommonHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("🚨 Error enviando webhook:", error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// UTILIDADES
// ============================================

export const getApiUrl = (endpoint) => {
  return `${OLAWEE_API_BASE}${endpoint}`;
};

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