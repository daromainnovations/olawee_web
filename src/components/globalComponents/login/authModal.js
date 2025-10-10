// import { useEffect, useState } from "react";
// import "../login/styles/authModal.scss";
// import { registerUser } from "../../../services/wooCommerceService";
// import { useAuth } from "../../../context/authProviderContext";
// import { AuthError } from "../../../utils/AuthError";
// import Loader from "../loader/loader";
// import { Country, State, City } from "country-state-city";
// import { getApiUrl } from "../../../config/api"; // Importar configuración

// const prefixOptions = [
//   { value: '+34', label: '+34 (Spain)' },
//   { value: '+1', label: '+1 (USA)' },
//   { value: '+44', label: '+44 (UK)' },
//   { value: '+49', label: '+49 (Germany)' },
//   { value: '+33', label: '+33 (France)' },
// ];

// function isStrongPassword(password) {
//   const minLength = password.length >= 8;
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasLowercase = /[a-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
// }

// const AuthModal = ({ modalType, setModalType, preloadedEmail }) => {
//   // --------- ESTADOS ---------
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [company, setCompany] = useState("");
//   const [phone, setPhone] = useState("");
//   const [job, setJob] = useState("");
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState("");
//   const [userExists, setUserExists] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState("Procesando...");
//   const [success, setSuccess] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRepeatPassword, setShowRepeatPassword] = useState(false);

//   const [countriesList, setCountriesList] = useState([]);
//   const [statesList, setStatesList] = useState([]);
//   const [citiesList, setCitiesList] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("ES"); // España por defecto
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const [prefix, setPrefix] = useState('+34');
//   const fullPhoneNumber = `${prefix}${phone}`;

//   // --------- ESTADOS PARA RESET POR LINK (ACTUALIZADO PARA EL PLUGIN) ---------
//   const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
//   const [resetToken, setResetToken] = useState("");
//   const [resetEmailFromUrl, setResetEmailFromUrl] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [repeatNewPassword, setRepeatNewPassword] = useState("");

//   const { login } = useAuth();

//   // Evitar scroll cuando el modal está abierto
//   useEffect(() => {
//     document.body.classList.add("no-scroll");
//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, []);

//   // Pre-cargar el email si es login
//   useEffect(() => {
//     if (modalType === "login" && preloadedEmail) {
//       setEmail(preloadedEmail);
//     }
//   }, [modalType, preloadedEmail]);

//   // Cargar países al iniciar
//   useEffect(() => {
//     const allCountries = Country.getAllCountries();
//     setCountriesList(allCountries);
//   }, []);

//   // Cargar estados y limpiar ciudad cuando cambia país
//   useEffect(() => {
//     if (selectedCountry) {
//       const states = State.getStatesOfCountry(selectedCountry);
//       setStatesList(states);
//       setSelectedState(states[0]?.isoCode || "");
//     } else {
//       setStatesList([]);
//       setSelectedState("");
//     }
//     setCitiesList([]);
//     setSelectedCity("");
//   }, [selectedCountry]);

//   // Cargar ciudades cuando cambia estado
//   useEffect(() => {
//     if (selectedCountry && selectedState) {
//       const cities = City.getCitiesOfState(selectedCountry, selectedState);
//       setCitiesList(cities);
//       setSelectedCity(cities[0]?.name || "");
//     } else {
//       setCitiesList([]);
//       setSelectedCity("");
//     }
//   }, [selectedCountry, selectedState]);

//   // --------- DETECTAR SI HAY RESET POR ENLACE (ACTUALIZADO PARA PLUGIN) ---------
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");
//     const email = params.get("email");
    
//     if (token && email) {
//       setIsResetPasswordMode(true);
//       setResetToken(token);
//       setResetEmailFromUrl(email);
//       setModalType("reset-password");
      
//       // Verificar que el token sea válido directamente aquí
//       const verifyToken = async () => {
//         try {
//           const response = await fetch(getApiUrl('VERIFY_RESET_TOKEN'), {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ token, email }),
//           });

//           const data = await response.json();
          
//           if (!response.ok) {
//             setError(data.message || 'Token inválido o expirado');
//             setIsResetPasswordMode(false);
//             setModalType("login");
//           }
//         } catch (err) {
//           setError('Error verificando el token');
//           setIsResetPasswordMode(false);
//           setModalType("login");
//         }
//       };
      
//       verifyToken();
//     }
//   }, [setModalType]);

//   // --------- FUNCIÓN PRINCIPAL DE LOGIN/REGISTRO ---------
//   const handleAuth = async () => {
//     setError(null);
//     setMessage("");
//     setSuccess(false);
//     setUserExists(false);
//     setLoading(true);

//     setLoadingMessage(
//       modalType === "signup"
//         ? "Registrando usuario..."
//         : modalType === "login"
//         ? "Verificando usuario..."
//         : "Procesando..."
//     );

//     if (modalType === "login") {
//       const loginErrors = {};

//       if (!email) {
//         loginErrors.email = "Please complete this required field.";
//       } else if (!/\S+@\S+\.\S+/.test(email)) {
//         loginErrors.email = "Invalid email address.";
//       }
//       if (!password) {
//         loginErrors.password = "Please complete this required field.";
//       }
//       if (Object.keys(loginErrors).length > 0) {
//         setFieldErrors(loginErrors);
//         setError("Please fill all required fields.");
//         setLoading(false);
//         return;
//       }
//       try {
//         await login(email.trim(), password.trim());

//         setMessage("✅ Logged in successfully.");
//         setFieldErrors({});
//         setError(null);
//         setTimeout(() => setModalType(null), 2000);
//       } catch (err) {
//         console.error("Login error:", err);
//         if (err instanceof AuthError) {
//           setError(`${err.getFriendlyMessage()}`);
//         } else if (typeof err.message === "string") {
//           setError(`${err.message}`);
//         } else {
//           setError("An unexpected error occurred. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     // REGISTRO
//     const newErrors = {};
//     const generalErrors = [];

//     if (!firstName) newErrors.firstName = "Please complete this required field.";
//     if (!username) newErrors.username = "Please complete this required field.";
//     if (!company) newErrors.company = "Please complete this required field.";
//     if (!job) newErrors.job = "Please complete this required field.";

//     if (!email) {
//       newErrors.email = "Please complete this required field.";
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       generalErrors.push(" Invalid email format.");
//     }
//     if (!password) {
//       newErrors.password = "Please complete this required field.";
//     } else if (!isStrongPassword(password)) {
//       generalErrors.push(
//         "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
//       );
//     }
    
//     if (!repeatPassword) {
//       newErrors.repeatPassword = "Please complete this required field.";
//     }
    
//     if (password && repeatPassword && password !== repeatPassword) {
//       generalErrors.push("Passwords do not match.");
//     }
//     if (!selectedCountry) newErrors.country = "Please complete this required field.";
//     if (!selectedState) newErrors.state = "Please complete this required field.";

//     if (Object.keys(newErrors).length > 0 || generalErrors.length > 0) {
//       setFieldErrors(newErrors);
//       const errorsToShow = [];
//       if (Object.keys(newErrors).length > 0) {
//         errorsToShow.push("Please fill all required fields.");
//       }
//       if (generalErrors.length > 0) {
//         errorsToShow.push(...generalErrors);
//       }
//       setError(errorsToShow.join("\n"));
//       setLoading(false);
//       return;
//     }

//     // REGISTRO y LOGIN AUTOMÁTICO
//     try {
//       console.log("🔍 FRONTEND - Datos que se envían:", {
//         email,
//         username, 
//         password: "***",
//         selectedCountry,    // ✅ Verifica que tenga valor
//         selectedState,      // ✅ Verifica que tenga valor  
//         selectedCity,       // ✅ Verifica que tenga valor
//         job,               // ✅ Verifica que tenga valor
//         extraFields: {
//           first_name: firstName,
//           last_name: lastName,
//           phone: fullPhoneNumber,
//           company: company,
//           country: selectedCountry,
//           state: selectedState,
//           city: selectedCity,
//           job: job,
//         }
//       });

//       await registerUser(email, username, password, {
//         first_name: firstName,
//         last_name: lastName,
//         phone: fullPhoneNumber,
//         company: company,
//         country: selectedCountry,
//         state: selectedState,
//         city: selectedCity,
//         job: job,
//       });

//       await login(email, password);  // ✅ CORREGIDO: usar email en lugar de username

//       setMessage("✅ Usuario registrado y logueado con éxito.");
//       setSuccess(true);
//       setFieldErrors({});
//       setError(null);
//       setTimeout(() => {
//         setModalType(null);
//         setSuccess(false);
//         setMessage("");
//       }, 2000);
//     } catch (err) {
//       const code = err.response?.data?.code;
//       if (code === "email_exists" || code === "username_exists") {
//         setUserExists(true);
//         setError(null);
//       } else {
//         setError("🚨 Error al registrar usuario. Puede que ya exista o haya un problema con WooCommerce.");
//         setSuccess(false);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------- FUNCIÓN PARA RESET PASSWORD (ACTUALIZADA PARA PLUGIN) ---------
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setMessage("");
//     setLoading(true);

//     // Validaciones
//     if (!newPassword || !repeatNewPassword) {
//       setError("Please complete all fields.");
//       setLoading(false);
//       return;
//     }
//     if (newPassword !== repeatNewPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }
//     if (!isStrongPassword(newPassword)) {
//       setError("Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // ✅ USANDO ENDPOINT CORRECTO DEL PLUGIN
//       const response = await fetch(getApiUrl('RESET_PASSWORD'), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           token: resetToken,
//           email: resetEmailFromUrl,
//           password: newPassword,
//         }),
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setMessage("✅ Password updated successfully. You can now log in.");
//         setTimeout(() => {
//           setModalType("login");
//           setIsResetPasswordMode(false);
//           setNewPassword("");
//           setRepeatNewPassword("");
//           // Limpiar URL parameters
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }, 2000);
//       } else {
//         setError(data.message || "Error resetting password.");
//       }
//     } catch (err) {
//       setError("Error connecting to server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------- FUNCIÓN PARA SOLICITAR RESET (ACTUALIZADA PARA PLUGIN) ---------
//   const handleRequestPasswordReset = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setMessage("");
//     setLoading(true);
//     setLoadingMessage("Enviando correo...");

//     if (!resetEmail) {
//       setError("Por favor ingresa tu correo.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // ✅ USANDO ENDPOINT CORRECTO DEL PLUGIN
//       const response = await fetch(getApiUrl('REQUEST_PASSWORD_RESET'), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: resetEmail, origin: 'web' }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage("✅ Si tu email existe, recibirás instrucciones para resetear tu contraseña.");
//         setResetEmail("");
//       } else {
//         setError(result.message || "🚨 Hubo un error.");
//       }
//     } catch (err) {
//       setError("🚨 Error al conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------- RENDER ---------
//   return (
//     <div className="modal-overlay" onClick={() => setModalType(null)}>
//       <div className={`modal-content ${loading ? "blurred" : ""}`} onClick={(e) => e.stopPropagation()}>
//         {/* ----------- FORMULARIO DE RESET-PASSWORD ----------- */}
//         {modalType === "reset-password" && isResetPasswordMode && (
//           <form className="auth-form p-2">
//             <div className="modal-header d-flex justify-content-center">
//               <h2>Crear nueva contraseña</h2>
//               <button className="btn-close" onClick={() => {
//                 setModalType(null);
//                 window.history.replaceState({}, document.title, window.location.pathname);
//               }}>❌</button>
//             </div>
//             <div className="form-group p-3">
//               <label>Nueva contraseña</label>
//               <div className="input-wrapper">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={newPassword}
//                   onChange={e => setNewPassword(e.target.value)}
//                   autoComplete="new-password"
//                 />
//                 <i
//                   className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 ></i>
//               </div>
//             </div>
//             <div className="form-group p-3">
//               <label>Repetir nueva contraseña</label>
//               <div className="input-wrapper">
//                 <input
//                   type={showRepeatPassword ? "text" : "password"}
//                   value={repeatNewPassword}
//                   onChange={e => setRepeatNewPassword(e.target.value)}
//                   autoComplete="new-password"
//                 />
//                 <i
//                   className={`bi ${showRepeatPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
//                   onClick={() => setShowRepeatPassword((prev) => !prev)}
//                 ></i>
//               </div>
//             </div>
//             <div className="container-btn-submit">
//               <button
//                 className="btn-submit"
//                 onClick={handleResetPassword}
//                 disabled={loading}
//               >
//                 Cambiar contraseña
//               </button>
//             </div>
//             {error && <div className="error-message">{error}</div>}
//             {message && <div className="success-message">{message}</div>}
//             {loading && <Loader message={loadingMessage} />}
//           </form>
//         )}

//         {/* ----------- FLUJO NORMAL: LOGIN, SIGNUP, FORGOT ----------- */}
//         {!isResetPasswordMode && modalType !== "reset-password" && (
//           <>
//             <div className="modal-header d-flex justify-content-center">
//               <h2>
//                 {forgotPassword
//                   ? "Restablecer Contraseña"
//                   : modalType === "login"
//                   ? "Iniciar sesión con OLAWEE"
//                   : "Regístrate en OLAWEE"}
//               </h2>
//               <button className="btn-close" onClick={() => setModalType(null)}>❌</button>
//             </div>

//             {message && <p className="success-message">{message}</p>}

//             {success ? (
//               <div className="success-message">
//                 <h3>🎉 Usuario registrado correctamente</h3>
//                 <p>¡Bienvenido, {firstName}!</p>
//               </div>
//             ) : forgotPassword ? (
//               <form className="auth-form p-2">
//                 <div className="form-group p-3">
//                   <label>Introduce tu correo electrónico</label>
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={resetEmail}
//                     onChange={(e) => setResetEmail(e.target.value)}
//                     autoComplete="email"
//                   />
//                 </div>
//                 <div className="container-btn-submit">
//                   <button
//                     className="btn-submit"
//                     onClick={handleRequestPasswordReset}
//                     disabled={loading}
//                   >
//                     Enviar enlace
//                   </button>
//                   <button
//                     className="btn-link mt-2"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setForgotPassword(false);
//                       setMessage("");
//                       setError(null);
//                     }}
//                   >
//                     ← Volver al inicio de sesión
//                   </button>
//                 </div>
//                 {error && <div className="error-message">{error}</div>}
//                 {message && <div className="success-message">{message}</div>}
//                 {loading && <Loader message={loadingMessage} />}
//               </form>
//             ) : modalType === "signup" ? (
//               <form className="auth-form p-4">
//                 <div className="form-row row">
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Nombre <span>*</span></label>
//                     <input
//                       type="text"
//                       className={fieldErrors.firstName ? "input-error" : ""}
//                       value={firstName}
//                       onChange={(e) => {
//                         setFirstName(e.target.value);
//                         if (fieldErrors.firstName && e.target.value.trim()) {
//                           setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
//                         }
//                       }}
//                       placeholder=""
//                     />
//                     {fieldErrors.firstName && <div className="form-error">{fieldErrors.firstName}</div>}
//                   </div>
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Apellido <span>*</span></label>
//                     <input
//                       type="text"
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       placeholder=""
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row row">
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Nombre de Usuario <span>*</span></label>
//                     <input
//                       type="text"
//                       className={fieldErrors.username ? "input-error" : ""}
//                       value={username}
//                       onChange={(e) => {
//                         setUsername(e.target.value);
//                         if (fieldErrors.username && e.target.value.trim()) {
//                           setFieldErrors((prev) => ({ ...prev, username: undefined }));
//                         }
//                       }}
//                       placeholder=""
//                     />
//                     {fieldErrors.username && <div className="form-error">{fieldErrors.username}</div>}
//                   </div>

//                   <div className="form-group col-md-6 mb-4">
//                     <label htmlFor="phonePrefix">Teléfono <span>*</span></label>
//                     <div className="phone-wrapper" style={{ display: 'flex', gap: '10px' }}>
//                       <select
//                         className="form-control prefix-select"
//                         value={prefix}
//                         onChange={(e) => setPrefix(e.target.value)}
//                       >
//                         {prefixOptions.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {prefix === option.value ? option.value : option.label}
//                           </option>
//                         ))}
//                       </select>

//                       <input
//                         type="text"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         placeholder="Phone number"
//                         className="form-control phone-input"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-row row">
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Empresa <span>*</span></label>
//                     <input
//                       type="text"
//                       className={fieldErrors.company ? "input-error" : ""}
//                       value={company}
//                       onChange={(e) => {
//                         setCompany(e.target.value);
//                         if (fieldErrors.company && e.target.value.trim()) {
//                           setFieldErrors((prev) => ({ ...prev, company: undefined }));
//                         }
//                       }}
//                       placeholder=""
//                     />
//                     {fieldErrors.company && <div className="form-error">{fieldErrors.company}</div>}
//                   </div>
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Nombre profesional <span>*</span></label>
//                     <input
//                       type="text"
//                       className={fieldErrors.job ? "input-error" : ""}
//                       value={job}
//                       onChange={(e) => {
//                         setJob(e.target.value);
//                         if (fieldErrors.job && e.target.value.trim()) {
//                           setFieldErrors((prev) => ({ ...prev, job: undefined }));
//                         }
//                       }}
//                       placeholder=""
//                     />
//                     {fieldErrors.job && <div className="form-error">{fieldErrors.job}</div>}
//                   </div>
//                 </div>

//                 <div className="form-row row">
//                   <div className="form-group col-md-4 mb-4">
//                     <label>País <span>*</span></label>
//                     <select
//                       className={`form-control ${fieldErrors.country ? "input-error" : ""}`}
//                       value={selectedCountry}
//                       onChange={(e) => {
//                         setSelectedCountry(e.target.value);
//                         if (fieldErrors.country && e.target.value) {
//                           setFieldErrors((prev) => ({ ...prev, country: undefined }));
//                         }
//                       }}
//                     >
//                       <option value="">Selecciona país</option>
//                       {countriesList.map((c) => (
//                         <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
//                       ))}
//                     </select>
//                     {fieldErrors.country && <div className="form-error">{fieldErrors.country}</div>}
//                   </div>
//                   <div className="form-group col-md-4 mb-4">
//                     <label>Provincia<span>*</span></label>
//                     <select
//                       className={`form-control ${fieldErrors.state ? "input-error" : ""}`}
//                       value={selectedState}
//                       onChange={(e) => {
//                         setSelectedState(e.target.value);
//                         if (fieldErrors.state && e.target.value) {
//                           setFieldErrors((prev) => ({ ...prev, state: undefined }));
//                         }
//                       }}
//                       disabled={!statesList.length}
//                     >
//                       <option value="">Selecciona estado</option>
//                       {statesList.map((s) => (
//                         <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
//                       ))}
//                     </select>
//                     {fieldErrors.state && <div className="form-error">{fieldErrors.state}</div>}
//                   </div>
//                   <div className="form-group col-md-4 mb-4">
//                     <label>Ciudad <span>*</span></label>
//                     <select
//                       className="form-control"
//                       value={selectedCity}
//                       onChange={(e) => setSelectedCity(e.target.value)}
//                       disabled={!citiesList.length}
//                     >
//                       <option value="">Select City</option>
//                       {citiesList.map((c) => (
//                         <option key={c.name} value={c.name}>{c.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-group mb-4">
//                   <label>Email <span>*</span></label>
//                   <input
//                     type="email"
//                     className={fieldErrors.email ? "input-error" : ""}
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       if (fieldErrors.email && e.target.value.trim()) {
//                         setFieldErrors((prev) => ({ ...prev, email: undefined }));
//                       }
//                     }}
//                     placeholder=""
//                   />
//                   {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
//                 </div>

//                 <div className="form-row row d-flex">
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Contraseña <span>*</span></label>
//                     <div className="input-wrapper">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         className={fieldErrors.password ? "input-error" : ""}
//                         autoComplete="new-password"
//                         value={password}
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                           if (fieldErrors.password && e.target.value.trim()) {
//                             setFieldErrors((prev) => ({ ...prev, password: undefined }));
//                           }
//                         }}
//                         placeholder=""
//                       />
//                       <i
//                         className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
//                         onClick={() => setShowPassword((prev) => !prev)}
//                       ></i>
//                     </div>
//                     {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
//                   </div>
//                   <div className="form-group col-md-6 mb-4">
//                     <label>Repite contraseña <span>*</span></label>
//                     <div className="input-wrapper">
//                       <input
//                         type={showRepeatPassword ? "text" : "password"}
//                         className={fieldErrors.repeatPassword ? "input-error" : ""}
//                         autoComplete="new-password"
//                         value={repeatPassword}
//                         onChange={(e) => {
//                           setRepeatPassword(e.target.value);
//                           if (fieldErrors.repeatPassword && e.target.value.trim()) {
//                             setFieldErrors((prev) => ({ ...prev, repeatPassword: undefined }));
//                           }
//                         }}
//                         placeholder=""
//                       />
//                       <i
//                         className={`bi ${showRepeatPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
//                         onClick={() => setShowRepeatPassword((prev) => !prev)}
//                       ></i>
//                     </div>
//                     {fieldErrors.repeatPassword && <div className="form-error">{fieldErrors.repeatPassword}</div>}
//                   </div>
//                 </div>
//               </form>
//             ) : modalType === "login" ? (
//               <>
//                 <form className="auth-form p-2">
//                   <div className="form-group p-3">
//                     <label>Email <span>*</span></label>
//                     <input
//                       type="email"
//                       className={fieldErrors.email ? "input-error" : ""}
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         if (fieldErrors.email && e.target.value.trim()) {
//                           setFieldErrors((prev) => ({ ...prev, email: undefined }));
//                         }
//                       }}
//                       autoComplete="email"
//                     />
//                     {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
//                   </div>
//                   <div className="form-group p-3">
//                     <label>Contraseña <span>*</span></label>
//                     <div className="input-wrapper">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         className={fieldErrors.password ? "input-error" : ""}
//                         value={password}
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                           if (fieldErrors.password && e.target.value.trim()) {
//                             setFieldErrors((prev) => ({ ...prev, password: undefined }));
//                           }
//                         }}
//                         autoComplete="current-password"
//                       />
//                       <i
//                         className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
//                         onClick={() => setShowPassword((prev) => !prev)}
//                       ></i>
//                       {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
//                     </div>
//                   </div>
//                 </form>
//                 <button
//                   className="btn-link mt-2"
//                   onClick={() => {
//                     setForgotPassword(true);
//                     setMessage("");
//                     setError(null);
//                   }}
//                 >
//                   ¿Has olvidado tú contraseña?
//                 </button>
//               </>
//             ) : null}

//             {userExists && (
//               <p className="error-message">
//                 ⚠️ La cuenta ya existe.{" "}
//                 <button
//                   onClick={() => {
//                     setModalType("login");
//                     setUserExists(false);
//                     setError(null);
//                     setMessage("");
//                     setFieldErrors({});
//                   }}
//                   className="btn-link"
//                 >
//                   Login here
//                 </button>
//               </p>
//             )}
//             {error && (
//               <div className="error-message">
//                 {error.split("\n").map((msg, index) => (
//                   <div key={index}>{msg}</div>
//                 ))}
//               </div>
//             )}
//             {!forgotPassword && (
//               <div className="container-btn-submit">
//                 <button className="btn-submit" onClick={handleAuth} disabled={loading}>
//                   {modalType === "login" ? "Entrar" : "Registrarse"}
//                 </button>
//               </div>
//             )}
//             {loading && <Loader message={loadingMessage} />}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthModal;





import { useEffect, useState } from "react";
import "../login/styles/authModal.scss";
import { useAuth } from "../../../context/authProviderContext";
import { AuthError } from "../../../utils/AuthError";
import Loader from "../loader/loader";
import { Country, State, City } from "country-state-city";

const prefixOptions = [
  { value: '+34', label: '+34 (Spain)' },
  { value: '+1', label: '+1 (USA)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+49', label: '+49 (Germany)' },
  { value: '+33', label: '+33 (France)' },
];

function isStrongPassword(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

const AuthModal = ({ modalType, setModalType, preloadedEmail }) => {
  // --------- ESTADOS ---------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Procesando...");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // ✅ NUEVO: Estado para conflicto de sesión
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictCredentials, setConflictCredentials] = useState({ email: '', password: '' });

  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("ES");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [prefix, setPrefix] = useState('+34');
  const fullPhoneNumber = `${prefix}${phone}`;

  // --------- ESTADOS PARA RESET POR LINK ---------
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetEmailFromUrl, setResetEmailFromUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  // ✅ ACTUALIZADO: Usar funciones del context actualizado
  const { 
    login, 
    forceLogin, 
    register: registerFromContext,
    requestPasswordReset, 
    verifyResetToken, 
    resetPassword 
  } = useAuth();

  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  // Pre-cargar el email si es login
  useEffect(() => {
    if (modalType === "login" && preloadedEmail) {
      setEmail(preloadedEmail);
    }
  }, [modalType, preloadedEmail]);

  // Cargar países al iniciar
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountriesList(allCountries);
  }, []);

  // Cargar estados y limpiar ciudad cuando cambia país
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry);
      setStatesList(states);
      setSelectedState(states[0]?.isoCode || "");
    } else {
      setStatesList([]);
      setSelectedState("");
    }
    setCitiesList([]);
    setSelectedCity("");
  }, [selectedCountry]);

  // Cargar ciudades cuando cambia estado
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState);
      setCitiesList(cities);
      setSelectedCity(cities[0]?.name || "");
    } else {
      setCitiesList([]);
      setSelectedCity("");
    }
  }, [selectedCountry, selectedState]);

  // ✅ ACTUALIZADO: Detectar reset por enlace usando funciones del context
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    
    if (token && emailParam) {
      setIsResetPasswordMode(true);
      setResetToken(token);
      setResetEmailFromUrl(emailParam);
      setModalType("reset-password");
      
      // Verificar token usando función del context
      const verifyTokenAsync = async () => {
        try {
          await verifyResetToken(token, emailParam);
        } catch (err) {
          setError(err.message || 'Token inválido o expirado');
          setIsResetPasswordMode(false);
          setModalType("login");
        }
      };
      
      verifyTokenAsync();
    }
  }, [setModalType, verifyResetToken]);

  // ✅ ACTUALIZADO: Función de login con manejo de conflictos
  const handleLogin = async () => {
    const loginErrors = {};

    if (!email) {
      loginErrors.email = "Please complete this required field.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      loginErrors.email = "Invalid email address.";
    }
    if (!password) {
      loginErrors.password = "Please complete this required field.";
    }
    
    if (Object.keys(loginErrors).length > 0) {
      setFieldErrors(loginErrors);
      setError("Please fill all required fields.");
      return;
    }

    try {
      const result = await login(email.trim(), password.trim());

      // ⚠️ NUEVO: Verificar si hay conflicto de sesión
      if (result && result.conflict) {
        setConflictCredentials({ email: email.trim(), password: password.trim() });
        setShowConflictModal(true);
        return;
      }

      // Si hay warning de modo offline
      if (result && result._warning) {
        console.warn('⚠️ Modo offline:', result._warning);
      }

      setMessage("✅ Logged in successfully.");
      setFieldErrors({});
      setError(null);
      setTimeout(() => setModalType(null), 2000);
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof AuthError) {
        setError(`${err.getFriendlyMessage()}`);
      } else if (typeof err.message === "string") {
        setError(`${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // ✅ NUEVO: Función para force login (cerrar otras sesiones)
  const handleForceLogin = async () => {
    setError(null);
    setLoading(true);
    setLoadingMessage("Cerrando otras sesiones...");

    try {
      await forceLogin(conflictCredentials.email, conflictCredentials.password);

      setShowConflictModal(false);
      setMessage("✅ Logged in successfully.");
      setFieldErrors({});
      setError(null);
      setTimeout(() => setModalType(null), 2000);
    } catch (err) {
      console.error("Force login error:", err);
      setShowConflictModal(false);
      if (err instanceof AuthError) {
        setError(`${err.getFriendlyMessage()}`);
      } else {
        setError(err.message || "Error al forzar inicio de sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVO: Cancelar force login
  const handleCancelForceLogin = () => {
    setShowConflictModal(false);
    setConflictCredentials({ email: '', password: '' });
    setPassword('');
  };

  // --------- FUNCIÓN DE REGISTRO ---------
  const handleRegister = async () => {
    const newErrors = {};
    const generalErrors = [];

    if (!firstName) newErrors.firstName = "Please complete this required field.";
    if (!username) newErrors.username = "Please complete this required field.";
    if (!company) newErrors.company = "Please complete this required field.";
    if (!job) newErrors.job = "Please complete this required field.";

    if (!email) {
      newErrors.email = "Please complete this required field.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      generalErrors.push(" Invalid email format.");
    }
    if (!password) {
      newErrors.password = "Please complete this required field.";
    } else if (!isStrongPassword(password)) {
      generalErrors.push(
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }
    
    if (!repeatPassword) {
      newErrors.repeatPassword = "Please complete this required field.";
    }
    
    if (password && repeatPassword && password !== repeatPassword) {
      generalErrors.push("Passwords do not match.");
    }
    if (!selectedCountry) newErrors.country = "Please complete this required field.";
    if (!selectedState) newErrors.state = "Please complete this required field.";

    if (Object.keys(newErrors).length > 0 || generalErrors.length > 0) {
      setFieldErrors(newErrors);
      const errorsToShow = [];
      if (Object.keys(newErrors).length > 0) {
        errorsToShow.push("Please fill all required fields.");
      }
      if (generalErrors.length > 0) {
        errorsToShow.push(...generalErrors);
      }
      setError(errorsToShow.join("\n"));
      return;
    }

    try {
      console.log("🔍 FRONTEND - Datos que se envían:", {
        email,
        username, 
        password: "***",
        selectedCountry,
        selectedState,
        selectedCity,
        job,
      });

      // ✅ ACTUALIZADO: Usar la función del context que maneja todo automáticamente
      await registerFromContext({
        email,
        username,
        password,
        firstName,
        lastName,
        phone: fullPhoneNumber,
        company,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        job,
      });

      setMessage("✅ Usuario registrado y logueado con éxito.");
      setSuccess(true);
      setFieldErrors({});
      setError(null);
      setTimeout(() => {
        setModalType(null);
        setSuccess(false);
        setMessage("");
      }, 2000);
    } catch (err) {
      const code = err.code;
      if (code === "email_exists" || code === "username_exists") {
        setUserExists(true);
        setError(null);
      } else {
        setError("🚨 Error al registrar usuario. Puede que ya exista o haya un problema con el servidor.");
        setSuccess(false);
      }
    }
  };

  // --------- FUNCIÓN PRINCIPAL DE AUTH ---------
  const handleAuth = async () => {
    setError(null);
    setMessage("");
    setSuccess(false);
    setUserExists(false);
    setLoading(true);

    setLoadingMessage(
      modalType === "signup"
        ? "Registrando usuario..."
        : modalType === "login"
        ? "Verificando usuario..."
        : "Procesando..."
    );

    try {
      if (modalType === "login") {
        await handleLogin();
      } else if (modalType === "signup") {
        await handleRegister();
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACTUALIZADO: Función para reset password usando context
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);

    if (!newPassword || !repeatNewPassword) {
      setError("Please complete all fields.");
      setLoading(false);
      return;
    }
    if (newPassword !== repeatNewPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError("Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(resetToken, resetEmailFromUrl, newPassword);
      
      setMessage("✅ Password updated successfully. You can now log in.");
      setTimeout(() => {
        setModalType("login");
        setIsResetPasswordMode(false);
        setNewPassword("");
        setRepeatNewPassword("");
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACTUALIZADO: Función para solicitar reset usando context
  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);
    setLoadingMessage("Enviando correo...");

    if (!resetEmail) {
      setError("Por favor ingresa tu correo.");
      setLoading(false);
      return;
    }

    try {
      await requestPasswordReset(resetEmail, 'web');
      
      setMessage("✅ Si tu email existe, recibirás instrucciones para resetear tu contraseña.");
      setResetEmail("");
    } catch (err) {
      setError(err.message || "🚨 Hubo un error.");
    } finally {
      setLoading(false);
    }
  };

  // --------- RENDER ---------
  return (
    <div className="modal-overlay" onClick={() => setModalType(null)}>
      <div className={`modal-content ${loading ? "blurred" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* ----------- FORMULARIO DE RESET-PASSWORD ----------- */}
        {modalType === "reset-password" && isResetPasswordMode && (
          <form className="auth-form p-2">
            <div className="modal-header d-flex justify-content-center">
              <h2>Crear nueva contraseña</h2>
              <button className="btn-close" onClick={() => {
                setModalType(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}>❌</button>
            </div>
            <div className="form-group p-3">
              <label>Nueva contraseña</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
                  onClick={() => setShowPassword((prev) => !prev)}
                ></i>
              </div>
            </div>
            <div className="form-group p-3">
              <label>Repetir nueva contraseña</label>
              <div className="input-wrapper">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatNewPassword}
                  onChange={e => setRepeatNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <i
                  className={`bi ${showRepeatPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
                  onClick={() => setShowRepeatPassword((prev) => !prev)}
                ></i>
              </div>
            </div>
            <div className="container-btn-submit">
              <button
                className="btn-submit"
                onClick={handleResetPassword}
                disabled={loading}
              >
                Cambiar contraseña
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            {loading && <Loader message={loadingMessage} />}
          </form>
        )}

        {/* ----------- FLUJO NORMAL: LOGIN, SIGNUP, FORGOT ----------- */}
        {!isResetPasswordMode && modalType !== "reset-password" && (
          <>
            <div className="modal-header d-flex justify-content-center">
              <h2>
                {forgotPassword
                  ? "Restablecer Contraseña"
                  : modalType === "login"
                  ? "Iniciar sesión con OLAWEE"
                  : "Regístrate en OLAWEE"}
              </h2>
              <button className="btn-close" onClick={() => setModalType(null)}>❌</button>
            </div>

            {message && <p className="success-message">{message}</p>}

            {success ? (
              <div className="success-message">
                <h3>🎉 Usuario registrado correctamente</h3>
                <p>¡Bienvenido, {firstName}!</p>
              </div>
            ) : forgotPassword ? (
              <form className="auth-form p-2">
                <div className="form-group p-3">
                  <label>Introduce tu correo electrónico</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="container-btn-submit">
                  <button
                    className="btn-submit"
                    onClick={handleRequestPasswordReset}
                    disabled={loading}
                  >
                    Enviar enlace
                  </button>
                  <button
                    className="btn-link mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPassword(false);
                      setMessage("");
                      setError(null);
                    }}
                  >
                    ← Volver al inicio de sesión
                  </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                {loading && <Loader message={loadingMessage} />}
              </form>
            ) : modalType === "signup" ? (
              <form className="auth-form p-4">
                <div className="form-row row">
                  <div className="form-group col-md-6 mb-4">
                    <label>Nombre <span>*</span></label>
                    <input
                      type="text"
                      className={fieldErrors.firstName ? "input-error" : ""}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (fieldErrors.firstName && e.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
                        }
                      }}
                      placeholder=""
                    />
                    {fieldErrors.firstName && <div className="form-error">{fieldErrors.firstName}</div>}
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label>Apellido <span>*</span></label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="form-row row">
                  <div className="form-group col-md-6 mb-4">
                    <label>Nombre de Usuario <span>*</span></label>
                    <input
                      type="text"
                      className={fieldErrors.username ? "input-error" : ""}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (fieldErrors.username && e.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, username: undefined }));
                        }
                      }}
                      placeholder=""
                    />
                    {fieldErrors.username && <div className="form-error">{fieldErrors.username}</div>}
                  </div>

                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="phonePrefix">Teléfono <span>*</span></label>
                    <div className="phone-wrapper" style={{ display: 'flex', gap: '10px' }}>
                      <select
                        className="form-control prefix-select"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                      >
                        {prefixOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {prefix === option.value ? option.value : option.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        className="form-control phone-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row row">
                  <div className="form-group col-md-6 mb-4">
                    <label>Empresa <span>*</span></label>
                    <input
                      type="text"
                      className={fieldErrors.company ? "input-error" : ""}
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (fieldErrors.company && e.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, company: undefined }));
                        }
                      }}
                      placeholder=""
                    />
                    {fieldErrors.company && <div className="form-error">{fieldErrors.company}</div>}
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label>Nombre profesional <span>*</span></label>
                    <input
                      type="text"
                      className={fieldErrors.job ? "input-error" : ""}
                      value={job}
                      onChange={(e) => {
                        setJob(e.target.value);
                        if (fieldErrors.job && e.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, job: undefined }));
                        }
                      }}
                      placeholder=""
                    />
                    {fieldErrors.job && <div className="form-error">{fieldErrors.job}</div>}
                  </div>
                </div>

                <div className="form-row row">
                  <div className="form-group col-md-4 mb-4">
                    <label>País <span>*</span></label>
                    <select
                      className={`form-control ${fieldErrors.country ? "input-error" : ""}`}
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        if (fieldErrors.country && e.target.value) {
                          setFieldErrors((prev) => ({ ...prev, country: undefined }));
                        }
                      }}
                    >
                      <option value="">Selecciona país</option>
                      {countriesList.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                    {fieldErrors.country && <div className="form-error">{fieldErrors.country}</div>}
                  </div>
                  <div className="form-group col-md-4 mb-4">
                    <label>Provincia<span>*</span></label>
                    <select
                      className={`form-control ${fieldErrors.state ? "input-error" : ""}`}
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        if (fieldErrors.state && e.target.value) {
                          setFieldErrors((prev) => ({ ...prev, state: undefined }));
                        }
                      }}
                      disabled={!statesList.length}
                    >
                      <option value="">Selecciona estado</option>
                      {statesList.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                    {fieldErrors.state && <div className="form-error">{fieldErrors.state}</div>}
                  </div>
                  <div className="form-group col-md-4 mb-4">
                    <label>Ciudad <span>*</span></label>
                    <select
                      className="form-control"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!citiesList.length}
                    >
                      <option value="">Select City</option>
                      {citiesList.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label>Email <span>*</span></label>
                  <input
                    type="email"
                    className={fieldErrors.email ? "input-error" : ""}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email && e.target.value.trim()) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder=""
                  />
                  {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
                </div>

                <div className="form-row row d-flex">
                  <div className="form-group col-md-6 mb-4">
                    <label>Contraseña <span>*</span></label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={fieldErrors.password ? "input-error" : ""}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password && e.target.value.trim()) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder=""
                      />
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
                        onClick={() => setShowPassword((prev) => !prev)}
                      ></i>
                    </div>
                    {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label>Repite contraseña <span>*</span></label>
                    <div className="input-wrapper">
                      <input
                        type={showRepeatPassword ? "text" : "password"}
                        className={fieldErrors.repeatPassword ? "input-error" : ""}
                        autoComplete="new-password"
                        value={repeatPassword}
                        onChange={(e) => {
                          setRepeatPassword(e.target.value);
                          if (fieldErrors.repeatPassword && e.target.value.trim()) {
                            setFieldErrors((prev) => ({ ...prev, repeatPassword: undefined }));
                          }
                        }}
                        placeholder=""
                      />
                      <i
                        className={`bi ${showRepeatPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
                        onClick={() => setShowRepeatPassword((prev) => !prev)}
                      ></i>
                    </div>
                    {fieldErrors.repeatPassword && <div className="form-error">{fieldErrors.repeatPassword}</div>}
                  </div>
                </div>
              </form>
            ) : modalType === "login" ? (
              <>
                <form className="auth-form p-2">
                  <div className="form-group p-3">
                    <label>Email <span>*</span></label>
                    <input
                      type="email"
                      className={fieldErrors.email ? "input-error" : ""}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email && e.target.value.trim()) {
                          setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      autoComplete="email"
                    />
                    {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
                  </div>
                  <div className="form-group p-3">
                    <label>Contraseña <span>*</span></label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={fieldErrors.password ? "input-error" : ""}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password && e.target.value.trim()) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        autoComplete="current-password"
                      />
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-visibility`}
                        onClick={() => setShowPassword((prev) => !prev)}
                      ></i>
                      {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
                    </div>
                  </div>
                </form>
                <button
                  className="btn-link mt-2"
                  onClick={() => {
                    setForgotPassword(true);
                    setMessage("");
                    setError(null);
                  }}
                >
                  ¿Has olvidado tú contraseña?
                </button>
              </>
            ) : null}

            {userExists && (
              <p className="error-message">
                ⚠️ La cuenta ya existe.{" "}
                <button
                  onClick={() => {
                    setModalType("login");
                    setUserExists(false);
                    setError(null);
                    setMessage("");
                    setFieldErrors({});
                  }}
                  className="btn-link"
                >
                  Login here
                </button>
              </p>
            )}
            {error && (
              <div className="error-message">
                {error.split("\n").map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
            )}
            {!forgotPassword && (
              <div className="container-btn-submit">
                <button className="btn-submit" onClick={handleAuth} disabled={loading}>
                  {modalType === "login" ? "Entrar" : "Registrarse"}
                </button>
              </div>
            )}
            {loading && <Loader message={loadingMessage} />}
          </>
        )}

        {/* ✅ NUEVO: Modal de Conflicto de Sesión */}
        {showConflictModal && (
          <div className="conflict-modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="conflict-modal">
              <h3>⚠️ Sesión Activa Detectada</h3>
              <p>Ya existe una sesión activa en otro navegador o dispositivo.</p>
              <p>¿Deseas cerrar la sesión anterior e iniciar sesión aquí?</p>
              <div className="conflict-modal-actions">
                <button
                  onClick={handleCancelForceLogin}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForceLogin}
                  className="btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Cerrando sesión...' : 'Sí, iniciar sesión aquí'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;