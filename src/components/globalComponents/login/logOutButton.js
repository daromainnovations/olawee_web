
// import { useAuth } from "../../../context/authProviderContext";
// import { deleteWooCommerceSessionCookies } from "../../../utils/sessionUtils";



// const LogOutButton = () => {
//   const { logout } = useAuth(); // <-- esto es lo importante

//   const handleLogout = () => {
//     const confirmed = window.confirm("¿Seguro que quieres cerrar sesión?");
//     if (confirmed) {
//       deleteWooCommerceSessionCookies();
//       logout(); // 🔥 limpia el contexto (user = null)
//     }
//   };

//   return <button onClick={handleLogout} className="btn-logOut">LOG OUT</button>;
// };

// export default LogOutButton;

