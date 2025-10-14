
// src/components/AuthModalListener.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authProviderContext';

/**
 * Componente que escucha eventos para abrir el AuthModal
 * y maneja la redirección después del login
 */
const AuthModalListener = ({ setModalType }) => {
  const navigate = useNavigate();
  const { isAuthenticated, selectProductForCheckout } = useAuth();

  // Escuchar evento para abrir modal
  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const { type } = event.detail;
      setModalType(type); // 'login' o 'signup'
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, [setModalType]);

  // Después del login, redirigir si hay producto pendiente
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirect_after_login');
      const pendingProduct = sessionStorage.getItem('pending_product');
      
      if (redirectPath && pendingProduct) {
        try {
          const product = JSON.parse(pendingProduct);
          selectProductForCheckout(product);
          sessionStorage.removeItem('redirect_after_login');
          sessionStorage.removeItem('pending_product');
          navigate(redirectPath);
        } catch (e) {
          console.error('Error al procesar producto pendiente:', e);
        }
      }
    }
  }, [isAuthenticated, navigate, selectProductForCheckout]);

  return null; // Este componente no renderiza nada
};

export default AuthModalListener;