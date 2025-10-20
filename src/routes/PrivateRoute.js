
// // src/routes/PrivateRoute.js
// import { useAuth } from "../context/authProviderContext";
// import AuthModal from "../components/globalComponents/login/authModal";

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   // Verificación ligera - solo comprueba si hay un usuario en el estado
//   // No espera a que se complete la verificación completa del token
//   if (!user && !loading) {
//     return <AuthModal modalType="login" setModalType={() => {}} />;
//   }

//   // Mostrar el contenido protegido inmediatamente si hay un usuario
//   // La verificación completa del token se realizará en segundo plano
//   return children;
// };

// export default PrivateRoute;








// src/routes/PrivateRoute.js - VERIFICACIÓN OPCIONAL (NO BLOQUEA)
import { useAuth } from "../context/authProviderContext";
import { useEffect } from "react";
import AuthModal from "../components/globalComponents/login/authModal";
import { verificarAccesoApp } from "../services/wpSwingsAPI";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Verificar suscripción en segundo plano (opcional, no bloquea acceso)
  useEffect(() => {
    if (!user) return;

    const checkSubscriptionInBackground = async () => {
      try {
        const userIdentifier = user?.email || user?.username || user?.user_email || user?.name;
        if (!userIdentifier) return;

        const result = await verificarAccesoApp(userIdentifier);
        
        // Guardar información para que otros componentes la usen
        if (result.hasAccess) {
          localStorage.setItem('hasActiveSubscription', 'true');
          localStorage.setItem('userSubscriptions', JSON.stringify(result.subscriptions || []));
        } else {
          localStorage.setItem('hasActiveSubscription', 'false');
          localStorage.removeItem('userSubscriptions');
        }

        console.log('🔍 Estado de suscripción:', {
          hasActiveSubscription: result.hasAccess,
          subscriptions: result.subscriptions?.length || 0
        });
      } catch (error) {
        console.error('Error verificando suscripción (no crítico):', error);
        localStorage.setItem('hasActiveSubscription', 'false');
      }
    };

    // Verificar después de un breve delay (no bloquea la carga)
    const timer = setTimeout(() => {
      checkSubscriptionInBackground();
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar modal de login
  if (!user) {
    return <AuthModal modalType="login" setModalType={() => {}} />;
  }

  // ✅ Permitir acceso a todos los usuarios autenticados
  // (la información de suscripción se carga en segundo plano)
  return children;
};

export default PrivateRoute;