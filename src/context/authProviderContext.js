
// // src/context/authProviderContext.js
// import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
//   const [loading, setLoading] = useState(true);

//   // ============================================
//   // FUNCIONES DE PERSISTENCIA DE TOKEN (MEMOIZADAS)
//   // ============================================

//   // ✅ getCurrentOrigin - Memoizado
//   const getCurrentOrigin = useCallback(() => {
//     const hostname = window.location.hostname;
    
//     let detectedOrigin = 'web'; // default
    
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

//   // ✅ saveAuthToken - Memoizado
//   const saveAuthToken = useCallback((token, sessionToken, origin, remember = true) => {
//     const currentOrigin = origin || getCurrentOrigin();

//     // Siempre guardamos en sessionStorage (para la sesión actual)
//     sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
    
//     if (sessionToken) {
//       sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
//     }

//     // Opcionalmente guardamos en localStorage si el usuario marca "recordar"
//     if (remember) {
//       try {
//         const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

//         const tokenData = {
//           token: token,
//           sessionToken: sessionToken,
//           origin: currentOrigin,
//           expires: expiry,
//         };

//         localStorage.setItem(`auth_token_${currentOrigin}`, JSON.stringify(tokenData));
//         localStorage.setItem("token_saved_at", Date.now().toString());

//         console.log(`🔒 Token guardado para origen: ${currentOrigin}`);
//       } catch (error) {
//         console.warn("⚠️ No se pudo guardar el token con persistencia:", error.message);
//       }
//     }
//   }, [getCurrentOrigin]);

//   // ✅ getAuthToken - Memoizado
//   const getAuthToken = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     let token = sessionStorage.getItem(`jwt_token_${currentOrigin}`);
//     let sessionToken = sessionStorage.getItem(`session_token_${currentOrigin}`);

//     // Si no hay token en sessionStorage, intentamos recuperar de localStorage
//     if (!token) {
//       try {
//         const savedTokenData = localStorage.getItem(`auth_token_${currentOrigin}`);

//         if (savedTokenData) {
//           const tokenData = JSON.parse(savedTokenData);

//           // Verificar que el token no haya expirado
//           if (tokenData.expires > Date.now()) {
//             token = tokenData.token;
//             sessionToken = tokenData.sessionToken;

//             // Restaurar en sessionStorage también
//             sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
//             if (sessionToken) {
//               sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
//             }

//             console.log(`🔓 Token recuperado para origen: ${currentOrigin}`);
//           } else {
//             console.log("⚠️ Token persistente expirado, eliminando");
//             localStorage.removeItem(`auth_token_${currentOrigin}`);
//           }
//         }
//       } catch (error) {
//         console.warn("⚠️ Error al recuperar token persistente:", error.message);
//       }
//     }

//     return { token, sessionToken, origin: currentOrigin };
//   }, [getCurrentOrigin]);

//   // ✅ clearAuthTokens - Memoizado
//   const clearAuthTokens = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     sessionStorage.removeItem(`jwt_token_${currentOrigin}`);
//     sessionStorage.removeItem(`session_token_${currentOrigin}`);
//     localStorage.removeItem(`auth_token_${currentOrigin}`);
//     localStorage.removeItem("token_saved_at");

//     console.log(`🧹 Tokens limpiados para origen: ${currentOrigin}`);
//   }, [getCurrentOrigin]);

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
//         localStorage.setItem("token_last_verified", Date.now().toString());
//         console.log("✅ Token verificado en segundo plano");
//         return true;
//       } else {
//         console.log("⚠️ Token posiblemente expirado");
//         return false;
//       }
//     } catch (error) {
//       // Si la sesión fue invalidada, limpiar tokens
//       if (error.code === "session_invalidated") {
//         console.warn("⚠️ Sesión invalidada en otro dispositivo");
//         clearAuthTokens();
//         localStorage.removeItem("user_data");
//         setUser(null);
//         return false;
//       }

//       console.warn("⚠️ Error al verificar token en segundo plano:", error.message);
//       return false;
//     }
//   }, [clearAuthTokens]);

//   // ============================================
//   // INICIALIZACIÓN
//   // ============================================

//   useEffect(() => {
//     const initAuth = async () => {
//       const storedUser = localStorage.getItem("user_data");

//       // Usar la función memoizada para recuperar el token
//       const { token, sessionToken } = getAuthToken();

//       if (storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//           setLoading(false);

//           // Si tenemos token, verificar en segundo plano
//           if (token) {
//             setTimeout(() => {
//               silentTokenVerification(token, sessionToken).catch(() => {
//                 console.warn("⚠️ Verificación de token silenciosa falló");
//               });
//             }, 1000);
//           }
//           return;
//         } catch (error) {
//           console.error("❌ Error al procesar datos del usuario:", error);
//         }
//       }

//       setLoading(false);
//     };

//     initAuth();
//   }, [getAuthToken, silentTokenVerification]);

//   // ============================================
//   // LOGIN (ACTUALIZADO CON CONFLICTOS Y SESSION_TOKEN)
//   // ============================================

//   const login = useCallback(async (emailOrUsername, password, rememberMe = true) => {
//     try {
//       // Validación de campos
//       const cleanEmailOrUsername = emailOrUsername?.toString().trim();
//       const cleanPassword = password?.toString().trim();

//       if (!cleanEmailOrUsername || !cleanPassword) {
//         throw new AuthError(
//           "El correo electrónico/usuario y la contraseña son obligatorios",
//           "missing_fields"
//         );
//       }

//       console.log("Intentando iniciar sesión con:", { username: cleanEmailOrUsername });

//       // 1. VERIFICAR CACHÉ AGRESIVA
//       const cachedUserData = localStorage.getItem("user_data");
//       const cachedUserEmail = localStorage.getItem("user_email");
//       const cachedTimestamp = localStorage.getItem("login_timestamp");
//       const { token: cachedToken, sessionToken: cachedSessionToken } = getAuthToken();
//       const now = Date.now();

//       const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

//       if (
//         cachedUserData &&
//         cachedUserEmail === cleanEmailOrUsername &&
//         cachedTimestamp &&
//         cachedToken
//       ) {
//         // Si la caché es reciente (menos de 2 horas), usarla sin verificación
//         if (now - parseInt(cachedTimestamp) < 2 * 60 * 60 * 1000) {
//           try {
//             const userData = JSON.parse(cachedUserData);
//             console.log("✅ Login exitoso (desde caché reciente)");
//             setUser(userData);

//             // Verificar token en segundo plano
//             setTimeout(() => {
//               silentTokenVerification(cachedToken, cachedSessionToken).catch(() => {});
//             }, 1000);

//             return userData;
//           } catch (cacheError) {
//             console.warn("⚠️ Error al usar caché reciente:", cacheError.message);
//           }
//         }

//         // Si la caché es válida pero no tan reciente
//         if (now - parseInt(cachedTimestamp) < CACHE_MAX_AGE) {
//           const networkStatus = await checkNetworkQuality();

//           // Si la red es lenta, usar caché
//           if (
//             networkStatus.quality === "poor" ||
//             networkStatus.quality === "unavailable"
//           ) {
//             try {
//               const userData = JSON.parse(cachedUserData);
//               console.log("⚠️ Red lenta o no disponible. Usando datos en caché.");
//               setUser(userData);
//               return userData;
//             } catch (emergencyCacheError) {
//               console.warn(
//                 "⚠️ Error al usar caché de emergencia:",
//                 emergencyCacheError.message
//               );
//             }
//           }
//         }
//       }

//       // 2. DIAGNÓSTICO DE RED
//       const networkCheck = await checkNetworkQuality();
//       console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);

//       // 3. INTENTAR LOGIN
//       console.time("⏱ LOGIN API");

//       const result = await loginUser(cleanEmailOrUsername, cleanPassword);

//       console.timeEnd("⏱ LOGIN API");

//       // ⚠️ VERIFICAR SI HAY CONFLICTO DE SESIÓN
//       if (result.conflict) {
//         console.warn("⚠️ Conflicto de sesión detectado");
//         return {
//           conflict: true,
//           message: result.message,
//           origin: result.origin,
//           user: result.user,
//         };
//       }

//       // Login exitoso
//       const { token, sessionToken, origin, user: profileData } = result;

//       // Guardar tokens (incluyendo session_token y origin)
//       saveAuthToken(token, sessionToken, origin, rememberMe);

//       // Construir objeto de usuario
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

//       // Guardar datos con timestamp
//       localStorage.setItem("user_email", fullUser.email);
//       localStorage.setItem("user_data", JSON.stringify(fullUser));
//       localStorage.setItem("login_timestamp", now.toString());
//       localStorage.setItem("token_last_verified", now.toString());

//       setUser(fullUser);

//       console.log("✅ Login exitoso:", fullUser);

//       return fullUser;
//     } catch (err) {
//       console.error("❌ Error durante el login:", err);

//       // Si el error es de timeout o red, intentar usar caché
//       if (
//         err.message === "Timeout" ||
//         err.name === "AbortError" ||
//         err.code === "ECONNABORTED" ||
//         err.message.includes("timeout") ||
//         err.message === "canceled" ||
//         err.code === "ERR_CANCELED" ||
//         err.message.includes("network")
//       ) {
//         const cachedUserData = localStorage.getItem("user_data");
//         const cachedUserEmail = localStorage.getItem("user_email");
//         const cachedTimestamp = localStorage.getItem("login_timestamp");
//         const now = Date.now();
//         const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

//         if (
//           cachedUserData &&
//           cachedUserEmail === emailOrUsername?.toString().trim() &&
//           cachedTimestamp &&
//           now - parseInt(cachedTimestamp) < CACHE_MAX_AGE
//         ) {
//           try {
//             console.log("⚠️ Usando caché como fallback después de error de red");
//             const userData = JSON.parse(cachedUserData);

//             setUser({
//               ...userData,
//               _offlineMode: true,
//             });

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

//       // Manejo de errores de autenticación
//       if (err.code) {
//         throw new AuthError(err.message, err.code);
//       }

//       throw new AuthError(
//         err.message || "Ha ocurrido un error durante el inicio de sesión",
//         "unknown_error"
//       );
//     }
//   }, [getAuthToken, saveAuthToken, checkNetworkQuality, silentTokenVerification]);

//   // ============================================
//   // FORCE LOGIN (NUEVO)
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

//       const result = await forceLoginUser(cleanEmailOrUsername, cleanPassword);

//       const { token, sessionToken, origin, user: profileData } = result;

//       // Guardar tokens
//       saveAuthToken(token, sessionToken, origin, rememberMe);

//       // Construir objeto de usuario
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

//       // Guardar datos
//       const now = Date.now();
//       localStorage.setItem("user_email", fullUser.email);
//       localStorage.setItem("user_data", JSON.stringify(fullUser));
//       localStorage.setItem("login_timestamp", now.toString());
//       localStorage.setItem("token_last_verified", now.toString());

//       setUser(fullUser);

//       console.log("✅ Force login exitoso:", fullUser);

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
//   }, [saveAuthToken]);

//   // ============================================
//   // REGISTER (ACTUALIZADO CON SESSION_TOKEN)
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

//       // Guardar tokens
//       saveAuthToken(token, sessionToken, origin, true);

//       // Construir objeto de usuario
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

//       // Guardar datos
//       const now = Date.now();
//       localStorage.setItem("user_email", fullUser.email);
//       localStorage.setItem("user_data", JSON.stringify(fullUser));
//       localStorage.setItem("login_timestamp", now.toString());
//       localStorage.setItem("token_last_verified", now.toString());

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
//   }, [saveAuthToken]);

//   // ============================================
//   // LOGOUT (ACTUALIZADO)
//   // ============================================

//   const logout = useCallback(async () => {
//     try {
//       const { token } = getAuthToken();

//       // Llamar al endpoint de logout
//       if (token) {
//         await logoutUser(token);
//       }

//       // Limpiar tokens y datos
//       clearAuthTokens();
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");
//       localStorage.removeItem("login_timestamp");
//       localStorage.removeItem("token_last_verified");
//       localStorage.removeItem("user_data_timestamp");
//       localStorage.removeItem("site_config_timestamp");
//       localStorage.removeItem("user_preferences_timestamp");

//       setUser(null);

//       console.log("✅ Logout exitoso");
//     } catch (err) {
//       // Aunque falle, limpiar localmente
//       console.error("⚠️ Error en logout, limpiando localmente:", err.message);

//       clearAuthTokens();
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");
//       localStorage.removeItem("login_timestamp");
//       localStorage.removeItem("token_last_verified");

//       setUser(null);
//     }
//   }, [getAuthToken, clearAuthTokens]);

//   // ============================================
//   // PASSWORD RESET (NUEVO)
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
//         setUser((prevUser) => ({
//           ...prevUser,
//           ...result.user,
//         }));
//         return true;
//       } else {
//         clearAuthTokens();
//         localStorage.removeItem("user_data");
//         setUser(null);
//         return false;
//       }
//     } catch (err) {
//       console.error("❌ Error revalidando token:", err);

//       if (err.code === "session_invalidated") {
//         clearAuthTokens();
//         localStorage.removeItem("user_data");
//         setUser(null);
//       }

//       return false;
//     }
//   }, [getAuthToken, clearAuthTokens]);

//   // ============================================
//   // ACTUALIZAR USUARIO
//   // ============================================

//   const updateUser = useCallback((userData) => {
//     setUser((prevUser) => ({
//       ...prevUser,
//       ...userData,
//     }));

//     const updatedUser = {
//       ...user,
//       ...userData,
//     };
//     localStorage.setItem("user_data", JSON.stringify(updatedUser));
//   }, [user]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         forceLogin,
//         register,
//         logout,
//         loading,
//         isAuthenticated,
//         revalidate,
//         updateUser,
//         requestPasswordReset,
//         verifyResetToken,
//         resetPassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);








// // src/context/authProviderContext.js
// import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
//   const [loading, setLoading] = useState(true);

//   // ============================================
//   // FUNCIONES DE PERSISTENCIA DE TOKEN (MEMOIZADAS)
//   // ============================================

//   // ✅ getCurrentOrigin - Memoizado
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

//   // ✅ saveAuthToken - MODIFICADO para priorizar sessionStorage
//   const saveAuthToken = useCallback((token, sessionToken, origin, remember = true) => {
//     const currentOrigin = origin || getCurrentOrigin();

//     // 🔑 SIEMPRE guardamos en sessionStorage (única por pestaña)
//     sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
//     sessionStorage.setItem(`user_data`, JSON.stringify({
//       token,
//       sessionToken,
//       origin: currentOrigin,
//       timestamp: Date.now()
//     }));
    
//     if (sessionToken) {
//       sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
//     }

//     // 🔒 Solo guardamos en localStorage si "recordar" está activo
//     // localStorage SOLO se usa para recuperar sesión al abrir nueva ventana del navegador
//     if (remember) {
//       try {
//         const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

//         const tokenData = {
//           token: token,
//           sessionToken: sessionToken,
//           origin: currentOrigin,
//           expires: expiry,
//         };

//         localStorage.setItem(`auth_token_${currentOrigin}`, JSON.stringify(tokenData));
//         localStorage.setItem("token_saved_at", Date.now().toString());

//         console.log(`🔒 Token guardado en localStorage para "recordar" (origen: ${currentOrigin})`);
//       } catch (error) {
//         console.warn("⚠️ No se pudo guardar el token con persistencia:", error.message);
//       }
//     } else {
//       // Si no se marca "recordar", limpiamos localStorage
//       localStorage.removeItem(`auth_token_${currentOrigin}`);
//     }
//   }, [getCurrentOrigin]);

//   // ✅ getAuthToken - MODIFICADO para priorizar sessionStorage
//   const getAuthToken = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     // 🎯 PRIMERO: Intentar obtener de sessionStorage (única por pestaña)
//     let token = sessionStorage.getItem(`jwt_token_${currentOrigin}`);
//     let sessionToken = sessionStorage.getItem(`session_token_${currentOrigin}`);

//     if (token) {
//       console.log(`✅ Token encontrado en sessionStorage (origen: ${currentOrigin})`);
//       return { token, sessionToken, origin: currentOrigin };
//     }

//     // 🔓 SEGUNDO: Si no hay en sessionStorage, intentar recuperar de localStorage
//     // (solo al iniciar nueva pestaña)
//     try {
//       const savedTokenData = localStorage.getItem(`auth_token_${currentOrigin}`);

//       if (savedTokenData) {
//         const tokenData = JSON.parse(savedTokenData);

//         // Verificar que el token no haya expirado
//         if (tokenData.expires > Date.now()) {
//           token = tokenData.token;
//           sessionToken = tokenData.sessionToken;

//           // ⚠️ IMPORTANTE: Restaurar SOLO en sessionStorage de esta pestaña
//           sessionStorage.setItem(`jwt_token_${currentOrigin}`, token);
//           if (sessionToken) {
//             sessionStorage.setItem(`session_token_${currentOrigin}`, sessionToken);
//           }

//           console.log(`🔓 Token recuperado de localStorage → copiado a sessionStorage (origen: ${currentOrigin})`);
//         } else {
//           console.log("⚠️ Token persistente expirado, eliminando");
//           localStorage.removeItem(`auth_token_${currentOrigin}`);
//         }
//       }
//     } catch (error) {
//       console.warn("⚠️ Error al recuperar token persistente:", error.message);
//     }

//     return { token, sessionToken, origin: currentOrigin };
//   }, [getCurrentOrigin]);

//   // ✅ clearAuthTokens - MODIFICADO
//   const clearAuthTokens = useCallback(() => {
//     const currentOrigin = getCurrentOrigin();

//     // Limpiar sessionStorage de ESTA pestaña
//     sessionStorage.removeItem(`jwt_token_${currentOrigin}`);
//     sessionStorage.removeItem(`session_token_${currentOrigin}`);
//     sessionStorage.removeItem("user_data");
    
//     // Limpiar localStorage (afecta todas las pestañas)
//     localStorage.removeItem(`auth_token_${currentOrigin}`);
//     localStorage.removeItem("token_saved_at");

//     console.log(`🧹 Tokens limpiados para origen: ${currentOrigin}`);
//   }, [getCurrentOrigin]);

//   // ✅ saveUserData - NUEVO: Guarda datos del usuario
//   const saveUserData = useCallback((userData) => {
//     // Guardar en sessionStorage (único por pestaña)
//     sessionStorage.setItem("user_data", JSON.stringify(userData));
//     sessionStorage.setItem("user_email", userData.email);
//     sessionStorage.setItem("login_timestamp", Date.now().toString());
    
//     console.log(`💾 Datos de usuario guardados en sessionStorage`);
//   }, []);

//   // ✅ getUserData - NUEVO: Obtiene datos del usuario
//   const getUserData = useCallback(() => {
//     // Primero intentar sessionStorage
//     const sessionUserData = sessionStorage.getItem("user_data");
//     if (sessionUserData) {
//       console.log(`✅ Datos de usuario encontrados en sessionStorage`);
//       return JSON.parse(sessionUserData);
//     }

//     // Si no hay en sessionStorage, intentar localStorage (solo al iniciar)
//     const localUserData = localStorage.getItem("user_data");
//     if (localUserData) {
//       const userData = JSON.parse(localUserData);
//       // Copiar a sessionStorage
//       saveUserData(userData);
//       console.log(`🔓 Datos de usuario recuperados de localStorage → copiados a sessionStorage`);
//       return userData;
//     }

//     return null;
//   }, [saveUserData]);

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
//   // INICIALIZACIÓN - MODIFICADO
//   // ============================================

//   useEffect(() => {
//     const initAuth = async () => {
//       // 🎯 Obtener datos del usuario desde sessionStorage primero
//       const storedUser = getUserData();
//       const { token, sessionToken } = getAuthToken();

//       if (storedUser && token) {
//         try {
//           setUser(storedUser);
//           setLoading(false);

//           // Verificar en segundo plano
//           setTimeout(() => {
//             silentTokenVerification(token, sessionToken).catch(() => {
//               console.warn("⚠️ Verificación de token silenciosa falló");
//             });
//           }, 1000);
//           return;
//         } catch (error) {
//           console.error("❌ Error al procesar datos del usuario:", error);
//         }
//       }

//       setLoading(false);
//     };

//     initAuth();
//   }, [getAuthToken, getUserData, silentTokenVerification]);

//   // ============================================
//   // LOGIN - MODIFICADO
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

//       // Verificar caché de ESTA pestaña (sessionStorage)
//       const cachedUserData = sessionStorage.getItem("user_data");
//       const cachedUserEmail = sessionStorage.getItem("user_email");
//       const cachedTimestamp = sessionStorage.getItem("login_timestamp");
//       const { token: cachedToken, sessionToken: cachedSessionToken } = getAuthToken();
//       const now = Date.now();

//       // Si hay caché reciente en esta pestaña
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

//       // Diagnóstico de red
//       const networkCheck = await checkNetworkQuality();
//       console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);

//       // Intentar login
//       console.time("⏱ LOGIN API");
//       const result = await loginUser(cleanEmailOrUsername, cleanPassword);
//       console.timeEnd("⏱ LOGIN API");

//       // Verificar conflicto de sesión
//       if (result.conflict) {
//         console.warn("⚠️ Conflicto de sesión detectado");
//         return {
//           conflict: true,
//           message: result.message,
//           origin: result.origin,
//           user: result.user,
//         };
//       }

//       // Login exitoso
//       const { token, sessionToken, origin, user: profileData } = result;

//       // Guardar tokens
//       saveAuthToken(token, sessionToken, origin, rememberMe);

//       // Construir objeto de usuario
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

//       // 💾 Guardar datos del usuario en sessionStorage
//       saveUserData(fullUser);
      
//       // Si "recordar", también guardar en localStorage
//       if (rememberMe) {
//         localStorage.setItem("user_data", JSON.stringify(fullUser));
//         localStorage.setItem("user_email", fullUser.email);
//         localStorage.setItem("login_timestamp", now.toString());
//       }

//       sessionStorage.setItem("token_last_verified", now.toString());
//       setUser(fullUser);

//       console.log("✅ Login exitoso:", fullUser);

//       return fullUser;
//     } catch (err) {
//       console.error("❌ Error durante el login:", err);

//       // Fallback a caché en caso de error de red
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
//   }, [getAuthToken, saveAuthToken, saveUserData, checkNetworkQuality, silentTokenVerification]);

//   // ============================================
//   // FORCE LOGIN - MODIFICADO
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

//       const result = await forceLoginUser(cleanEmailOrUsername, cleanPassword);
//       const { token, sessionToken, origin, user: profileData } = result;

//       saveAuthToken(token, sessionToken, origin, rememberMe);

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
      
//       if (rememberMe) {
//         localStorage.setItem("user_data", JSON.stringify(fullUser));
//         localStorage.setItem("user_email", fullUser.email);
//         localStorage.setItem("login_timestamp", now.toString());
//       }

//       sessionStorage.setItem("token_last_verified", now.toString());
//       setUser(fullUser);

//       console.log("✅ Force login exitoso:", fullUser);

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
//   }, [saveAuthToken, saveUserData]);

//   // ============================================
//   // REGISTER - MODIFICADO
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

//       saveAuthToken(token, sessionToken, origin, true);

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
//       localStorage.setItem("user_data", JSON.stringify(fullUser));
//       localStorage.setItem("user_email", fullUser.email);
//       localStorage.setItem("login_timestamp", now.toString());
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
//   }, [saveAuthToken, saveUserData]);

//   // ============================================
//   // LOGOUT - MODIFICADO
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
      
//       // Solo limpiar localStorage si fue usado
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");
//       localStorage.removeItem("login_timestamp");
//       localStorage.removeItem("token_last_verified");
//       localStorage.removeItem("user_data_timestamp");
//       localStorage.removeItem("site_config_timestamp");
//       localStorage.removeItem("user_preferences_timestamp");

//       setUser(null);

//       console.log("✅ Logout exitoso");
//     } catch (err) {
//       console.error("⚠️ Error en logout, limpiando localmente:", err.message);

//       clearAuthTokens();
//       sessionStorage.removeItem("user_data");
//       sessionStorage.removeItem("user_email");
//       localStorage.removeItem("user_data");
//       localStorage.removeItem("user_email");

//       setUser(null);
//     }
//   }, [getAuthToken, clearAuthTokens]);

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
    
//     // También actualizar en localStorage si se está usando
//     if (localStorage.getItem("user_data")) {
//       localStorage.setItem("user_data", JSON.stringify(updatedUser));
//     }
//   }, [user, saveUserData]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         forceLogin,
//         register,
//         logout,
//         loading,
//         isAuthenticated,
//         revalidate,
//         updateUser,
//         requestPasswordReset,
//         verifyResetToken,
//         resetPassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);











// src/context/authProviderContext.js
import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  // ============================================
  // FUNCIONES DE PERSISTENCIA DE TOKEN (MEMOIZADAS)
  // ============================================

  // ✅ getCurrentOrigin - Memoizado
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

  // ✅ generateWindowId - NUEVO: ID único por ventana/pestaña
  const generateWindowId = useCallback(() => {
    let windowId = sessionStorage.getItem('window_session_id');
    if (!windowId) {
      windowId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('window_session_id', windowId);
      console.log(`🪟 Nueva ventana/pestaña ID: ${windowId}`);
    }
    return windowId;
  }, []);

  // ✅ saveAuthToken - MODIFICADO para priorizar sessionStorage + window_id
  const saveAuthToken = useCallback((token, sessionToken, origin, windowId, remember = true) => {
    const currentOrigin = origin || getCurrentOrigin();

    // 🔑 SIEMPRE guardamos en sessionStorage (única por pestaña)
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

    // ⚠️ CAMBIO IMPORTANTE: Ya NO guardamos en localStorage automáticamente
    // Para evitar que múltiples ventanas compartan la sesión
    if (remember) {
      console.log(`ℹ️ "Recordar sesión" habilitado, pero NO se guarda en localStorage para evitar múltiples ventanas`);
    }
  }, [getCurrentOrigin]);

  // ✅ getAuthToken - MODIFICADO para NO recuperar de localStorage
  const getAuthToken = useCallback(() => {
    const currentOrigin = getCurrentOrigin();

    // 🎯 SOLO lee de sessionStorage (única por pestaña)
    let token = sessionStorage.getItem(`jwt_token_${currentOrigin}`);
    let sessionToken = sessionStorage.getItem(`session_token_${currentOrigin}`);

    if (token) {
      console.log(`✅ Token encontrado en sessionStorage (origen: ${currentOrigin})`);
      return { token, sessionToken, origin: currentOrigin };
    }

    // ⚠️ YA NO recuperamos de localStorage para evitar múltiples ventanas
    console.log(`ℹ️ No hay sesión activa en esta ventana`);
    return { token: null, sessionToken: null, origin: currentOrigin };
  }, [getCurrentOrigin]);

  // ✅ clearAuthTokens - MODIFICADO
  const clearAuthTokens = useCallback(() => {
    const currentOrigin = getCurrentOrigin();

    // Limpiar sessionStorage de ESTA pestaña
    sessionStorage.removeItem(`jwt_token_${currentOrigin}`);
    sessionStorage.removeItem(`session_token_${currentOrigin}`);
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("window_session_id");
    
    // NO limpiar localStorage porque ya no lo usamos para sesiones
    console.log(`🧹 Tokens y window_id limpiados para origen: ${currentOrigin}`);
  }, [getCurrentOrigin]);

  // ✅ saveUserData - NUEVO: Guarda datos del usuario
  const saveUserData = useCallback((userData) => {
    // Guardar en sessionStorage (único por pestaña)
    sessionStorage.setItem("user_data", JSON.stringify(userData));
    sessionStorage.setItem("user_email", userData.email);
    sessionStorage.setItem("login_timestamp", Date.now().toString());
    
    console.log(`💾 Datos de usuario guardados en sessionStorage`);
  }, []);

  // ✅ getUserData - MODIFICADO: Solo lee de sessionStorage
  const getUserData = useCallback(() => {
    // Solo leer de sessionStorage
    const sessionUserData = sessionStorage.getItem("user_data");
    if (sessionUserData) {
      console.log(`✅ Datos de usuario encontrados en sessionStorage`);
      return JSON.parse(sessionUserData);
    }

    // ⚠️ YA NO recuperamos de localStorage
    console.log(`ℹ️ No hay datos de usuario en esta ventana`);
    return null;
  }, []);

  // ============================================
  // VERIFICACIÓN DE CALIDAD DE RED
  // ============================================

  const checkNetworkQuality = useCallback(async (baseUrl) => {
    const startTime = performance.now();
    let status = "unknown";
    let pingTime = 0;

    try {
      const apiBase = baseUrl || "https://api.olawee.com";
      const response = await fetch(`${apiBase}/wp-json`, {
        method: "HEAD",
        cache: "no-store",
        credentials: "omit",
      });

      pingTime = performance.now() - startTime;
      status = response.ok ? "available" : "error";

      const networkQuality =
        pingTime < 300
          ? "excellent"
          : pingTime < 1000
          ? "good"
          : pingTime < 3000
          ? "fair"
          : "poor";

      console.log(`📶 Calidad de red: ${networkQuality} (${Math.round(pingTime)}ms)`);

      return {
        status,
        pingTime,
        quality: networkQuality,
        httpStatus: response.status,
      };
    } catch (err) {
      pingTime = performance.now() - startTime;
      console.error(`❌ Error de conexión: ${err.message}`);

      return {
        status: "error",
        pingTime,
        quality: "unavailable",
        error: err.message,
      };
    }
  }, []);

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
  // INICIALIZACIÓN - MODIFICADO
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      // 🪟 Generar window_id al iniciar
      generateWindowId();
      
      // 🎯 Obtener datos del usuario desde sessionStorage (NO localStorage)
      const storedUser = getUserData();
      const { token, sessionToken } = getAuthToken();

      if (storedUser && token) {
        try {
          setUser(storedUser);
          setLoading(false);

          // Verificar en segundo plano
          setTimeout(() => {
            silentTokenVerification(token, sessionToken).catch(() => {
              console.warn("⚠️ Verificación de token silenciosa falló");
            });
          }, 1000);
          return;
        } catch (error) {
          console.error("❌ Error al procesar datos del usuario:", error);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [getAuthToken, getUserData, generateWindowId, silentTokenVerification]);

  // ============================================
  // LOGIN - MODIFICADO
  // ============================================

  const login = useCallback(async (emailOrUsername, password, rememberMe = true) => {
    try {
      const cleanEmailOrUsername = emailOrUsername?.toString().trim();
      const cleanPassword = password?.toString().trim();

      if (!cleanEmailOrUsername || !cleanPassword) {
        throw new AuthError(
          "El correo electrónico/usuario y la contraseña son obligatorios",
          "missing_fields"
        );
      }

      console.log("Intentando iniciar sesión con:", { username: cleanEmailOrUsername });

      // 🪟 NUEVO: Generar window_id para esta ventana
      const windowId = generateWindowId();

      // Verificar caché de ESTA pestaña (sessionStorage)
      const cachedUserData = sessionStorage.getItem("user_data");
      const cachedUserEmail = sessionStorage.getItem("user_email");
      const cachedTimestamp = sessionStorage.getItem("login_timestamp");
      const { token: cachedToken, sessionToken: cachedSessionToken } = getAuthToken();
      const now = Date.now();

      // Si hay caché reciente en esta pestaña
      if (cachedUserData && cachedUserEmail === cleanEmailOrUsername && cachedTimestamp && cachedToken) {
        if (now - parseInt(cachedTimestamp) < 2 * 60 * 60 * 1000) {
          try {
            const userData = JSON.parse(cachedUserData);
            console.log("✅ Login exitoso (desde caché de sessionStorage)");
            setUser(userData);

            setTimeout(() => {
              silentTokenVerification(cachedToken, cachedSessionToken).catch(() => {});
            }, 1000);

            return userData;
          } catch (cacheError) {
            console.warn("⚠️ Error al usar caché:", cacheError.message);
          }
        }
      }

      // Diagnóstico de red
      const networkCheck = await checkNetworkQuality();
      console.log(`🔄 Calidad de conexión al servidor: ${networkCheck.quality}`);

      // Intentar login (ahora incluye windowId)
      console.time("⏱ LOGIN API");
      const result = await loginUser(cleanEmailOrUsername, cleanPassword, windowId);
      console.timeEnd("⏱ LOGIN API");

      // Verificar conflicto de sesión
      if (result.conflict) {
        console.warn("⚠️ Conflicto de sesión detectado");
        return {
          conflict: true,
          message: result.message,
          origin: result.origin,
          user: result.user,
        };
      }

      // Login exitoso
      const { token, sessionToken, origin, user: profileData } = result;

      // Guardar tokens (ahora incluye windowId)
      saveAuthToken(token, sessionToken, origin, windowId, rememberMe);

      // Construir objeto de usuario
      const fullUser = {
        id: profileData.id,
        username: profileData.username || profileData.email,
        email: profileData.email,
        displayName: profileData.name || 
          `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        phone: profileData.phone || "",
        company: profileData.empresa || "",
        country: profileData.country || "",
        state: profileData.state || "",
        city: profileData.city || "",
        job: profileData.job || "",
        roles: profileData.roles || [],
        avatarUrl: null,
        meta: {},
      };

      // 💾 Guardar datos del usuario en sessionStorage SOLAMENTE
      saveUserData(fullUser);
      
      // ⚠️ YA NO guardamos en localStorage para evitar múltiples ventanas

      sessionStorage.setItem("token_last_verified", now.toString());
      setUser(fullUser);

      console.log("✅ Login exitoso:", fullUser);

      return fullUser;
    } catch (err) {
      console.error("❌ Error durante el login:", err);

      // Fallback a caché en caso de error de red
      if (
        err.message === "Timeout" ||
        err.name === "AbortError" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("timeout") ||
        err.message === "canceled" ||
        err.code === "ERR_CANCELED" ||
        err.message.includes("network")
      ) {
        const cachedUserData = sessionStorage.getItem("user_data");
        const cachedUserEmail = sessionStorage.getItem("user_email");

        if (cachedUserData && cachedUserEmail === emailOrUsername?.toString().trim()) {
          try {
            console.log("⚠️ Usando caché de sessionStorage como fallback");
            const userData = JSON.parse(cachedUserData);
            setUser({ ...userData, _offlineMode: true });
            return {
              ...userData,
              _warning: "Usando datos guardados debido a problemas de conexión",
            };
          } catch (fallbackError) {
            console.error("❌ También falló el uso de caché:", fallbackError);
          }
        }

        throw new AuthError(
          "La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet o inténtalo más tarde.",
          "network_timeout"
        );
      }

      if (err.code) {
        throw new AuthError(err.message, err.code);
      }

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el inicio de sesión",
        "unknown_error"
      );
    }
  }, [getAuthToken, saveAuthToken, saveUserData, checkNetworkQuality, silentTokenVerification, generateWindowId]);

  // ============================================
  // FORCE LOGIN - MODIFICADO
  // ============================================

  const forceLogin = useCallback(async (emailOrUsername, password, rememberMe = true) => {
    try {
      const cleanEmailOrUsername = emailOrUsername?.toString().trim();
      const cleanPassword = password?.toString().trim();

      if (!cleanEmailOrUsername || !cleanPassword) {
        throw new AuthError(
          "El correo electrónico/usuario y la contraseña son obligatorios",
          "missing_fields"
        );
      }

      console.log("🔄 Forzando inicio de sesión (cerrando otras sesiones)");

      // 🪟 NUEVO: Generar window_id
      const windowId = generateWindowId();

      const result = await forceLoginUser(cleanEmailOrUsername, cleanPassword, windowId);
      const { token, sessionToken, origin, user: profileData } = result;

      saveAuthToken(token, sessionToken, origin, windowId, rememberMe);

      const fullUser = {
        id: profileData.id,
        username: profileData.username || profileData.email,
        email: profileData.email,
        displayName: profileData.name || 
          `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        phone: profileData.phone || "",
        company: profileData.empresa || "",
        country: profileData.country || "",
        state: profileData.state || "",
        city: profileData.city || "",
        job: profileData.job || "",
        roles: profileData.roles || [],
        avatarUrl: null,
        meta: {},
      };

      const now = Date.now();
      saveUserData(fullUser);
      
      // ⚠️ YA NO guardamos en localStorage
      sessionStorage.setItem("token_last_verified", now.toString());
      setUser(fullUser);

      console.log("✅ Force login exitoso:", fullUser);

      // 📢 NUEVO: Notificar a otras ventanas que se hizo force login
      try {
        const channel = new BroadcastChannel('olawee_session_channel');
        channel.postMessage({
          type: 'FORCE_LOGOUT',
          windowId: windowId,
          origin: origin,
          timestamp: now
        });
        channel.close();
        console.log('📢 Notificación FORCE_LOGOUT enviada a otras ventanas');
      } catch (broadcastError) {
        console.warn('⚠️ No se pudo enviar notificación BroadcastChannel:', broadcastError);
      }

      return fullUser;
    } catch (err) {
      console.error("❌ Error durante force login:", err);

      if (err.code) {
        throw new AuthError(err.message, err.code);
      }

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el inicio de sesión",
        "unknown_error"
      );
    }
  }, [saveAuthToken, saveUserData, generateWindowId]);

  // ============================================
  // REGISTER - MODIFICADO
  // ============================================

  const register = useCallback(async (userData) => {
    try {
      const result = await registerUser(
        userData.email,
        userData.username || userData.email.split("@")[0],
        userData.password,
        userData
      );

      const { token, sessionToken, origin, user: profileData } = result;

      // 🪟 NUEVO: Generar window_id
      const windowId = generateWindowId();
      
      saveAuthToken(token, sessionToken, origin, windowId, true);

      const fullUser = {
        id: profileData.id,
        username: profileData.username || profileData.email,
        email: profileData.email,
        displayName: profileData.displayName || 
          `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        company: profileData.company || "",
        country: profileData.country || "",
        state: profileData.state || "",
        city: profileData.city || "",
        job: profileData.job || "",
        roles: profileData.roles || [],
        avatarUrl: null,
        meta: {},
      };

      const now = Date.now();
      saveUserData(fullUser);
      
      // ⚠️ YA NO guardamos en localStorage
      sessionStorage.setItem("token_last_verified", now.toString());

      setUser(fullUser);

      console.log("✅ Registro exitoso:", fullUser);

      return fullUser;
    } catch (err) {
      console.error("❌ Error durante el registro:", err);

      if (err.code) {
        throw new AuthError(err.message, err.code);
      }

      throw new AuthError(
        err.message || "Ha ocurrido un error durante el registro",
        "unknown_error"
      );
    }
  }, [saveAuthToken, saveUserData, generateWindowId]);

  // ============================================
  // LOGOUT - MODIFICADO
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
      
      // Limpiar datos antiguos de localStorage si existen
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_email");
      localStorage.removeItem("login_timestamp");
      localStorage.removeItem("token_last_verified");
      localStorage.removeItem("user_data_timestamp");
      localStorage.removeItem("site_config_timestamp");
      localStorage.removeItem("user_preferences_timestamp");

      setUser(null);

      console.log("✅ Logout exitoso");
    } catch (err) {
      console.error("⚠️ Error en logout, limpiando localmente:", err.message);

      clearAuthTokens();
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("user_email");
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_email");

      setUser(null);
    }
  }, [getAuthToken, clearAuthTokens]);

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
    
    // ⚠️ YA NO actualizamos localStorage
  }, [user, saveUserData]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);