
// import { useAuth } from "../context/authProviderContext";
// import AuthModal from "../components/globalComponents/login/authModal";

// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth();

//   if (!user) {
//     return <AuthModal modalType="login" setModalType={() => {}} />;
//   }

//   return children;
// };

// export default PrivateRoute;



import { useAuth } from "../context/authProviderContext";
import AuthModal from "../components/globalComponents/login/authModal";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Verificación ligera - solo comprueba si hay un usuario en el estado
  // No espera a que se complete la verificación completa del token
  if (!user && !loading) {
    return <AuthModal modalType="login" setModalType={() => {}} />;
  }

  // Mostrar el contenido protegido inmediatamente si hay un usuario
  // La verificación completa del token se realizará en segundo plano
  return children;
};

export default PrivateRoute;