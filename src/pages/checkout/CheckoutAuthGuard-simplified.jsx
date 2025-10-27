
// // src/components/CheckoutAuthGuard/CheckoutAuthGuard.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './checkoutAuthGuard.scss';
// import { useAuth } from '../../context/authProviderContext';
// import AuthModal from '../../components/globalComponents/login/authModal';

// /**
//  * Componente que envuelve el checkout y gestiona la autenticación
//  * - Usa tu AuthModal existente
//  * - Si no está autenticado, muestra el modal y difumina el checkout
//  * - Guarda el estado del checkout para restaurarlo después del login
//  */
// const CheckoutAuthGuard = ({ children }) => {
//   const { user, loading, isAuthenticated, selectedProduct } = useAuth();
//   const [modalType, setModalType] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Esperar a que termine la carga inicial
//     if (loading) {
//       console.log('⏳ Cargando estado de autenticación...');
//       return;
//     }

//     // Si no está autenticado, mostrar modal de login
//     if (!isAuthenticated()) {
//       console.log('🔒 Usuario no autenticado en checkout, mostrando modal');
      
//       // Guardar la intención de checkout
//       sessionStorage.setItem('checkout_intent', JSON.stringify({
//         path: location.pathname,
//         product: selectedProduct,
//         timestamp: Date.now()
//       }));
      
//       // Mostrar modal de login (por defecto)
//       setModalType('login');
//     } else {
//       console.log('✅ Usuario autenticado, permitiendo acceso al checkout');
//       setModalType(null);
      
//       // Limpiar intención de checkout una vez autenticado
//       sessionStorage.removeItem('checkout_intent');
//     }
//   }, [loading, isAuthenticated, selectedProduct, location.pathname]);

//   // Detectar cuando el usuario se autentica exitosamente
//   useEffect(() => {
//     if (isAuthenticated() && modalType) {
//       console.log('✅ Usuario autenticado, cerrando modal');
//       setModalType(null);
      
//       // Restaurar intención de checkout si existe
//       const checkoutIntent = sessionStorage.getItem('checkout_intent');
//       if (checkoutIntent) {
//         try {
//           const intent = JSON.parse(checkoutIntent);
//           console.log('♻️ Restaurando intención de checkout:', intent);
//           sessionStorage.removeItem('checkout_intent');
//         } catch (e) {
//           console.error('❌ Error al restaurar intención de checkout:', e);
//         }
//       }
//     }
//   }, [user, modalType, isAuthenticated]);

//   const handleModalClose = () => {
//     console.log('❌ Usuario cerró modal sin autenticarse');
//     sessionStorage.removeItem('checkout_intent');
//     navigate('/checkout'); // Volver a la página de precios
//   };

//   // Mostrar loading mientras se verifica autenticación
//   if (loading) {
//     return (
//       <div className="checkout-auth-loading">
//         <div className="spinner"></div>
//         <p>Verificando sesión...</p>
//       </div>
//     );
//   }

//   // Si está autenticado, mostrar el checkout normal
//   if (isAuthenticated()) {
//     return <>{children}</>;
//   }

//   // Si no está autenticado, mostrar checkout difuminado + modal
//   return (
//     <div className="checkout-auth-guard">
//       {/* Backdrop con checkout difuminado */}
//       <div className="checkout-preview-blurred">
//         {children}
//       </div>

//       {/* Overlay informativo */}
//       <div className="checkout-auth-overlay">
//         <div className="auth-prompt">
//           <div className="prompt-icon">🔒</div>
//           <h2>Inicia sesión para continuar</h2>
//           <p>Estás a punto de completar tu compra</p>
//           {selectedProduct && (
//             <div className="product-info">
//               <span className="product-icon">📦</span>
//               <span className="product-name">{selectedProduct.name}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tu AuthModal existente */}
//       {modalType && (
//         <AuthModal 
//           modalType={modalType} 
//           setModalType={(type) => {
//             if (!type) {
//               // Si el usuario cierra el modal sin autenticarse
//               handleModalClose();
//             } else {
//               setModalType(type);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default CheckoutAuthGuard;







// src/components/CheckoutAuthGuard/CheckoutAuthGuard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkoutAuthGuard.scss';
import { useAuth } from '../../context/authProviderContext';
import AuthModal from '../../components/globalComponents/login/authModal';

/**
 * Componente que envuelve el checkout y gestiona la autenticación
 * - Usa tu AuthModal existente
 * - Si no está autenticado, muestra el modal y difumina el checkout
 * - Guarda el estado del checkout para restaurarlo después del login
 */
const CheckoutAuthGuard = ({ children }) => {
  const { loading, isAuthenticated, selectedProduct } = useAuth();
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    // Esperar a que termine la carga inicial
    if (loading) {
      console.log('⏳ Cargando estado de autenticación...');
      return;
    }

    const authenticated = isAuthenticated();

    // Si no está autenticado y no hay modal abierto, abrirlo
    if (!authenticated && !modalType) {
      console.log('🔒 Usuario no autenticado en checkout, mostrando modal');
      
      // Guardar la intención de checkout
      sessionStorage.setItem('checkout_intent', JSON.stringify({
        path: location.pathname,
        product: selectedProduct,
        timestamp: Date.now()
      }));
      
      // Mostrar modal de login (por defecto)
      setModalType('login');
      wasAuthenticatedRef.current = false;
    } 
    // Si está autenticado y había un modal abierto, cerrarlo
    else if (authenticated && modalType && !wasAuthenticatedRef.current) {
      console.log('✅ Autenticación completada, cerrando modal');
      setModalType(null);
      sessionStorage.removeItem('checkout_intent');
      wasAuthenticatedRef.current = true;
    }
    // Si está autenticado desde el inicio, marcar como autenticado
    else if (authenticated) {
      console.log('✅ Usuario autenticado, permitiendo acceso al checkout');
      wasAuthenticatedRef.current = true;
      
      // Si hay modal abierto pero está autenticado, cerrarlo
      if (modalType) {
        setModalType(null);
        sessionStorage.removeItem('checkout_intent');
      }
    }
  }, [loading, isAuthenticated, selectedProduct, location.pathname, modalType]);

  const handleModalClose = (type) => {
    console.log('🔄 handleModalClose llamado con:', type);
    
    // Si type es null, el usuario quiere cerrar el modal
    if (type === null) {
      // Si NO está autenticado, redirigir al home
      if (!isAuthenticated()) {
        console.log('❌ Usuario cerró modal sin autenticarse, redirigiendo...');
        sessionStorage.removeItem('checkout_intent');
        navigate('/');
      } else {
        // Si está autenticado, solo cerrar el modal
        console.log('✅ Modal cerrado (usuario autenticado)');
        setModalType(null);
        sessionStorage.removeItem('checkout_intent');
      }
    } else {
      // Si hay un type (cambio entre login/register), mantener el modal
      console.log('🔄 Cambiando tipo de modal a:', type);
      setModalType(type);
    }
  };

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="checkout-auth-loading">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // Si está autenticado, mostrar el checkout normal
  if (isAuthenticated()) {
    return <>{children}</>;
  }

  // Si no está autenticado, mostrar checkout difuminado + modal
  return (
    <div className="checkout-auth-guard">
      {/* Backdrop con checkout difuminado */}
      <div className="checkout-preview-blurred">
        {children}
      </div>

      {/* Overlay informativo */}
      <div className="checkout-auth-overlay">
        <div className="auth-prompt">
          <div className="prompt-icon">🔒</div>
          <h2>Inicia sesión para continuar</h2>
          <p>Estás a punto de completar tu compra</p>
          {selectedProduct && (
            <div className="product-info">
              <span className="product-icon">📦</span>
              <span className="product-name">{selectedProduct.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tu AuthModal existente */}
      {modalType && (
        <AuthModal 
          modalType={modalType} 
          setModalType={handleModalClose}
        />
      )}
    </div>
  );
};

export default CheckoutAuthGuard;