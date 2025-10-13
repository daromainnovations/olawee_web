
// // src/components/global/SessionListenerProvider.jsx
// import { useEffect, useRef } from 'react';
// import { useAuth } from '../../context/authProviderContext';

// const SessionListenerProvider = ({ children }) => {
//   const channelRef = useRef(null);
//   const sessionIdRef = useRef(null);
//   const isLoggingOutRef = useRef(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     // Crear canal de comunicación entre pestañas/ventanas
//     channelRef.current = new BroadcastChannel('olawee_web_session_channel');
    
//     // ID único para esta sesión/ventana
//     sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     window.__sessionId = sessionIdRef.current;

//     console.log('🔵 [SessionListener] Inicializado con sessionId:', sessionIdRef.current);

//     const getCurrentOrigin = () => {
//       const hostname = window.location.hostname;
//       if (hostname.includes('app.olawee.com') || 
//           hostname.includes('localhost:5173') ||
//           hostname.includes('localhost:5174')) {
//         return 'app';
//       }
//       return 'web';
//     };

//     const getStoredUser = () => {
//       try {
//         const origin = getCurrentOrigin();
//         const userStr = localStorage.getItem(`auth_token_${origin}`);
        
//         if (userStr) {
//           const tokenData = JSON.parse(userStr);
//           // El usuario está dentro de tokenData si existe
//           return tokenData.user || null;
//         }

//         // Fallback: intentar sessionStorage
//         const sessionUserStr = sessionStorage.getItem(`jwt_token_${origin}`);
//         if (sessionUserStr) {
//           return JSON.parse(sessionUserStr);
//         }

//         return null;
//       } catch (error) {
//         console.error('Error al obtener usuario almacenado:', error);
//         return null;
//       }
//     };

//     const handleForceLogout = () => {
//       if (isLoggingOutRef.current) return;
      
//       isLoggingOutRef.current = true;
      
//       console.log('🔴 [SessionListener] Forzando logout...');
      
//       // Crear overlay modal
//       const overlay = document.createElement('div');
//       overlay.style.cssText = `
//         position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
//         background: rgba(0, 0, 0, 0.95); z-index: 999999; display: flex;
//         flex-direction: column; align-items: center; justify-content: center;
//         font-family: system-ui, -apple-system, sans-serif;
//       `;
      
//       overlay.innerHTML = `
//         <div style="text-align: center; padding: 40px; max-width: 400px; background: #2d2d2d; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
//           <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
//           <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: 600;">Sesión cerrada</h2>
//           <p style="margin: 0 0 30px 0; color: #cccccc; font-size: 15px; line-height: 1.5;">
//             Tu sesión ha sido cerrada porque iniciaste sesión en otra ventana o navegador
//           </p>
//           <button id="accept-logout-btn-web" style="
//             background: linear-gradient(135deg, #0657b4 0%, #2171d9 100%);
//             color: white; border: none;
//             padding: 12px 32px; font-size: 15px; font-weight: 600;
//             border-radius: 8px; cursor: pointer;
//             box-shadow: 0 4px 12px rgba(6, 87, 180, 0.3);
//             transition: transform 0.2s;
//           " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
//             Aceptar
//           </button>
//         </div>
//       `;
      
//       document.body.appendChild(overlay);
      
//       // Limpiar todos los tokens del origen actual
//       const origin = getCurrentOrigin();
      
//       // LocalStorage
//       localStorage.removeItem(`auth_token_${origin}`);
//       localStorage.removeItem('token_saved_at');
//       localStorage.removeItem('user_data');
//       localStorage.removeItem('user_email');
//       localStorage.removeItem('login_timestamp');
      
//       // SessionStorage
//       sessionStorage.removeItem(`jwt_token_${origin}`);
//       sessionStorage.removeItem(`session_token_${origin}`);
      
//       console.log('🧹 [SessionListener] Storage limpiado');
      
//       // Handler del botón
//       const acceptBtn = document.getElementById('accept-logout-btn-web');
//       if (acceptBtn) {
//         acceptBtn.onclick = () => {
//           if (channelRef.current) {
//             channelRef.current.close();
//           }
//           window.location.replace('/');
//         };
//       }
//     };

//     // Escuchar mensajes de otras ventanas/pestañas
//     channelRef.current.onmessage = (event) => {
//       const { type, userId, sessionId, origin: messageOrigin } = event.data;

//       // Solo procesar mensajes del mismo origen (web)
//       const currentOrigin = getCurrentOrigin();
//       if (messageOrigin && messageOrigin !== currentOrigin) {
//         console.log('🔍 [SessionListener] Mensaje ignorado - origen diferente:', messageOrigin);
//         return;
//       }

//       console.log('📩 [SessionListener] Mensaje recibido:', event.data);

//       switch (type) {
//         case 'LOGIN_CHECK': {
//           // Otra ventana pregunta si hay sesión activa
//           const storedUser = getStoredUser();
          
//           if (storedUser && storedUser.id === userId && 
//               sessionId !== sessionIdRef.current) {
//             console.log('✅ [SessionListener] Respondiendo SESSION_ACTIVE');
            
//             channelRef.current.postMessage({
//               type: 'SESSION_ACTIVE',
//               userId,
//               sessionId: sessionIdRef.current,
//               username: storedUser.username || storedUser.email,
//               email: storedUser.email,
//               origin: currentOrigin
//             });
//           }
//           break;
//         }

//         case 'FORCE_LOGOUT': {
//           // Otra ventana hizo force login - cerrar esta
//           if (sessionId !== sessionIdRef.current) {
//             console.log('🔴 [SessionListener] Recibido FORCE_LOGOUT - cerrando sesión');
//             handleForceLogout();
//           }
//           break;
//         }

//         default:
//           console.log('⚠️ [SessionListener] Tipo de mensaje desconocido:', type);
//           break;
//       }
//     };

//     // Cleanup al desmontar
//     return () => {
//       console.log('🔵 [SessionListener] Limpiando...');
//       if (channelRef.current) {
//         channelRef.current.close();
//       }
//     };
//   }, [user]);

//   return children;
// };

// export default SessionListenerProvider;











// src/components/global/SessionListenerProvider.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/authProviderContext';

/**
 * SessionListenerProvider Simplificado
 * 
 * Ya NO necesita detectar múltiples ventanas con BroadcastChannel
 * porque el backend valida window_id.
 * 
 * Solo escucha eventos de FORCE_LOGOUT desde otras ventanas.
 */
const SessionListenerProvider = ({ children }) => {
  const channelRef = useRef(null);
  const windowIdRef = useRef(null);
  const isLoggingOutRef = useRef(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Obtener window_id de esta ventana
    windowIdRef.current = sessionStorage.getItem('window_session_id');
    
    console.log('🪟 [SessionListener] Window ID:', windowIdRef.current);

    // Crear canal solo para escuchar FORCE_LOGOUT
    channelRef.current = new BroadcastChannel('olawee_session_channel');

    const getCurrentOrigin = () => {
      const hostname = window.location.hostname;
      if (hostname.includes('app.olawee.com') || 
          hostname.includes('localhost:5173') ||
          hostname.includes('localhost:5174')) {
        return 'app';
      }
      return 'web';
    };

    const handleForceLogout = async () => {
      if (isLoggingOutRef.current) return;
      
      isLoggingOutRef.current = true;
      
      console.log('🔴 [SessionListener] Forzando logout en esta ventana...');
      
      // Llamar al logout del contexto
      try {
        await logout();
      } catch (err) {
        console.error('Error al hacer logout:', err);
      }
      
      // Mostrar modal
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.95); z-index: 999999; display: flex;
        flex-direction: column; align-items: center; justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      
      overlay.innerHTML = `
        <div style="text-align: center; padding: 40px; max-width: 400px; background: #2d2d2d; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
          <div style="font-size: 48px; margin-bottom: 20px; background: transparent">⚠️</div>
          <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: 600; background: transparent">Sesión cerrada</h2>
          <p style="margin: 0 0 30px 0; color: #cccccc; font-size: 15px; line-height: 1.5; background: transparent">
            Tu sesión ha sido cerrada porque iniciaste sesión en otra ventana
          </p>
          <button id="accept-logout-btn" style="
            background: linear-gradient(135deg, #0657b4 0%, #2171d9 100%);
            color: white; border: none;
            padding: 12px 32px; font-size: 15px; font-weight: 600;
            border-radius: 8px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(6, 87, 180, 0.3);
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Aceptar
          </button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Handler del botón
      const acceptBtn = document.getElementById('accept-logout-btn');
      if (acceptBtn) {
        acceptBtn.onclick = () => {
          if (channelRef.current) {
            channelRef.current.close();
          }
          window.location.replace('/');
        };
      }
    };

    // Escuchar mensajes de otras ventanas
    channelRef.current.onmessage = (event) => {
      const { type, windowId, origin: messageOrigin } = event.data;

      // Solo procesar mensajes del mismo origen
      const currentOrigin = getCurrentOrigin();
      if (messageOrigin && messageOrigin !== currentOrigin) {
        return;
      }

      console.log('📩 [SessionListener] Mensaje recibido:', event.data);

      // Solo escuchar FORCE_LOGOUT
      if (type === 'FORCE_LOGOUT') {
        // Verificar que NO sea esta ventana la que hizo force login
        if (windowId !== windowIdRef.current) {
          console.log('🔴 [SessionListener] Recibido FORCE_LOGOUT desde otra ventana');
          handleForceLogout();
        }
      }
    };

    // Cleanup
    return () => {
      console.log('🔵 [SessionListener] Limpiando...');
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [user, logout]);

  return children;
};

export default SessionListenerProvider;