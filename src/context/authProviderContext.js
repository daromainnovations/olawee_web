
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthError } from "../utils/AuthError";

const api = axios.create({
  baseURL: "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const hasVerifiedToken = useRef(false);

//   // Función para diagnóstico de red - agregar al inicio del archivo o donde sea apropiado
// const checkNetworkQuality = async (baseUrl) => {
//   const startTime = performance.now();
//   let status = "unknown";
//   let pingTime = 0;
  
//   try {
//     // Hacemos una petición ligera al servidor para medir la latencia
//     const response = await fetch(`${baseUrl || api.defaults.baseURL.replace('/wp-json', '')}/wp-json`, {
//       method: 'HEAD',
//       cache: 'no-store',
//       credentials: 'omit' // Evitar envío de cookies para que sea más ligera
//     });
    
//     pingTime = performance.now() - startTime;
//     status = response.ok ? "available" : "error";
    
//     const networkQuality = 
//       pingTime < 300 ? "excellent" :
//       pingTime < 1000 ? "good" :
//       pingTime < 3000 ? "fair" :
//       "poor";
      
//     console.log(`📶 Calidad de red: ${networkQuality} (${Math.round(pingTime)}ms)`);
    
//     return {
//       status,
//       pingTime,
//       quality: networkQuality,
//       httpStatus: response.status
//     };
//   } catch (err) {
//     pingTime = performance.now() - startTime;
//     console.error(`❌ Error de conexión: ${err.message}`);
    
//     return {
//       status: "error",
//       pingTime,
//       quality: "unavailable",
//       error: err.message
//     };
//   }
// };
// // Versión optimizada de login con mejor manejo de red
// const login = async (emailOrUsername, password) => {
//   const startTime = performance.now();
  
//   try {
//     // Validación de campos
//     console.log("Datos recibidos:", { 
//       emailOrUsername: emailOrUsername, 
//       passwordLength: password?.length
//     });
    
//     const cleanEmailOrUsername = emailOrUsername?.toString().trim();
//     const cleanPassword = password?.toString().trim();
    
//     if (!cleanEmailOrUsername || !cleanPassword) {
//       throw new AuthError(
//         "El correo electrónico/usuario y la contraseña son obligatorios", 
//         "missing_fields"
//       );
//     }

//     console.log("Intentando iniciar sesión con:", { username: cleanEmailOrUsername });

//     // 1. VERIFICAR CACHÉ AGRESIVA - Priorizar velocidad sobre actualización
//     const cachedUserData = localStorage.getItem("user_data");
//     const cachedUserEmail = localStorage.getItem("user_email");
//     const cachedTimestamp = localStorage.getItem("login_timestamp");
//     const cachedToken = sessionStorage.getItem("jwt_token");
//     const now = Date.now();
    
//     // Aumentamos caché a 7 días - es mejor tener datos desactualizados que ninguno
//     const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días
    
//     if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && 
//         cachedTimestamp && cachedToken) {
      
//       // Si la caché es reciente (menos de 2 horas), usarla sin verificación
//       if (now - parseInt(cachedTimestamp) < 2 * 60 * 60 * 1000) {
//         try {
//           const userData = JSON.parse(cachedUserData);
//           console.log("✅ Login exitoso (desde caché reciente)");
//           setUser(userData);
          
//           // Intentaremos verificar el token solo en segundo plano
//           setTimeout(() => {
//             silentTokenVerification(cachedToken).catch(() => {});
//           }, 1000);
          
//           return userData;
//         } catch (cacheError) {
//           console.warn("⚠️ Error al usar caché reciente:", cacheError.message);
//         }
//       }
      
//       // Si la caché es válida pero no tan reciente, verificar primero
//       if (now - parseInt(cachedTimestamp) < CACHE_MAX_AGE) {
//         // Verificar la calidad de la conexión primero
//         const networkStatus = await checkNetworkQuality();
        
//         // Si la red es lenta, mejor usar caché que esperar mucho
//         if (networkStatus.quality === "poor" || networkStatus.quality === "unavailable") {
//           try {
//             const userData = JSON.parse(cachedUserData);
//             console.log("⚠️ Red lenta o no disponible. Usando datos en caché.");
//             setUser(userData);
//             return userData;
//           } catch (emergencyCacheError) {
//             console.warn("⚠️ Error al usar caché de emergencia:", emergencyCacheError.message);
//           }
//         }
//       }
//     }
    
//     // 2. DIAGNÓSTICO DE RED - Medir la calidad de la conexión
//     const networkCheck = await checkNetworkQuality();
//     console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);
    
//     // 3. OPTIMIZACIÓN DE SOLICITUD
//     // Intentar login con timeout adaptativo basado en la calidad de la red
//     let timeout = 30000; // Default 30 segundos
    
//     if (networkCheck.quality === "excellent") timeout = 15000;
//     else if (networkCheck.quality === "good") timeout = 25000;
//     else if (networkCheck.quality === "fair") timeout = 35000;
//     else if (networkCheck.quality === "poor") timeout = 45000;
    
//     console.log(`⏱️ Timeout configurado: ${timeout}ms basado en calidad de red`);
    
//     try {
//       // Usar un objeto URL explícito para evitar problemas de resolución DNS
//       const baseUrl = api.defaults.baseURL.replace('/wp-json', '');
//       const endpoint = "/wp-json/custom/v1/login";
//       const fullUrl = `${baseUrl}${endpoint}`;
      
//       console.log(`🔄 Iniciando solicitud a: ${fullUrl}`);
//       console.time("⏱ LOGIN API");
      
//       // Optimización: Usar fetch directo con keep-alive
//       const fetchResponse = await fetch(fullUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Connection': 'keep-alive' // Forzar keep-alive para conexión más rápida
//         },
//         body: JSON.stringify({
//           username: cleanEmailOrUsername,
//           password: cleanPassword,
//           include_profile: true
//         }),
//         credentials: 'same-origin', // Evitar problemas de CORS
//         cache: 'no-cache', // Siempre pedir fresco
//         mode: 'cors', // Permitir CORS si es necesario
//         timeout: timeout // No soportado directamente en fetch, pero añadido para referencia
//       });
      
//       // Implementar timeout manual
//       const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => reject(new Error('Timeout')), timeout);
//       });
      
//       const response = await Promise.race([
//         fetchResponse.json(),
//         timeoutPromise
//       ]);
      
//       console.timeEnd("⏱ LOGIN API");
      
//       const data = response;
      
//       // Si el servidor devuelve su tiempo de ejecución
//       if (data.execution_time) {
//         const totalTime = performance.now() - startTime;
//         console.log(`📊 Estadísticas de rendimiento:
//           - Tiempo total: ${Math.round(totalTime)}ms
//           - Tiempo servidor: ${data.execution_time}ms
//           - Tiempo red/cliente: ${Math.round(totalTime - data.execution_time)}ms`);
//       }
      
//       const { token, user: profileData } = data;
//       if (!token || !profileData?.id) throw new Error("Token inválido o usuario sin ID");
      
//       // Guardamos el token en sessionStorage
//       sessionStorage.setItem("jwt_token", token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       // Construimos el objeto de usuario
//       const fullUser = {
//         id: profileData.id,
//         username: profileData.username,
//         email: profileData.email || localStorage.getItem("user_email"),
//         displayName: `${profileData.first_name} ${profileData.last_name}`.trim(),
        
//         // Campos personalizados
//         firstName: profileData.first_name || "",
//         lastName: profileData.last_name || "",
//         phone: profileData.phone || "",
//         company: profileData.company || "",
//         country: profileData.country || "",
//         state: profileData.state || "",
//         city: profileData.city || "",
//         job: profileData.job || "",
        
//         avatarUrl: null,
//         meta: {}
//       };
      
//       // Guardar datos con timestamp para la caché
//       localStorage.setItem("user_email", fullUser.email);
//       localStorage.setItem("user_data", JSON.stringify(fullUser));
//       localStorage.setItem("login_timestamp", now.toString());
//       localStorage.setItem("token_last_verified", now.toString());
      
//       setUser(fullUser);
      
//       console.log("✅ Login exitoso:", fullUser);
      
//       // Precarga datos en segundo plano con manejo adecuado de errores
//       setTimeout(() => {
//         try {
//           if (typeof preloadCommonData === 'function') {
//             const preloadPromise = preloadCommonData();
//             if (preloadPromise && typeof preloadPromise.catch === 'function') {
//               preloadPromise.catch(() => {});
//             }
//           }
//         } catch (preloadError) {
//           // Ignorar errores de precarga
//         }
//       }, 500);
      
//       return fullUser;
      
//     } catch (networkError) {
//       console.error("❌ Error de red durante login:", networkError);
      
//       // 4. VERIFICAR SI HAY DATOS DE CACHÉ DISPONIBLES COMO FALLBACK
//       if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && 
//           cachedTimestamp && (now - parseInt(cachedTimestamp) < CACHE_MAX_AGE)) {
        
//         try {
//           console.log("⚠️ Usando caché como fallback después de error de red");
//           const userData = JSON.parse(cachedUserData);
          
//           // Marcar que estamos usando datos potencialmente desactualizados
//           setUser({
//             ...userData,
//             _offlineMode: true
//           });
          
//           return {
//             ...userData,
//             _warning: "Usando datos guardados debido a problemas de conexión"
//           };
//         } catch (fallbackError) {
//           console.error("❌ También falló el uso de caché:", fallbackError);
//         }
//       }
      
//       // Si el error es de timeout o red, dar un mensaje más amigable
//       if (networkError.message === 'Timeout' || 
//           networkError.name === 'AbortError' || 
//           networkError.code === 'ECONNABORTED' ||
//           networkError.message.includes('timeout') ||
//           networkError.message === 'canceled' || 
//           networkError.code === 'ERR_CANCELED' ||
//           networkError.message.includes('network')) {
        
//         throw new AuthError(
//           "La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet o inténtalo más tarde.",
//           "network_timeout"
//         );
//       }
      
//       // Lanzar el error original para otros casos
//       throw networkError;
//     }
    
//   } catch (err) {
//     console.error("❌ Error durante el login:", err);
    
//     // Manejo específico de errores de autenticación
//     if (err.response?.data) {
//       const { code, message } = err.response.data;
      
//       const errorMessages = {
//         'invalid_email': "Este correo electrónico no está registrado",
//         'invalid_username': "Este nombre de usuario no está registrado",
//         'incorrect_password': "La contraseña es incorrecta",
//         'missing_fields': "El usuario y la contraseña son obligatorios"
//       };
      
//       throw new AuthError(
//         errorMessages[code] || message || "Error de autenticación",
//         code || "auth_error" 
//       );
//     } else if (err instanceof AuthError) {
//       throw err;
//     } else {
//       throw new AuthError(
//         err.message || "Ha ocurrido un error durante el inicio de sesión",
//         "unknown_error"
//       );
//     }
//   }
// };

// // Función para verificar token en segundo plano sin bloquear
// const silentTokenVerification = async (token) => {
//   try {
//     console.log("🔄 Verificando token en segundo plano...");
//     const response = await fetch(`${api.defaults.baseURL}/custom/v1/verify-token-fast`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       },
//       method: 'GET',
//       cache: 'no-store'
//     });
    
//     if (response.ok) {
//       // Token sigue siendo válido
//       localStorage.setItem("token_last_verified", Date.now().toString());
//       console.log("✅ Token verificado en segundo plano");
//       return true;
//     } else {
//       console.log("⚠️ Token posiblemente expirado");
//       return false;
//     }
//   } catch (error) {
//     console.warn("⚠️ Error al verificar token en segundo plano:", error.message);
//     return false;
//   }
// };

// // Versión mejorada de preloadCommonData
// const preloadCommonData = async () => {
//   try {
//     // Verificar si ya tenemos datos en caché recientes
//     const configTimestamp = localStorage.getItem('site_config_timestamp');
//     const prefsTimestamp = localStorage.getItem('user_preferences_timestamp');
//     const now = Date.now();
//     const MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas
    
//     // Determinar qué datos necesitamos refrescar
//     const needConfig = !configTimestamp || (now - parseInt(configTimestamp) > MAX_AGE);
//     const needPrefs = !prefsTimestamp || (now - parseInt(prefsTimestamp) > MAX_AGE);
    
//     if (!needConfig && !needPrefs) {
//       console.log("✅ Usando datos precargados en caché");
//       return { fromCache: true };
//     }
    
//     // Primero verificar la calidad de red
//     const networkCheck = await checkNetworkQuality();
    
//     // Si la red es mala, no intentar cargar datos
//     if (networkCheck.quality === "poor" || networkCheck.pingTime > 3000) {
//       console.log("⚠️ Red lenta, omitiendo precarga de datos");
//       return { skipped: true, reason: "poor_network" };
//     }
    
//     // Solo hacer las solicitudes necesarias
//     const promises = [];
    
//     if (needConfig) {
//       promises.push(
//         fetch(`${api.defaults.baseURL}/custom/v1/site-config`)
//           .then(response => response.json())
//           .then(data => {
//             if (data && data.success) {
//               localStorage.setItem('site_config', JSON.stringify(data.config));
//               localStorage.setItem('site_config_timestamp', now.toString());
//               return { type: 'config', success: true };
//             }
//             return { type: 'config', success: false };
//           })
//           .catch(() => ({ type: 'config', success: false }))
//       );
//     }
    
//     if (needPrefs) {
//       promises.push(
//         fetch(`${api.defaults.baseURL}/custom/v1/user-preferences`, {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem("jwt_token")}`
//           }
//         })
//           .then(response => response.json())
//           .then(data => {
//             if (data) {
//               localStorage.setItem('user_preferences', JSON.stringify(data));
//               localStorage.setItem('user_preferences_timestamp', now.toString());
//               return { type: 'preferences', success: true };
//             }
//             return { type: 'preferences', success: false };
//           })
//           .catch(() => ({ type: 'preferences', success: false }))
//       );
//     }
    
//     // Usar Promise.allSettled para que los errores no detengan otras promesas
//     if (promises.length > 0) {
//       const results = await Promise.allSettled(promises);
//       const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
//       if (successCount > 0) {
//         console.log(`✅ Datos comunes precargados: ${successCount}/${promises.length} exitosos`);
//       }
      
//       return { results };
//     }
    
//     return { fromCache: true, noUpdatesNeeded: true };
//   } catch (error) {
//     console.warn("⚠️ Error en precarga de datos:", error.message);
//     return { error: error.message };
//   }
// };

// Funciones para persistencia de token que mantienen la sesión al recargar
const saveAuthToken = (token, remember = true) => {
  // Siempre guardamos en sessionStorage (para la sesión actual)
  sessionStorage.setItem("jwt_token", token);
  
  // Opcionalmente guardamos en localStorage si el usuario marca "recordar"
  if (remember) {
    // Guardar token con fecha de expiración en localStorage
    try {
      // Fecha de expiración: 7 días desde ahora
      const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      // Objeto con token y expiración
      const tokenData = {
        token: token,
        expires: expiry
      };
      
      // Guardar en localStorage
      localStorage.setItem("auth_token", JSON.stringify(tokenData));
      localStorage.setItem("token_saved_at", Date.now().toString());
      
      console.log("🔒 Token guardado con persistencia");
    } catch (error) {
      console.warn("⚠️ No se pudo guardar el token con persistencia:", error.message);
    }
  }
  
  // Añadir al objeto api
  if (api && api.defaults && api.defaults.headers) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Función para recuperar el token persistente
const getAuthToken = () => {
  // Primero intentamos obtener de sessionStorage (prioridad)
  let token = sessionStorage.getItem("jwt_token");
  
  // Si no hay token en sessionStorage, intentamos recuperar de localStorage
  if (!token) {
    try {
      const savedTokenData = localStorage.getItem("auth_token");
      
      if (savedTokenData) {
        const tokenData = JSON.parse(savedTokenData);
        
        // Verificar que el token no haya expirado
        if (tokenData.expires > Date.now()) {
          token = tokenData.token;
          
          // Restaurar en sessionStorage también
          sessionStorage.setItem("jwt_token", token);
          
          // Añadir al objeto api
          if (api && api.defaults && api.defaults.headers) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          console.log("🔓 Token recuperado del almacenamiento persistente");
        } else {
          console.log("⚠️ Token persistente expirado, eliminando");
          localStorage.removeItem("auth_token");
        }
      }
    } catch (error) {
      console.warn("⚠️ Error al recuperar token persistente:", error.message);
    }
  }
  
  return token;
};

// Función para limpiar tokens al cerrar sesión
const clearAuthTokens = () => {
  sessionStorage.removeItem("jwt_token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("token_saved_at");
  
  // Limpiar headers de autorización
  if (api && api.defaults && api.defaults.headers) {
    delete api.defaults.headers.common['Authorization'];
  }
  
  console.log("🧹 Tokens de autenticación eliminados");
};

// Función existente para verificar la calidad de red
const checkNetworkQuality = async (baseUrl) => {
  const startTime = performance.now();
  let status = "unknown";
  let pingTime = 0;
  
  try {
    // Hacemos una petición ligera al servidor para medir la latencia
    const response = await fetch(`${baseUrl || api.defaults.baseURL.replace('/wp-json', '')}/wp-json`, {
      method: 'HEAD',
      cache: 'no-store',
      credentials: 'omit' // Evitar envío de cookies para que sea más ligera
    });
    
    pingTime = performance.now() - startTime;
    status = response.ok ? "available" : "error";
    
    const networkQuality = 
      pingTime < 300 ? "excellent" :
      pingTime < 1000 ? "good" :
      pingTime < 3000 ? "fair" :
      "poor";
      
    console.log(`📶 Calidad de red: ${networkQuality} (${Math.round(pingTime)}ms)`);
    
    return {
      status,
      pingTime,
      quality: networkQuality,
      httpStatus: response.status
    };
  } catch (err) {
    pingTime = performance.now() - startTime;
    console.error(`❌ Error de conexión: ${err.message}`);
    
    return {
      status: "error",
      pingTime,
      quality: "unavailable",
      error: err.message
    };
  }
};

// ESTE USEEFFECT DEBE REEMPLAZAR EL EXISTENTE para usar la persistencia de token
useEffect(() => {
  const initAuth = async () => {
    const storedUser = localStorage.getItem("user_data");
    
    // Usar la nueva función para recuperar el token persistente
    const token = getAuthToken();
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);

        // Si tenemos token, verificar en segundo plano
        if (token) {
          // Intentar verificar el token sin bloquear la UI
          setTimeout(() => {
            silentTokenVerification(token).catch(() => {
              console.warn("⚠️ Verificación de token silenciosa falló");
            });
          }, 1000);
        }
        return;
      } catch (error) {
        console.error("❌ Error al procesar datos del usuario:", error);
      }
    }

    setLoading(false);
  };

  initAuth();
}, []);

// Versión optimizada de login con mejor manejo de red y persistencia de sesión
const login = async (emailOrUsername, password, rememberMe = true) => {
  const startTime = performance.now();
  
  try {
    // Validación de campos
    console.log("Datos recibidos:", { 
      emailOrUsername: emailOrUsername, 
      passwordLength: password?.length
    });
    
    const cleanEmailOrUsername = emailOrUsername?.toString().trim();
    const cleanPassword = password?.toString().trim();
    
    if (!cleanEmailOrUsername || !cleanPassword) {
      throw new AuthError(
        "El correo electrónico/usuario y la contraseña son obligatorios", 
        "missing_fields"
      );
    }

    console.log("Intentando iniciar sesión con:", { username: cleanEmailOrUsername });

    // 1. VERIFICAR CACHÉ AGRESIVA - Priorizar velocidad sobre actualización
    const cachedUserData = localStorage.getItem("user_data");
    const cachedUserEmail = localStorage.getItem("user_email");
    const cachedTimestamp = localStorage.getItem("login_timestamp");
    // Usar getAuthToken en lugar de sessionStorage.getItem
    const cachedToken = getAuthToken();
    const now = Date.now();
    
    // Aumentamos caché a 7 días - es mejor tener datos desactualizados que ninguno
    const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días
    
    if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && 
        cachedTimestamp && cachedToken) {
      
      // Si la caché es reciente (menos de 2 horas), usarla sin verificación
      if (now - parseInt(cachedTimestamp) < 2 * 60 * 60 * 1000) {
        try {
          const userData = JSON.parse(cachedUserData);
          console.log("✅ Login exitoso (desde caché reciente)");
          setUser(userData);
          
          // Intentaremos verificar el token solo en segundo plano
          setTimeout(() => {
            silentTokenVerification(cachedToken).catch(() => {});
          }, 1000);
          
          return userData;
        } catch (cacheError) {
          console.warn("⚠️ Error al usar caché reciente:", cacheError.message);
        }
      }
      
      // Si la caché es válida pero no tan reciente, verificar primero
      if (now - parseInt(cachedTimestamp) < CACHE_MAX_AGE) {
        // Verificar la calidad de la conexión primero
        const networkStatus = await checkNetworkQuality();
        
        // Si la red es lenta, mejor usar caché que esperar mucho
        if (networkStatus.quality === "poor" || networkStatus.quality === "unavailable") {
          try {
            const userData = JSON.parse(cachedUserData);
            console.log("⚠️ Red lenta o no disponible. Usando datos en caché.");
            setUser(userData);
            return userData;
          } catch (emergencyCacheError) {
            console.warn("⚠️ Error al usar caché de emergencia:", emergencyCacheError.message);
          }
        }
      }
    }
    
    // 2. DIAGNÓSTICO DE RED - Medir la calidad de la conexión
    const networkCheck = await checkNetworkQuality();
    console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);
    
    // 3. OPTIMIZACIÓN DE SOLICITUD
    // Intentar login con timeout adaptativo basado en la calidad de la red
    let timeout = 30000; // Default 30 segundos
    
    if (networkCheck.quality === "excellent") timeout = 15000;
    else if (networkCheck.quality === "good") timeout = 25000;
    else if (networkCheck.quality === "fair") timeout = 35000;
    else if (networkCheck.quality === "poor") timeout = 45000;
    
    console.log(`⏱️ Timeout configurado: ${timeout}ms basado en calidad de red`);
    
    try {
      // Usar un objeto URL explícito para evitar problemas de resolución DNS
      const baseUrl = api.defaults.baseURL.replace('/wp-json', '');
      const endpoint = "/wp-json/custom/v1/login";
      const fullUrl = `${baseUrl}${endpoint}`;
      
      console.log(`🔄 Iniciando solicitud a: ${fullUrl}`);
      console.time("⏱ LOGIN API");
      
      // Optimización: Usar fetch directo con keep-alive
      const fetchResponse = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Connection': 'keep-alive' // Forzar keep-alive para conexión más rápida
        },
        body: JSON.stringify({
          username: cleanEmailOrUsername,
          password: cleanPassword,
          include_profile: true
        }),
        credentials: 'same-origin', // Evitar problemas de CORS
        cache: 'no-cache', // Siempre pedir fresco
        mode: 'cors', // Permitir CORS si es necesario
        timeout: timeout // No soportado directamente en fetch, pero añadido para referencia
      });
      
      // Implementar timeout manual
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
      });
      
      const response = await Promise.race([
        fetchResponse.json(),
        timeoutPromise
      ]);
      
      console.timeEnd("⏱ LOGIN API");
      
      const data = response;
      
      // Si el servidor devuelve su tiempo de ejecución
      if (data.execution_time) {
        const totalTime = performance.now() - startTime;
        console.log(`📊 Estadísticas de rendimiento:
          - Tiempo total: ${Math.round(totalTime)}ms
          - Tiempo servidor: ${data.execution_time}ms
          - Tiempo red/cliente: ${Math.round(totalTime - data.execution_time)}ms`);
      }
      
      const { token, user: profileData } = data;
      if (!token || !profileData?.id) throw new Error("Token inválido o usuario sin ID");
      
      // CAMBIO AQUÍ: Usar saveAuthToken en lugar de sessionStorage
      saveAuthToken(token, rememberMe);
      
      // Construimos el objeto de usuario
      const fullUser = {
        id: profileData.id,
        username: profileData.username,
        email: profileData.email || localStorage.getItem("user_email"),
        displayName: `${profileData.first_name} ${profileData.last_name}`.trim(),
        
        // Campos personalizados
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        phone: profileData.phone || "",
        company: profileData.company || "",
        country: profileData.country || "",
        state: profileData.state || "",
        city: profileData.city || "",
        job: profileData.job || "",
        
        avatarUrl: null,
        meta: {}
      };
      
      // Guardar datos con timestamp para la caché
      localStorage.setItem("user_email", fullUser.email);
      localStorage.setItem("user_data", JSON.stringify(fullUser));
      localStorage.setItem("login_timestamp", now.toString());
      localStorage.setItem("token_last_verified", now.toString());
      
      setUser(fullUser);
      
      console.log("✅ Login exitoso:", fullUser);
      
      // Precarga datos en segundo plano con manejo adecuado de errores
      setTimeout(() => {
        try {
          if (typeof preloadCommonData === 'function') {
            const preloadPromise = preloadCommonData();
            if (preloadPromise && typeof preloadPromise.catch === 'function') {
              preloadPromise.catch(() => {});
            }
          }
        } catch (preloadError) {
          // Ignorar errores de precarga
        }
      }, 500);
      
      return fullUser;
      
    } catch (networkError) {
      console.error("❌ Error de red durante login:", networkError);
      
      // 4. VERIFICAR SI HAY DATOS DE CACHÉ DISPONIBLES COMO FALLBACK
      if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && 
          cachedTimestamp && (now - parseInt(cachedTimestamp) < CACHE_MAX_AGE)) {
        
        try {
          console.log("⚠️ Usando caché como fallback después de error de red");
          const userData = JSON.parse(cachedUserData);
          
          // Marcar que estamos usando datos potencialmente desactualizados
          setUser({
            ...userData,
            _offlineMode: true
          });
          
          return {
            ...userData,
            _warning: "Usando datos guardados debido a problemas de conexión"
          };
        } catch (fallbackError) {
          console.error("❌ También falló el uso de caché:", fallbackError);
        }
      }
      
      // Si el error es de timeout o red, dar un mensaje más amigable
      if (networkError.message === 'Timeout' || 
          networkError.name === 'AbortError' || 
          networkError.code === 'ECONNABORTED' ||
          networkError.message.includes('timeout') ||
          networkError.message === 'canceled' || 
          networkError.code === 'ERR_CANCELED' ||
          networkError.message.includes('network')) {
        
        throw new AuthError(
          "La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet o inténtalo más tarde.",
          "network_timeout"
        );
      }
      
      // Lanzar el error original para otros casos
      throw networkError;
    }
    
  } catch (err) {
    console.error("❌ Error durante el login:", err);
    
    // Manejo específico de errores de autenticación
    if (err.response?.data) {
      const { code, message } = err.response.data;
      
      const errorMessages = {
        'invalid_email': "Este correo electrónico no está registrado",
        'invalid_username': "Este nombre de usuario no está registrado",
        'incorrect_password': "La contraseña es incorrecta",
        'missing_fields': "El usuario y la contraseña son obligatorios"
      };
      
      throw new AuthError(
        errorMessages[code] || message || "Error de autenticación",
        code || "auth_error" 
      );
    } else if (err instanceof AuthError) {
      throw err;
    } else {
      throw new AuthError(
        err.message || "Ha ocurrido un error durante el inicio de sesión",
        "unknown_error"
      );
    }
  }
};

// Modificar la función logout para usar la nueva función clearAuthTokens
const logout = () => {
  // Usar la nueva función para limpiar tokens
  clearAuthTokens();
  
  // Limpiar resto de datos de usuario
  localStorage.removeItem("user_data");
  localStorage.removeItem("user_email");
  localStorage.removeItem("login_timestamp");
  localStorage.removeItem("token_last_verified");
  localStorage.removeItem("user_data_timestamp");
  localStorage.removeItem("site_config_timestamp");
  localStorage.removeItem("user_preferences_timestamp");
  
  setUser(null);
};

// Función para verificar token en segundo plano sin bloquear
const silentTokenVerification = async (token) => {
  try {
    console.log("🔄 Verificando token en segundo plano...");
    const response = await fetch(`${api.defaults.baseURL}/custom/v1/verify-token-fast`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      method: 'GET',
      cache: 'no-store'
    });
    
    if (response.ok) {
      // Token sigue siendo válido
      localStorage.setItem("token_last_verified", Date.now().toString());
      console.log("✅ Token verificado en segundo plano");
      return true;
    } else {
      console.log("⚠️ Token posiblemente expirado");
      return false;
    }
  } catch (error) {
    console.warn("⚠️ Error al verificar token en segundo plano:", error.message);
    return false;
  }
};

// Versión mejorada de preloadCommonData
const preloadCommonData = async () => {
  try {
    // Verificar si ya tenemos datos en caché recientes
    const configTimestamp = localStorage.getItem('site_config_timestamp');
    const prefsTimestamp = localStorage.getItem('user_preferences_timestamp');
    const now = Date.now();
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas
    
    // Determinar qué datos necesitamos refrescar
    const needConfig = !configTimestamp || (now - parseInt(configTimestamp) > MAX_AGE);
    const needPrefs = !prefsTimestamp || (now - parseInt(prefsTimestamp) > MAX_AGE);
    
    if (!needConfig && !needPrefs) {
      console.log("✅ Usando datos precargados en caché");
      return { fromCache: true };
    }
    
    // Primero verificar la calidad de red
    const networkCheck = await checkNetworkQuality();
    
    // Si la red es mala, no intentar cargar datos
    if (networkCheck.quality === "poor" || networkCheck.pingTime > 3000) {
      console.log("⚠️ Red lenta, omitiendo precarga de datos");
      return { skipped: true, reason: "poor_network" };
    }
    
    // Solo hacer las solicitudes necesarias
    const promises = [];
    
    if (needConfig) {
      promises.push(
        fetch(`${api.defaults.baseURL}/custom/v1/site-config`)
          .then(response => response.json())
          .then(data => {
            if (data && data.success) {
              localStorage.setItem('site_config', JSON.stringify(data.config));
              localStorage.setItem('site_config_timestamp', now.toString());
              return { type: 'config', success: true };
            }
            return { type: 'config', success: false };
          })
          .catch(() => ({ type: 'config', success: false }))
      );
    }
    
    if (needPrefs) {
      promises.push(
        fetch(`${api.defaults.baseURL}/custom/v1/user-preferences`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`  // Usar getAuthToken para mayor consistencia
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data) {
              localStorage.setItem('user_preferences', JSON.stringify(data));
              localStorage.setItem('user_preferences_timestamp', now.toString());
              return { type: 'preferences', success: true };
            }
            return { type: 'preferences', success: false };
          })
          .catch(() => ({ type: 'preferences', success: false }))
      );
    }
    
    // Usar Promise.allSettled para que los errores no detengan otras promesas
    if (promises.length > 0) {
      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
      if (successCount > 0) {
        console.log(`✅ Datos comunes precargados: ${successCount}/${promises.length} exitosos`);
      }
      
      return { results };
    }
    
    return { fromCache: true, noUpdatesNeeded: true };
  } catch (error) {
    console.warn("⚠️ Error en precarga de datos:", error.message);
    return { error: error.message };
  }
};

//     localStorage.removeItem("user_data");
//     localStorage.removeItem("user_email");
//     sessionStorage.removeItem("jwt_token");
//     setUser(null);
// };

const isAuthenticated = () => {
    if (!user) return false;
    const token = sessionStorage.getItem("jwt_token");
    if (!token) return false;
    try {
      const payload = token.split('.')[1];
      const { exp } = JSON.parse(atob(payload));
      return !exp || new Date(exp * 1000) > new Date();
    } catch {
      return false;
    }
};

  // Nueva función para actualizar los metadatos del usuario
const updateUserMetadata = async (metadata) => {
    if (!user || !user.id) {
      throw new Error("No hay un usuario autenticado para actualizar metadatos");
    }
    
    try {
      setLoading(true);
      console.log("Actualizando metadatos:", metadata);
      
      // Intentar actualizar a través del endpoint personalizado si existe
      try {
        const { data } = await api.post("/custom/v1/update-profile", metadata);
        console.log("Metadatos actualizados con éxito:", data);
        
        // Actualizar el usuario en el estado local
        setUser(prevUser => ({
          ...prevUser,
          ...metadata,
          // Actualizar también el objeto meta para consistencia
          meta: {
            ...prevUser.meta,
            ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, v]))
          }
        }));
        
        // Actualizar en localStorage
        const updatedUser = {
          ...user,
          ...metadata,
          meta: {
            ...user.meta,
            ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, v]))
          }
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        
        return data;
      } catch (err) {
        console.log("Endpoint de actualización no disponible, intentando con la API estándar:", err.message);
        
        // Fallback: actualizar a través de la API estándar de WP
        const updatedMetaFields = {};
        
        for (const [key, value] of Object.entries(metadata)) {
          try {
            await api.post(`/wp/v2/users/${user.id}`, {
              meta: { [key]: value }
            });
            updatedMetaFields[key] = value;
          } catch (metaErr) {
            console.error(`Error al actualizar campo ${key}:`, metaErr);
          }
        }
        
        // Actualizar el usuario en el estado local
        setUser(prevUser => ({
          ...prevUser,
          ...updatedMetaFields,
          meta: {
            ...prevUser.meta,
            ...updatedMetaFields
          }
        }));
        
        // Actualizar en localStorage
        const updatedUser = {
          ...user,
          ...updatedMetaFields,
          meta: {
            ...user.meta,
            ...updatedMetaFields
          }
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        
        return { success: true, updated_fields: updatedMetaFields };
      }
    } catch (err) {
      console.error("❌ Error al actualizar metadatos:", err);
      throw err;
    } finally {
      setLoading(false);
    }
};

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      loading, 
      isAuthenticated,
      updateUserMetadata // Exportamos la nueva función
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);