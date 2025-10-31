
// // src/context/authProviderContext.js
// import { createContext, useCallback, useContext, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import {
//   loginUser,
//   forceLoginUser,
//   validateToken,
//   logoutUser,
//   registerUser,
//   requestPasswordReset as requestPasswordResetService,
//   verifyResetToken as verifyResetTokenService,
//   resetPassword as resetPasswordService,
// } from "../services/wooCommerceService";
// import { AuthError } from "../utils/AuthError";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // 🔥 CRÍTICO: Empieza en true
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false); // 🔥 NUEVO: Para tracking

//   const navigate = useNavigate();

//   // ============================================
//   // FUNCIONES DE PERSISTENCIA DE TOKEN (MEMOIZADAS)
//   // ============================================

//   const getCurrentOrigin = useCallback(() => {
//     const hostname = window.location.hostname;
    
//     let detectedOrigin = 'web';
    
//     if (hostname.includes('app.olawee.com') || 
//         hostname.includes('localhost:5173') ||
//         hostname.includes('localhost:5174')) {
//       detectedOrigin = 'app';
//     } else if (hostname.includes('olawee.com') || 
//                hostname.includes('www.olawee.com') ||
//                hostname.includes('localhost:3000') ||
//                hostname.includes('localhost:3001')) {
//       detectedOrigin = 'web';
//     }
    
//     console.log(`🔍 [ORIGIN DEBUG] Hostname: ${hostname} → Detected Origin: ${detectedOrigin}`);
    
//     return detectedOrigin;
//   }, []);

//   const generateWindowId = useCallback(() => {
//     let windowId = sessionStorage.getItem('window_session_id');
//     if (!windowId) {
//       windowId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       sessionStorage.setItem('window_session_id', windowId);
//       console.log(`🪟 Nueva ventana/pestaña ID: ${windowId}`);
//     }
//     return windowId;
//   }, []);

//   const saveAuthToken = useCallback((token, sessionToken, origin, windowId, remember = true) => {
//     const currentOrigin = origin || getCurrentOrigin();

//     sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
//     sessionStorage.setItem(`user_data`, JSON.stringify({
//       token,
//       sessionToken,
//       origin: currentOrigin,
//       windowId,
//       timestamp: Date.now()
//     }));
    
//     if (sessionToken) {
//       sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
//     }

//     console.log(`✅ Token guardado en sessionStorage (origen: ${currentOrigin}, windowId: ${windowId})`);
//   }, [getCurrentOrigin]);

//   const getAuthToken = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     let token = sessionStorage.getItem(`jwt_token_${currentOrigin}`);
//     let sessionToken = sessionStorage.getItem(`session_token_${currentOrigin}`);

//     if (token) {
//       console.log(`✅ Token encontrado en sessionStorage (origen: ${currentOrigin})`);
//       return { token, sessionToken, origin: currentOrigin };
//     }

//     console.log(`ℹ️ No hay sesión activa en esta ventana`);
//     return { token: null, sessionToken: null, origin: currentOrigin };
//   }, [getCurrentOrigin]);

//   const clearAuthTokens = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     sessionStorage.removeItem(`jwt_token_${currentOrigin}`);
//     sessionStorage.removeItem(`session_token_${currentOrigin}`);
//     sessionStorage.removeItem("user_data");
//     sessionStorage.removeItem("window_session_id");
    
//     console.log(`🧹 Tokens y window_id limpiados para origen: ${currentOrigin}`);
//   }, [getCurrentOrigin]);

//   const saveUserData = useCallback((userData) => {
//     sessionStorage.setItem("user_data", JSON.stringify(userData));
//     sessionStorage.setItem("user_email", userData.email);
//     sessionStorage.setItem("login_timestamp", Date.now().toString());
    
//     console.log(`💾 Datos de usuario guardados en sessionStorage`);
//   }, []);

//   const getUserData = useCallback(() => {
//     const sessionUserData = sessionStorage.getItem("user_data");
//     if (sessionUserData) {
//       try {
//         const parsed = JSON.parse(sessionUserData);
//         console.log(`✅ Datos de usuario encontrados en sessionStorage:`, parsed.email);
//         return parsed;
//       } catch (e) {
//         console.error('❌ Error parseando user_data:', e);
//         sessionStorage.removeItem("user_data");
//         return null;
//       }
//     }

//     console.log(`ℹ️ No hay datos de usuario en esta ventana`);
//     return null;
//   }, []);

//   // ============================================
//   // VERIFICACIÓN DE CALIDAD DE RED
//   // ============================================

//   const checkNetworkQuality = useCallback(async (baseUrl) => {
//     const startTime = performance.now();
//     let status = "unknown";
//     let pingTime = 0;

//     try {
//       const apiBase = baseUrl || "https://api.olawee.com";
//       const response = await fetch(`${apiBase}/wp-json`, {
//         method: "HEAD",
//         cache: "no-store",
//         credentials: "omit",
//       });

//       pingTime = performance.now() - startTime;
//       status = response.ok ? "available" : "error";

//       const networkQuality =
//         pingTime < 300
//           ? "excellent"
//           : pingTime < 1000
//           ? "good"
//           : pingTime < 3000
//           ? "fair"
//           : "poor";

//       console.log(`📶 Calidad de red: ${networkQuality} (${Math.round(pingTime)}ms)`);

//       return {
//         status,
//         pingTime,
//         quality: networkQuality,
//         httpStatus: response.status,
//       };
//     } catch (err) {
//       pingTime = performance.now() - startTime;
//       console.error(`❌ Error de conexión: ${err.message}`);

//       return {
//         status: "error",
//         pingTime,
//         quality: "unavailable",
//         error: err.message,
//       };
//     }
//   }, []);

//   // ============================================
//   // VERIFICACIÓN SILENCIOSA DE TOKEN
//   // ============================================

//   const silentTokenVerification = useCallback(async (token, sessionToken) => {
//     try {
//       console.log("🔄 Verificando token en segundo plano...");

//       const result = await validateToken(token, sessionToken);

//       if (result.valid) {
//         sessionStorage.setItem("token_last_verified", Date.now().toString());
//         console.log("✅ Token verificado en segundo plano");
//         return true;
//       } else {
//         console.log("⚠️ Token posiblemente expirado");
//         return false;
//       }
//     } catch (error) {
//       if (error.code === "session_invalidated") {
//         console.warn("⚠️ Sesión invalidada en otro dispositivo");
//         clearAuthTokens();
//         sessionStorage.removeItem("user_data");
//         setUser(null);
//         return false;
//       }

//       console.warn("⚠️ Error al verificar token en segundo plano:", error.message);
//       return false;
//     }
//   }, [clearAuthTokens]);

//   // ============================================
//   // 🔥 INICIALIZACIÓN - MEJORADO
//   // ============================================

//   useEffect(() => {
//     // 🔥 Evitar ejecuciones múltiples
//     if (isInitialized) {
//       console.log('ℹ️ Ya inicializado, saltando...');
//       return;
//     }

//     const initAuth = async () => {
//       console.log('🚀 ========== INICIANDO AUTENTICACIÓN ==========');
//       console.log('🔍 Estado inicial - loading:', loading, 'user:', user?.email);

//       try {
//         // 1. Generar window_id
//         const windowId = generateWindowId();
//         console.log('🪟 Window ID:', windowId);
        
//         // 2. Obtener token desde sessionStorage
//         const { token, sessionToken } = getAuthToken();
//         console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');

//         // 3. Si no hay token, terminar inicialización
//         if (!token) {
//           console.log('ℹ️ No hay token, inicialización completa (sin usuario)');
//           setIsInitialized(true);
//           setLoading(false);
//           return;
//         }

//         // 4. Obtener datos del usuario desde sessionStorage
//         const storedUser = getUserData();
//         console.log('👤 Usuario guardado:', storedUser ? storedUser.email : 'NO');

//         // 5. Si hay token pero no hay datos de usuario, limpiar
//         if (!storedUser) {
//           console.warn('⚠️ Token existe pero no hay datos de usuario, limpiando...');
//           clearAuthTokens();
//           setIsInitialized(true);
//           setLoading(false);
//           return;
//         }

//         // 6. Verificar que el token no esté expirado (básico)
//         try {
//           const payload = token.split(".")[1];
//           const decoded = JSON.parse(atob(payload));
//           const now = Date.now() / 1000;
          
//           if (decoded.exp && decoded.exp < now) {
//             console.warn('⚠️ Token expirado, limpiando...');
//             clearAuthTokens();
//             sessionStorage.removeItem("user_data");
//             setIsInitialized(true);
//             setLoading(false);
//             return;
//           }
//           console.log('✅ Token NO expirado, válido hasta:', new Date(decoded.exp * 1000).toLocaleString());
//         } catch (decodeError) {
//           console.error('❌ Error decodificando token:', decodeError);
//           clearAuthTokens();
//           sessionStorage.removeItem("user_data");
//           setIsInitialized(true);
//           setLoading(false);
//           return;
//         }

//         // 7. Restaurar usuario
//         console.log('✅ Restaurando sesión del usuario:', storedUser.email);
//         setUser(storedUser);
//         setIsInitialized(true);
//         setLoading(false);

//         // 8. Verificar en segundo plano (sin bloquear)
//         setTimeout(() => {
//           console.log('🔄 Iniciando verificación silenciosa...');
//           silentTokenVerification(token, sessionToken).catch((err) => {
//             console.warn("⚠️ Verificación de token silenciosa falló:", err);
//           });
//         }, 2000); // Esperar 2 segundos después de cargar

//       } catch (error) {
//         console.error("❌ Error durante inicialización:", error);
//         clearAuthTokens();
//         sessionStorage.removeItem("user_data");
//         setUser(null);
//         setIsInitialized(true);
//         setLoading(false);
//       }

//       console.log('✅ ========== FIN INICIALIZACIÓN ==========');
//     };

//     initAuth();
//   }, [clearAuthTokens, generateWindowId, getAuthToken, getUserData, isInitialized, loading, silentTokenVerification, user?.email]); // 🔥 SOLO ejecutar UNA vez al montar

//   // 🔥 LISTENER para forzar logout desde otras pestañas
//   useEffect(() => {
//     const handleBroadcast = (event) => {
//       if (event.data.type === 'FORCE_LOGOUT') {
//         const myWindowId = sessionStorage.getItem('window_session_id');
        
//         // Si el mensaje NO es de esta ventana, hacer logout
//         if (event.data.windowId !== myWindowId) {
//           console.warn('⚠️ Force logout detectado desde otra ventana');
//           clearAuthTokens();
//           sessionStorage.removeItem("user_data");
//           setUser(null);
//         }
//       }
//     };

//     try {
//       const channel = new BroadcastChannel('olawee_session_channel');
//       channel.addEventListener('message', handleBroadcast);
      
//       return () => {
//         channel.removeEventListener('message', handleBroadcast);
//         channel.close();
//       };
//     } catch (e) {
//       console.warn('⚠️ BroadcastChannel no soportado');
//     }
//   }, [clearAuthTokens]);

//   // ============================================
//   // LOGIN
//   // ============================================

//   const login = useCallback(async (emailOrUsername, password, rememberMe = true) => {
//     try {
//       const cleanEmailOrUsername = emailOrUsername?.toString().trim();
//       const cleanPassword = password?.toString().trim();

//       if (!cleanEmailOrUsername || !cleanPassword) {
//         throw new AuthError(
//           "El correo electrónico/usuario y la contraseña son obligatorios",
//           "missing_fields"
//         );
//       }

//       console.log("Intentando iniciar sesión con:", { username: cleanEmailOrUsername });

//       const windowId = generateWindowId();

//       // Verificar caché de ESTA pestaña
//       const cachedUserData = sessionStorage.getItem("user_data");
//       const cachedUserEmail = sessionStorage.getItem("user_email");
//       const cachedTimestamp = sessionStorage.getItem("login_timestamp");
//       const { token: cachedToken, sessionToken: cachedSessionToken } = getAuthToken();
//       const now = Date.now();

//       if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && cachedTimestamp && cachedToken) {
//         if (now - parseInt(cachedTimestamp) < 2 * 60 * 60 * 1000) {
//           try {
//             const userData = JSON.parse(cachedUserData);
//             console.log("✅ Login exitoso (desde caché de sessionStorage)");
//             setUser(userData);

//             setTimeout(() => {
//               silentTokenVerification(cachedToken, cachedSessionToken).catch(() => {});
//             }, 1000);

//             return userData;
//           } catch (cacheError) {
//             console.warn("⚠️ Error al usar caché:", cacheError.message);
//           }
//         }
//       }

//       const networkCheck = await checkNetworkQuality();
//       console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);

//       console.time("⏱ LOGIN API");
//       const result = await loginUser(cleanEmailOrUsername, cleanPassword, windowId);
//       console.timeEnd("⏱ LOGIN API");

//       if (result.conflict) {
//         console.warn("⚠️ Conflicto de sesión detectado");
//         return {
//           conflict: true,
//           message: result.message,
//           origin: result.origin,
//           user: result.user,
//         };
//       }

//       const { token, sessionToken, origin, user: profileData } = result;

//       saveAuthToken(token, sessionToken, origin, windowId, rememberMe);

//       const fullUser = {
//         id: profileData.id,
//         username: profileData.username || profileData.email,
//         email: profileData.email,
//         displayName: profileData.name || 
//           `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
//         firstName: profileData.first_name || "",
//         lastName: profileData.last_name || "",
//         phone: profileData.phone || "",
//         company: profileData.empresa || "",
//         country: profileData.country || "",
//         state: profileData.state || "",
//         city: profileData.city || "",
//         job: profileData.job || "",
//         roles: profileData.roles || [],
//         avatarUrl: null,
//         meta: {},
//       };

//       saveUserData(fullUser);
//       sessionStorage.setItem("token_last_verified", now.toString());
//       setUser(fullUser);

//       console.log("✅ Login exitoso:", fullUser);

//       return fullUser;
//     } catch (err) {
//       console.error("❌ Error durante el login:", err);

//       if (
//         err.message === "Timeout" ||
//         err.name === "AbortError" ||
//         err.code === "ECONNABORTED" ||
//         err.message.includes("timeout") ||
//         err.message === "canceled" ||
//         err.code === "ERR_CANCELED" ||
//         err.message.includes("network")
//       ) {
//         const cachedUserData = sessionStorage.getItem("user_data");
//         const cachedUserEmail = sessionStorage.getItem("user_email");

//         if (cachedUserData && cachedUserEmail === emailOrUsername?.toString().trim()) {
//           try {
//             console.log("⚠️ Usando caché de sessionStorage como fallback");
//             const userData = JSON.parse(cachedUserData);
//             setUser({ ...userData, _offlineMode: true });
//             return {
//               ...userData,
//               _warning: "Usando datos guardados debido a problemas de conexión",
//             };
//           } catch (fallbackError) {
//             console.error("❌ También falló el uso de caché:", fallbackError);
//           }
//         }

//         throw new AuthError(
//           "La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet o inténtalo más tarde.",
//           "network_timeout"
//         );
//       }

//       if (err.code) {
//         throw new AuthError(err.message, err.code);
//       }

//       throw new AuthError(
//         err.message || "Ha ocurrido un error durante el inicio de sesión",
//         "unknown_error"
//       );
//     }
//   }, [getAuthToken, saveAuthToken, saveUserData, checkNetworkQuality, silentTokenVerification, generateWindowId]);

//   // ============================================
//   // FORCE LOGIN
//   // ============================================

//   const forceLogin = useCallback(async (emailOrUsername, password, rememberMe = true) => {
//     try {
//       const cleanEmailOrUsername = emailOrUsername?.toString().trim();
//       const cleanPassword = password?.toString().trim();

//       if (!cleanEmailOrUsername || !cleanPassword) {
//         throw new AuthError(
//           "El correo electrónico/usuario y la contraseña son obligatorios",
//           "missing_fields"
//         );
//       }

//       console.log("🔄 Forzando inicio de sesión (cerrando otras sesiones)");

//       const windowId = generateWindowId();

//       const result = await forceLoginUser(cleanEmailOrUsername, cleanPassword, windowId);
//       const { token, sessionToken, origin, user: profileData } = result;

//       saveAuthToken(token, sessionToken, origin, windowId, rememberMe);

//       const fullUser = {
//         id: profileData.id,
//         username: profileData.username || profileData.email,
//         email: profileData.email,
//         displayName: profileData.name || 
//           `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
//         firstName: profileData.first_name || "",
//         lastName: profileData.last_name || "",
//         phone: profileData.phone || "",
//         company: profileData.empresa || "",
//         country: profileData.country || "",
//         state: profileData.state || "",
//         city: profileData.city || "",
//         job: profileData.job || "",
//         roles: profileData.roles || [],
//         avatarUrl: null,
//         meta: {},
//       };

//       const now = Date.now();
//       saveUserData(fullUser);
//       sessionStorage.setItem("token_last_verified", now.toString());
//       setUser(fullUser);

//       console.log("✅ Force login exitoso:", fullUser);

//       try {
//         const channel = new BroadcastChannel('olawee_session_channel');
//         channel.postMessage({
//           type: 'FORCE_LOGOUT',
//           windowId: windowId,
//           origin: origin,
//           timestamp: now
//         });
//         channel.close();
//         console.log('📢 Notificación FORCE_LOGOUT enviada a otras ventanas');
//       } catch (broadcastError) {
//         console.warn('⚠️ No se pudo enviar notificación BroadcastChannel:', broadcastError);
//       }

//       return fullUser;
//     } catch (err) {
//       console.error("❌ Error durante force login:", err);

//       if (err.code) {
//         throw new AuthError(err.message, err.code);
//       }

//       throw new AuthError(
//         err.message || "Ha ocurrido un error durante el inicio de sesión",
//         "unknown_error"
//       );
//     }
//   }, [saveAuthToken, saveUserData, generateWindowId]);

//   // ============================================
//   // REGISTER
//   // ============================================

//   const register = useCallback(async (userData) => {
//     try {
//       const result = await registerUser(
//         userData.email,
//         userData.username || userData.email.split("@")[0],
//         userData.password,
//         userData
//       );

//       const { token, sessionToken, origin, user: profileData } = result;

//       const windowId = generateWindowId();
      
//       saveAuthToken(token, sessionToken, origin, windowId, true);

//       const fullUser = {
//         id: profileData.id,
//         username: profileData.username || profileData.email,
//         email: profileData.email,
//         displayName: profileData.displayName || 
//           `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
//         firstName: profileData.firstName || "",
//         lastName: profileData.lastName || "",
//         phone: profileData.phone || "",
//         company: profileData.company || "",
//         country: profileData.country || "",
//         state: profileData.state || "",
//         city: profileData.city || "",
//         job: profileData.job || "",
//         roles: profileData.roles || [],
//         avatarUrl: null,
//         meta: {},
//       };

//       const now = Date.now();
//       saveUserData(fullUser);
//       sessionStorage.setItem("token_last_verified", now.toString());

//       setUser(fullUser);

//       console.log("✅ Registro exitoso:", fullUser);

//       return fullUser;
//     } catch (err) {
//       console.error("❌ Error durante el registro:", err);

//       if (err.code) {
//         throw new AuthError(err.message, err.code);
//       }

//       throw new AuthError(
//         err.message || "Ha ocurrido un error durante el registro",
//         "unknown_error"
//       );
//     }
//   }, [saveAuthToken, saveUserData, generateWindowId]);

//   // ============================================
//   // LOGOUT
//   // ============================================

//   const logout = useCallback(async () => {
//     try {
//       const { token } = getAuthToken();
  
//       if (token) {
//         await logoutUser(token);
//       }
  
//       clearAuthTokens();
//       sessionStorage.removeItem("user_data");
//       sessionStorage.removeItem("user_email");
//       sessionStorage.removeItem("login_timestamp");
//       sessionStorage.removeItem("token_last_verified");
      
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");
//       localStorage.removeItem("login_timestamp");
//       localStorage.removeItem("token_last_verified");
//       localStorage.removeItem("user_data_timestamp");
//       localStorage.removeItem("site_config_timestamp");
//       localStorage.removeItem("user_preferences_timestamp");
  
//       setUser(null);
  
//       console.log("✅ Logout exitoso");
  
//       // 🔥 NUEVO: Redirección automática desde páginas sensibles
//       const currentPath = window.location.pathname;
//       const sensitiveRoutes = ['/checkout', '/order-confirmation', '/my-account'];
      
//       const isInSensitiveRoute = sensitiveRoutes.some(route => 
//         currentPath.includes(route)
//       );
      
//       if (isInSensitiveRoute) {
//         console.log("🔄 Redirigiendo desde página protegida a home");
//         navigate('/');
//       }
  
//     } catch (err) {
//       console.error("⚠️ Error en logout, limpiando localmente:", err.message);
  
//       clearAuthTokens();
//       sessionStorage.removeItem("user_data");
//       sessionStorage.removeItem("user_email");
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");
  
//       setUser(null);
  
//       // 🔥 NUEVO: Redirección también en caso de error
//       const currentPath = window.location.pathname;
//       const sensitiveRoutes = ['/checkout', '/order-confirmation', '/my-account'];
      
//       const isInSensitiveRoute = sensitiveRoutes.some(route => 
//         currentPath.includes(route)
//       );
      
//       if (isInSensitiveRoute) {
//         console.log("🔄 Redirigiendo desde página protegida a home (tras error)");
//         navigate('/');
//       }
//     }
//   }, [getAuthToken, clearAuthTokens, navigate]); // 🔥 Añadir navigate a dependencias

//   // ============================================
//   // PASSWORD RESET
//   // ============================================

//   const requestPasswordReset = useCallback(async (email, origin = "web") => {
//     try {
//       return await requestPasswordResetService(email, origin);
//     } catch (err) {
//       console.error("❌ Error solicitando reset:", err);
//       throw new AuthError(
//         err.message || "Error al solicitar reseteo de contraseña",
//         err.code || "unknown_error"
//       );
//     }
//   }, []);

//   const verifyResetToken = useCallback(async (token, email) => {
//     try {
//       return await verifyResetTokenService(token, email);
//     } catch (err) {
//       console.error("❌ Error verificando token:", err);
//       throw new AuthError(
//         err.message || "Token inválido o expirado",
//         err.code || "unknown_error"
//       );
//     }
//   }, []);

//   const resetPassword = useCallback(async (token, email, newPassword) => {
//     try {
//       return await resetPasswordService(token, email, newPassword);
//     } catch (err) {
//       console.error("❌ Error reseteando contraseña:", err);
//       throw new AuthError(
//         err.message || "Error al resetear contraseña",
//         err.code || "unknown_error"
//       );
//     }
//   }, []);

//   // ============================================
//   // VALIDACIÓN DE AUTENTICACIÓN
//   // ============================================

//   const isAuthenticated = useCallback(() => {
//     if (!user) return false;

//     const { token } = getAuthToken();
//     if (!token) return false;

//     try {
//       const payload = token.split(".")[1];
//       const { exp } = JSON.parse(atob(payload));
//       return !exp || new Date(exp * 1000) > new Date();
//     } catch {
//       return false;
//     }
//   }, [user, getAuthToken]);

//   // ============================================
//   // REVALIDAR TOKEN
//   // ============================================

//   const revalidate = useCallback(async () => {
//     try {
//       const { token, sessionToken } = getAuthToken();

//       if (!token) {
//         setUser(null);
//         return false;
//       }

//       const result = await validateToken(token, sessionToken);

//       if (result.valid && result.user) {
//         const updatedUser = {
//           ...user,
//           ...result.user,
//         };
//         setUser(updatedUser);
//         saveUserData(updatedUser);
//         return true;
//       } else {
//         clearAuthTokens();
//         sessionStorage.removeItem("user_data");
//         setUser(null);
//         return false;
//       }
//     } catch (err) {
//       console.error("❌ Error revalidando token:", err);

//       if (err.code === "session_invalidated") {
//         clearAuthTokens();
//         sessionStorage.removeItem("user_data");
//         setUser(null);
//       }

//       return false;
//     }
//   }, [user, getAuthToken, clearAuthTokens, saveUserData]);

//   // ============================================
//   // ACTUALIZAR USUARIO
//   // ============================================

//   const updateUser = useCallback((userData) => {
//     const updatedUser = {
//       ...user,
//       ...userData,
//     };
    
//     setUser(updatedUser);
//     saveUserData(updatedUser);
//   }, [user, saveUserData]);

//   // ============================================
//   // GESTIÓN DE PRODUCTO PARA CHECKOUT
//   // ============================================

//   const selectProductForCheckout = useCallback((product) => {
//     if (!product || !product.id) {
//       console.warn('⚠️ Producto inválido:', product);
//       return;
//     }

//     setSelectedProduct(product);
//     sessionStorage.setItem('selected_product', JSON.stringify(product));
//     console.log('✅ Producto seleccionado para checkout:', product.name);
//   }, []);

//   const clearSelectedProduct = useCallback(() => {
//     setSelectedProduct(null);
//     sessionStorage.removeItem('selected_product');
//     console.log('🧹 Producto seleccionado limpiado');
//   }, []);

//   const restoreSelectedProduct = useCallback(() => {
//     try {
//       const savedProduct = sessionStorage.getItem('selected_product');
//       if (savedProduct) {
//         const product = JSON.parse(savedProduct);
//         setSelectedProduct(product);
//         console.log('♻️ Producto restaurado:', product.name);
//         return product;
//       }
//     } catch (e) {
//       console.error('❌ Error al restaurar producto:', e);
//       sessionStorage.removeItem('selected_product');
//     }
//     return null;
//   }, []);

//   useEffect(() => {
//     restoreSelectedProduct();
//   }, [restoreSelectedProduct]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         forceLogin,
//         register,
//         logout,
//         loading, // 🔥 EXPORTAR loading
//         isAuthenticated,
//         revalidate,
//         updateUser,
//         requestPasswordReset,
//         verifyResetToken,
//         resetPassword,
//         selectedProduct,
//         selectProductForCheckout,
//         clearSelectedProduct,
//         getToken: getAuthToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
















// src/context/authProviderContext.js
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  loginUser,
  forceLoginUser,
  validateToken,
  logoutUser,
  registerUser,
  requestPasswordReset as requestPasswordResetService,
  verifyResetToken as verifyResetTokenService,
  resetPassword as resetPasswordService,
} from "../services/wooCommerceService";
import { AuthError } from "../utils/AuthError";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 CRÍTICO: Empieza en true
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // 🔥 NUEVO: Para tracking

  const navigate = useNavigate();

  // ============================================
  // FUNCIONES DE PERSISTENCIA DE TOKEN (MEMOIZADAS)
  // ============================================

  const getCurrentOrigin = useCallback(() => {
    const hostname = window.location.hostname;
    
    let detectedOrigin = 'web';
    
    if (hostname.includes('app.olawee.com') || 
        hostname.includes('localhost:5173') ||
        hostname.includes('localhost:5174')) {
      detectedOrigin = 'app';
    } else if (hostname.includes('olawee.com') || 
               hostname.includes('www.olawee.com') ||
               hostname.includes('localhost:3000') ||
               hostname.includes('localhost:3001')) {
      detectedOrigin = 'web';
    }
    
    console.log(`🔍 [ORIGIN DEBUG] Hostname: ${hostname} → Detected Origin: ${detectedOrigin}`);
    
    return detectedOrigin;
  }, []);

  const generateWindowId = useCallback(() => {
    let windowId = sessionStorage.getItem('window_session_id');
    if (!windowId) {
      windowId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('window_session_id', windowId);
      console.log(`🪟 Nueva ventana/pestaña ID: ${windowId}`);
    }
    return windowId;
  }, []);

  const saveAuthToken = useCallback((token, sessionToken, origin, windowId, remember = true) => {
    const currentOrigin = origin || getCurrentOrigin();

    sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
    sessionStorage.setItem(`user_data`, JSON.stringify({
      token,
      sessionToken,
      origin: currentOrigin,
      windowId,
      timestamp: Date.now()
    }));
    
    if (sessionToken) {
      sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
    }

    console.log(`✅ Token guardado en sessionStorage (origen: ${currentOrigin}, windowId: ${windowId})`);
  }, [getCurrentOrigin]);

  const getAuthToken = useCallback(() => {
    const currentOrigin = getCurrentOrigin();

    let token = sessionStorage.getItem(`jwt_token_${currentOrigin}`);
    let sessionToken = sessionStorage.getItem(`session_token_${currentOrigin}`);

    if (token) {
      console.log(`✅ Token encontrado en sessionStorage (origen: ${currentOrigin})`);
      return { token, sessionToken, origin: currentOrigin };
    }

    console.log(`ℹ️ No hay sesión activa en esta ventana`);
    return { token: null, sessionToken: null, origin: currentOrigin };
  }, [getCurrentOrigin]);

  const clearAuthTokens = useCallback(() => {
    const currentOrigin = getCurrentOrigin();

    sessionStorage.removeItem(`jwt_token_${currentOrigin}`);
    sessionStorage.removeItem(`session_token_${currentOrigin}`);
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("window_session_id");
    
    console.log(`🧹 Tokens y window_id limpiados para origen: ${currentOrigin}`);
  }, [getCurrentOrigin]);

  const saveUserData = useCallback((userData) => {
    sessionStorage.setItem("user_data", JSON.stringify(userData));
    sessionStorage.setItem("user_email", userData.email);
    sessionStorage.setItem("login_timestamp", Date.now().toString());
    
    console.log(`💾 Datos de usuario guardados en sessionStorage`);
  }, []);

  const getUserData = useCallback(() => {
    const sessionUserData = sessionStorage.getItem("user_data");
    if (sessionUserData) {
      try {
        const parsed = JSON.parse(sessionUserData);
        console.log(`✅ Datos de usuario encontrados en sessionStorage:`, parsed.email);
        return parsed;
      } catch (e) {
        console.error('❌ Error parseando user_data:', e);
        sessionStorage.removeItem("user_data");
        return null;
      }
    }

    console.log(`ℹ️ No hay datos de usuario en esta ventana`);
    return null;
  }, []);

  // ============================================
  // VERIFICACIÓN DE CALIDAD DE RED
  // ============================================

  // const checkNetworkQuality = useCallback(async (baseUrl) => {
  //   const startTime = performance.now();
  //   let status = "unknown";
  //   let pingTime = 0;

  //   try {
  //     const apiBase = baseUrl || "https://api.olawee.com";
  //     const response = await fetch(`${apiBase}/wp-json`, {
  //       method: "HEAD",
  //       cache: "no-store",
  //       credentials: "omit",
  //     });

  //     pingTime = performance.now() - startTime;
  //     status = response.ok ? "available" : "error";

  //     const networkQuality =
  //       pingTime < 300
  //         ? "excellent"
  //         : pingTime < 1000
  //         ? "good"
  //         : pingTime < 3000
  //         ? "fair"
  //         : "poor";

  //     console.log(`📶 Calidad de red: ${networkQuality} (${Math.round(pingTime)}ms)`);

  //     return {
  //       status,
  //       pingTime,
  //       quality: networkQuality,
  //       httpStatus: response.status,
  //     };
  //   } catch (err) {
  //     pingTime = performance.now() - startTime;
  //     console.error(`❌ Error de conexión: ${err.message}`);

  //     return {
  //       status: "error",
  //       pingTime,
  //       quality: "unavailable",
  //       error: err.message,
  //     };
  //   }
  // }, []);

  // ============================================
  // VERIFICACIÓN SILENCIOSA DE TOKEN
  // ============================================

  const silentTokenVerification = useCallback(async (token, sessionToken) => {
    try {
      console.log("🔄 Verificando token en segundo plano...");

      const result = await validateToken(token, sessionToken);

      if (result.valid) {
        sessionStorage.setItem("token_last_verified", Date.now().toString());
        console.log("✅ Token verificado en segundo plano");
        return true;
      } else {
        console.log("⚠️ Token posiblemente expirado");
        return false;
      }
    } catch (error) {
      if (error.code === "session_invalidated") {
        console.warn("⚠️ Sesión invalidada en otro dispositivo");
        clearAuthTokens();
        sessionStorage.removeItem("user_data");
        setUser(null);
        return false;
      }

      console.warn("⚠️ Error al verificar token en segundo plano:", error.message);
      return false;
    }
  }, [clearAuthTokens]);

  // ============================================
  // 🔥 GESTIÓN DE INTENCIÓN DE CHECKOUT (NUEVO)
  // ============================================

  /**
   * Guardar intención de compra antes de login/registro
   */
  const saveCheckoutIntent = useCallback((product, additionalData = {}) => {
    const checkoutIntent = {
      product,
      timestamp: Date.now(),
      path: window.location.pathname,
      ...additionalData
    };
    
    sessionStorage.setItem('checkout_intent', JSON.stringify(checkoutIntent));
    console.log('💾 Intención de checkout guardada:', product?.name || 'Sin nombre');
  }, []);

  /**
   * Restaurar intención de compra después del login/registro
   */
  const restoreCheckoutIntent = useCallback(() => {
    try {
      const savedIntent = sessionStorage.getItem('checkout_intent');
      if (savedIntent) {
        const intent = JSON.parse(savedIntent);
        console.log('♻️ Restaurando intención de checkout:', intent);
        
        // Verificar que la intención no sea muy antigua (30 minutos)
        const thirtyMinutes = 30 * 60 * 1000;
        if (Date.now() - intent.timestamp > thirtyMinutes) {
          console.log('⏰ Intención de checkout expirada, limpiando...');
          sessionStorage.removeItem('checkout_intent');
          return null;
        }
        
        // Restaurar el producto seleccionado
        if (intent.product) {
          setSelectedProduct(intent.product);
          sessionStorage.setItem('selected_product', JSON.stringify(intent.product));
        }
        
        return intent;
      }
    } catch (e) {
      console.error('❌ Error al restaurar intención de checkout:', e);
      sessionStorage.removeItem('checkout_intent');
    }
    return null;
  }, []);

  /**
   * Limpiar intención de checkout
   */
  const clearCheckoutIntent = useCallback(() => {
    sessionStorage.removeItem('checkout_intent');
    console.log('🧹 Intención de checkout limpiada');
  }, []);

  // ============================================
  // 🔥 INICIALIZACIÓN - MEJORADO
  // ============================================

  useEffect(() => {
    // 🔥 Evitar ejecuciones múltiples
    if (isInitialized) {
      console.log('ℹ️ Ya inicializado, saltando...');
      return;
    }

    const initAuth = async () => {
      console.log('🚀 ========== INICIANDO AUTENTICACIÓN ==========');
      console.log('🔍 Estado inicial - loading:', loading, 'user:', user?.email);

      try {
        // 1. Generar window_id
        const windowId = generateWindowId();
        console.log('🪟 Window ID:', windowId);
        
        // 2. Obtener token desde sessionStorage
        const { token, sessionToken } = getAuthToken();
        console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');

        // 3. Si no hay token, terminar inicialización
        if (!token) {
          console.log('ℹ️ No hay token, inicialización completa (sin usuario)');
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        // 4. Obtener datos del usuario desde sessionStorage
        const storedUser = getUserData();
        console.log('👤 Usuario guardado:', storedUser ? storedUser.email : 'NO');

        // 5. Si hay token pero no hay datos de usuario, limpiar
        if (!storedUser) {
          console.warn('⚠️ Token existe pero no hay datos de usuario, limpiando...');
          clearAuthTokens();
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        // 6. Establecer usuario desde sessionStorage
        console.log('✅ Restaurando sesión desde sessionStorage');
        setUser(storedUser);

        // 7. Verificar token en segundo plano (no bloquea UI)
        silentTokenVerification(token, sessionToken).then((isValid) => {
          if (!isValid) {
            console.warn('⚠️ Token expirado detectado en verificación silenciosa');
          }
        });

      } catch (err) {
        console.error('❌ Error en inicialización:', err);
        clearAuthTokens();
        sessionStorage.removeItem("user_data");
      } finally {
        setIsInitialized(true);
        setLoading(false);
        console.log('✅ Inicialización completa');
      }
    };

    initAuth();
  }, [
    isInitialized,
    loading,
    user?.email,
    generateWindowId,
    getAuthToken,
    getUserData,
    clearAuthTokens,
    silentTokenVerification
  ]);

  // ============================================
  // LOGIN
  // ============================================

  const login = useCallback(async (email, password, origin = 'web') => {
    try {
      const windowId = generateWindowId();
      const result = await loginUser(email, password, origin, windowId);

      if (result && result.conflict) {
        return result;
      }

      if (result.token && result.user) {
        saveAuthToken(result.token, result.sessionToken, origin, windowId);
        saveUserData(result.user);
        setUser(result.user);

        console.log(`✅ Login exitoso: ${result.user.email}`);

        // 🔥 NUEVO: Restaurar intención de checkout si existe
        const checkoutIntent = restoreCheckoutIntent();
        if (checkoutIntent) {
          console.log('✅ Intención de checkout restaurada tras login');
        }

        return result;
      } else {
        throw new AuthError(
          "No se recibieron credenciales válidas",
          "invalid_response"
        );
      }
    } catch (err) {
      console.error("❌ Error en login:", err);

      if (err.code === "invalid_username" || err.code === "invalid_email") {
        throw new AuthError("El email proporcionado no es válido", "invalid_email");
      } else if (err.code === "incorrect_password") {
        throw new AuthError("La contraseña es incorrecta", "invalid_credentials");
      } else if (err.code === "network_error") {
        throw new AuthError(
          "Error de conexión. Por favor, verifica tu conexión a internet",
          "network_error"
        );
      }

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el inicio de sesión",
        "unknown_error"
      );
    }
  }, [generateWindowId, saveAuthToken, saveUserData, restoreCheckoutIntent]);

  // ============================================
  // FORCE LOGIN
  // ============================================

  const forceLogin = useCallback(async (email, password, origin = 'web') => {
    try {
      const windowId = generateWindowId();
      const result = await forceLoginUser(email, password, origin, windowId);

      if (result.token && result.user) {
        saveAuthToken(result.token, result.sessionToken, origin, windowId);
        saveUserData(result.user);
        setUser(result.user);

        console.log(`✅ Force login exitoso: ${result.user.email}`);

        // 🔥 NUEVO: Restaurar intención de checkout si existe
        const checkoutIntent = restoreCheckoutIntent();
        if (checkoutIntent) {
          console.log('✅ Intención de checkout restaurada tras force login');
        }

        return result;
      } else {
        throw new AuthError(
          "No se recibieron credenciales válidas",
          "invalid_response"
        );
      }
    } catch (err) {
      console.error("❌ Error en force login:", err);

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el inicio de sesión forzado",
        "unknown_error"
      );
    }
  }, [generateWindowId, saveAuthToken, saveUserData, restoreCheckoutIntent]);

  // ============================================
  // REGISTER
  // ============================================

  const register = useCallback(async (email, password, firstName, lastName, origin = 'web') => {
    try {
      const windowId = generateWindowId();
      const result = await registerUser(email, password, firstName, lastName, origin, windowId);

      if (result.token && result.user) {
        saveAuthToken(result.token, result.sessionToken, origin, windowId);
        saveUserData(result.user);
        setUser(result.user);

        console.log(`✅ Registro exitoso: ${result.user.email}`);

        // 🔥 NUEVO: Restaurar intención de checkout si existe
        const checkoutIntent = restoreCheckoutIntent();
        if (checkoutIntent) {
          console.log('✅ Intención de checkout restaurada tras registro');
        }

        return result;
      } else {
        throw new AuthError(
          "No se recibieron credenciales válidas",
          "invalid_response"
        );
      }
    } catch (err) {
      console.error("❌ Error en registro:", err);

      if (err.code === "existing_user_login" || err.code === "user_already_exists") {
        throw new AuthError(
          "Este email ya está registrado. Por favor, inicia sesión",
          "user_already_exists"
        );
      } else if (err.code === "invalid_email") {
        throw new AuthError("El email proporcionado no es válido", "invalid_email");
      } else if (err.code === "weak_password") {
        throw new AuthError(
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres",
          "weak_password"
        );
      } else if (err.code === "network_error") {
        throw new AuthError(
          "Error de conexión. Por favor, verifica tu conexión a internet",
          "network_error"
        );
      }

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el registro",
        "unknown_error"
      );
    }
  }, [generateWindowId, saveAuthToken, saveUserData, restoreCheckoutIntent]);

  // ============================================
  // LOGOUT
  // ============================================

  const logout = useCallback(async () => {
    try {
      const { token } = getAuthToken();
  
      if (token) {
        await logoutUser(token);
      }
  
      clearAuthTokens();
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("user_email");
      sessionStorage.removeItem("login_timestamp");
      sessionStorage.removeItem("token_last_verified");
      
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_email");
      localStorage.removeItem("login_timestamp");
      localStorage.removeItem("token_last_verified");
      localStorage.removeItem("user_data_timestamp");
      localStorage.removeItem("site_config_timestamp");
      localStorage.removeItem("user_preferences_timestamp");
  
      setUser(null);
  
      console.log("✅ Logout exitoso");
  
      // 🔥 NUEVO: Redirección automática desde páginas sensibles
      const currentPath = window.location.pathname;
      const sensitiveRoutes = ['/checkout', '/order-confirmation', '/my-account'];
      
      const isInSensitiveRoute = sensitiveRoutes.some(route => 
        currentPath.includes(route)
      );
      
      if (isInSensitiveRoute) {
        console.log("🔄 Redirigiendo desde página protegida a home");
        navigate('/');
      }
  
    } catch (err) {
      console.error("⚠️ Error en logout, limpiando localmente:", err.message);
  
      clearAuthTokens();
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("user_email");
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_email");
  
      setUser(null);
  
      // 🔥 NUEVO: Redirección también en caso de error
      const currentPath = window.location.pathname;
      const sensitiveRoutes = ['/checkout', '/order-confirmation', '/my-account'];
      
      const isInSensitiveRoute = sensitiveRoutes.some(route => 
        currentPath.includes(route)
      );
      
      if (isInSensitiveRoute) {
        console.log("🔄 Redirigiendo desde página protegida a home (tras error)");
        navigate('/');
      }
    }
  }, [getAuthToken, clearAuthTokens, navigate]);

  // ============================================
  // PASSWORD RESET
  // ============================================

  const requestPasswordReset = useCallback(async (email, origin = "web") => {
    try {
      return await requestPasswordResetService(email, origin);
    } catch (err) {
      console.error("❌ Error solicitando reset:", err);
      throw new AuthError(
        err.message || "Error al solicitar reseteo de contraseña",
        err.code || "unknown_error"
      );
    }
  }, []);

  const verifyResetToken = useCallback(async (token, email) => {
    try {
      return await verifyResetTokenService(token, email);
    } catch (err) {
      console.error("❌ Error verificando token:", err);
      throw new AuthError(
        err.message || "Token inválido o expirado",
        err.code || "unknown_error"
      );
    }
  }, []);

  const resetPassword = useCallback(async (token, email, newPassword) => {
    try {
      return await resetPasswordService(token, email, newPassword);
    } catch (err) {
      console.error("❌ Error reseteando contraseña:", err);
      throw new AuthError(
        err.message || "Error al resetear contraseña",
        err.code || "unknown_error"
      );
    }
  }, []);

  // ============================================
  // VALIDACIÓN DE AUTENTICACIÓN
  // ============================================

  const isAuthenticated = useCallback(() => {
    if (!user) return false;

    const { token } = getAuthToken();
    if (!token) return false;

    try {
      const payload = token.split(".")[1];
      const { exp } = JSON.parse(atob(payload));
      return !exp || new Date(exp * 1000) > new Date();
    } catch {
      return false;
    }
  }, [user, getAuthToken]);

  // ============================================
  // REVALIDAR TOKEN
  // ============================================

  const revalidate = useCallback(async () => {
    try {
      const { token, sessionToken } = getAuthToken();

      if (!token) {
        setUser(null);
        return false;
      }

      const result = await validateToken(token, sessionToken);

      if (result.valid && result.user) {
        const updatedUser = {
          ...user,
          ...result.user,
        };
        setUser(updatedUser);
        saveUserData(updatedUser);
        return true;
      } else {
        clearAuthTokens();
        sessionStorage.removeItem("user_data");
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error("❌ Error revalidando token:", err);

      if (err.code === "session_invalidated") {
        clearAuthTokens();
        sessionStorage.removeItem("user_data");
        setUser(null);
      }

      return false;
    }
  }, [user, getAuthToken, clearAuthTokens, saveUserData]);

  // ============================================
  // ACTUALIZAR USUARIO
  // ============================================

  const updateUser = useCallback((userData) => {
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    setUser(updatedUser);
    saveUserData(updatedUser);
  }, [user, saveUserData]);

  // ============================================
  // GESTIÓN DE PRODUCTO PARA CHECKOUT
  // ============================================

  const selectProductForCheckout = useCallback((product) => {
    if (!product || !product.id) {
      console.warn('⚠️ Producto inválido:', product);
      return;
    }

    setSelectedProduct(product);
    sessionStorage.setItem('selected_product', JSON.stringify(product));
    console.log('✅ Producto seleccionado para checkout:', product.name);
  }, []);

  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null);
    sessionStorage.removeItem('selected_product');
    console.log('🧹 Producto seleccionado limpiado');
  }, []);

  const restoreSelectedProduct = useCallback(() => {
    try {
      const savedProduct = sessionStorage.getItem('selected_product');
      if (savedProduct) {
        const product = JSON.parse(savedProduct);
        setSelectedProduct(product);
        console.log('♻️ Producto restaurado:', product.name);
        return product;
      }
    } catch (e) {
      console.error('❌ Error al restaurar producto:', e);
      sessionStorage.removeItem('selected_product');
    }
    return null;
  }, []);

  useEffect(() => {
    restoreSelectedProduct();
  }, [restoreSelectedProduct]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        forceLogin,
        register,
        logout,
        loading,
        isAuthenticated,
        revalidate,
        updateUser,
        requestPasswordReset,
        verifyResetToken,
        resetPassword,
        selectedProduct,
        selectProductForCheckout,
        clearSelectedProduct,
        getToken: getAuthToken,
        // 🔥 NUEVAS FUNCIONES PARA CHECKOUT
        saveCheckoutIntent,
        restoreCheckoutIntent,
        clearCheckoutIntent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);