
// import axios from "axios";
// import { useAuth } from "../../../context/authProviderContext";
// import "../sections/styles/profile.scss";
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import SmartInput from "../../../components/globalComponents/smartInput/smartInput";

// // Instancia de axios
// const api = axios.create({
//   baseURL: "https://api.olawee.com/wp-json"
// });
// api.interceptors.request.use(config => {
//   const token = sessionStorage.getItem("jwt_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Función para extraer valores de diferentes campos
// const getFieldValue = (source, fieldNames, defaultValue = "") => {
//   if (!source) return defaultValue;
//   const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
//   for (const name of names) {
//     if (source[name] !== undefined && source[name] !== null && source[name] !== '') {
//       return source[name];
//     }
//   }
//   return defaultValue;
// };

// // Componente de input de contraseña con toggle
// const PasswordInput = ({ label, value, onChange, required = false, placeholder = "", minLength }) => {
//   const [show, setShow] = useState(false);
//   return (
//     <div className="form-row">
//       <label>{label} {required && <span className="required">*</span>}</label>
//       <div className="password-input-container">
//         <input
//           type={show ? "text" : "password"}
//           value={value}
//           onChange={onChange}
//           required={required}
//           placeholder={placeholder}
//           minLength={minLength}
//           className="password-input"
//         />
//         <button
//           type="button"
//           className="password-toggle-btn"
//           onClick={e => { e.preventDefault(); setShow(!show); }}
//           aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
//         >
//           <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} toggle-visibility`} />
//         </button>
//       </div>
//       {minLength && <small>Mínimo {minLength} caracteres</small>}
//     </div>
//   );
// };

// const Profile = () => {
//   const { user: authUser, setUser: updateAuthUser, refreshUserData } = useAuth();

//   const [formData, setFormData] = useState({
//     first_name: "", last_name: "", email: "",
//     phone: "", company: "", country: "",
//     state: "", city: "", job: "",
//   });
//   const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "", confirm_password: "" });
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [saveStatus, setSaveStatus] = useState("");
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [passwordMessage, setPasswordMessage] = useState("");
//   const [passwordStatus, setPasswordStatus] = useState("");

//   const isNewRegistration = useRef(sessionStorage.getItem("new_registration") === "true");
//   const dataInitialized = useRef(false);

//   // ✅ CARGAR DATOS DESDE CACHE LOCAL (localStorage/contexto)
//   const loadFromCache = useCallback(() => {
//     console.log("🔍 Intentando cargar datos desde cache local...");
    
//     let userData = null;
    
//     // 1. Priorizar contexto de autenticación si está disponible
//     if (authUser && authUser.email) {
//       userData = authUser;
//       console.log("✅ Datos encontrados en contexto de auth");
//     }
    
//     // 2. Si no hay contexto, usar localStorage
//     if (!userData) {
//       try {
//         const storedData = localStorage.getItem("user_data");
//         if (storedData && storedData !== "null") {
//           const parsedData = JSON.parse(storedData);
//           if (parsedData && parsedData.email) {
//             userData = parsedData;
//             console.log("✅ Datos encontrados en localStorage");
//           }
//         }
//       } catch (error) {
//         console.error("❌ Error al leer localStorage:", error);
//       }
//     }
    
//     if (!userData) {
//       console.log("❌ No se encontraron datos en cache local");
//       return false;
//     }
    
//     // 3. Mapear datos al formulario
//     const mappedData = {
//       first_name: getFieldValue(userData, ['firstName', 'first_name']),
//       last_name: getFieldValue(userData, ['lastName', 'last_name']),
//       email: userData.email || "",
//       phone: getFieldValue(userData, ['phone']),
//       company: getFieldValue(userData, ['company']),
//       country: getFieldValue(userData, ['country']),
//       state: getFieldValue(userData, ['state']),
//       city: getFieldValue(userData, ['city']),
//       job: getFieldValue(userData, ['job']),
//     };
    
//     // 4. Verificar si tenemos datos completos
//     const requiredFields = ['first_name', 'last_name', 'email'];
//     const optionalFields = ['phone', 'company', 'country', 'state', 'city', 'job'];
    
//     const hasRequiredFields = requiredFields.every(field => mappedData[field]?.trim());
//     const hasOptionalFields = optionalFields.some(field => mappedData[field]?.trim());
    
//     if (hasRequiredFields) {
//       console.log("✅ Datos básicos cargados desde cache");
//       setFormData(mappedData);
//       setIsLoading(false);
//       dataInitialized.current = true;
      
//       // Si faltan datos opcionales, retornar false para cargar desde servidor
//       if (!hasOptionalFields) {
//         console.log("⚠️ Faltan algunos datos opcionales, se recomienda cargar desde servidor");
//         return false;
//       }
      
//       console.log("✅ Todos los datos están completos");
//       return true;
//     }
    
//     console.log("❌ Faltan datos básicos requeridos");
//     return false;
//   }, [authUser]);

//   // ✅ FETCH DEL SERVIDOR (solo cuando es necesario)
//   const fetchUserProfile = useCallback(async (force = false) => {
//     if (!force) {
//       console.log("🌐 Cargando perfil desde servidor...");
//     } else {
//       console.log("🔄 Forzando recarga desde servidor...");
//     }
    
//     try {
//       setIsLoading(true);
//       const { data } = await api.get("/custom-api/validate");
      
//       if (!data.success) {
//         throw new Error("No se pudo obtener el perfil");
//       }
      
//       const user = data.user;
//       console.log("✅ Datos recibidos del servidor:", user);
      
//       // Actualizar formulario
//       const newFormData = {
//         first_name: user.first_name || "",
//         last_name: user.last_name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         company: user.company || "",
//         country: user.country || "",
//         state: user.state || "",
//         city: user.city || "",
//         job: user.job || "",
//       };
      
//       setFormData(newFormData);
      
//       // Actualizar contexto y localStorage
//       const completeUser = {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         phone: user.phone,
//         company: user.company,
//         country: user.country,
//         state: user.state,
//         city: user.city,
//         job: user.job,
//       };
      
//       localStorage.setItem("user_data", JSON.stringify(completeUser));
//       updateAuthUser?.(completeUser);
      
//       console.log("✅ Datos actualizados en cache local");
//       dataInitialized.current = true;
      
//     } catch (err) {
//       console.error("❌ Error al obtener perfil desde servidor:", err);
//       setHasError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [updateAuthUser]);

//   // ✅ ESTRATEGIA DE CARGA INTELIGENTE
//   const initializeProfile = useCallback(async () => {
//     // Si ya inicializamos, no hacer nada
//     if (dataInitialized.current) {
//       console.log("ℹ️ Datos ya inicializados, omitiendo carga");
//       return;
//     }
    
//     // Caso especial: registro nuevo
//     if (isNewRegistration.current) {
//       console.log("🆕 Usuario recién registrado, cargando desde servidor");
//       await refreshUserData?.();
//       await fetchUserProfile(true);
//       sessionStorage.removeItem("new_registration");
//       isNewRegistration.current = false;
//       return;
//     }
    
//     // Estrategia normal: cache primero, servidor si es necesario
//     console.log("🚀 Iniciando carga inteligente de perfil...");
    
//     const cacheLoaded = loadFromCache();
    
//     if (!cacheLoaded) {
//       console.log("📡 Cache incompleto, cargando desde servidor...");
//       await fetchUserProfile();
//     } else {
//       console.log("⚡ Datos cargados desde cache exitosamente");
//     }
//   }, [loadFromCache, fetchUserProfile, refreshUserData]);

//   // ✅ FORZAR RECARGA MANUAL
//   const handleForceReload = useCallback(async () => {
//     console.log("🔄 Recarga manual solicitada");
//     dataInitialized.current = false; // Reset para permitir nueva carga
//     await refreshUserData?.();
//     await fetchUserProfile(true);
//   }, [refreshUserData, fetchUserProfile]);

//   // ✅ EFECTO DE INICIALIZACIÓN (solo una vez al montar)
//   useEffect(() => {
//     initializeProfile();
//   }, [initializeProfile]); // ✅ Incluimos la dependencia para evitar el warning

//   // ✅ EFECTO PARA ACTUALIZAR CON CAMBIOS DEL CONTEXTO
//   useEffect(() => {
//     // Solo actualizar si ya estamos inicializados y el authUser tiene datos nuevos
//     if (dataInitialized.current && authUser && authUser.email) {
//       console.log("🔄 Actualizando formulario con cambios del contexto auth");
      
//       setFormData(prev => ({
//         first_name: getFieldValue(authUser, ['firstName', 'first_name']) || prev.first_name,
//         last_name: getFieldValue(authUser, ['lastName', 'last_name']) || prev.last_name,
//         email: authUser.email || prev.email,
//         phone: getFieldValue(authUser, ['phone']) || prev.phone,
//         company: getFieldValue(authUser, ['company']) || prev.company,
//         country: getFieldValue(authUser, ['country']) || prev.country,
//         state: getFieldValue(authUser, ['state']) || prev.state,
//         city: getFieldValue(authUser, ['city']) || prev.city,
//         job: getFieldValue(authUser, ['job']) || prev.job,
//       }));
//     }
//   }, [authUser]);

//   // Validaciones
//   const validateFields = () => ['first_name', 'last_name', 'email'].every(f => formData[f]?.trim());
//   const validatePassword = () => {
//     if (!passwordData.current_password) { setPasswordMessage('La contraseña actual es obligatoria'); setPasswordStatus('error'); return false; }
//     if (!passwordData.new_password) { setPasswordMessage('La nueva contraseña es obligatoria'); setPasswordStatus('error'); return false; }
//     if (passwordData.new_password !== passwordData.confirm_password) {
//       setPasswordMessage('Las contraseñas no coinciden'); setPasswordStatus('error'); return false;
//     }
//     if (passwordData.new_password.length < 8) { setPasswordMessage('La contraseña debe tener al menos 8 caracteres'); setPasswordStatus('error'); return false; }
//     return true;
//   };

//   // Guardar perfil
//   const handleSave = async e => {
//     e.preventDefault();
//     if (!validateFields()) { setSaveMessage('Completa los campos requeridos'); setSaveStatus('error'); return; }
//     setIsSaving(true); setSaveMessage(''); setSaveStatus('');
//     try {
//       console.log("💾 Guardando perfil...", formData);
//       const { data } = await api.post("/custom/v1/update-profile", formData);
      
//       if (!data.success) {
//         throw new Error(data.message || 'Error al actualizar perfil');
//       }
      
//       console.log("✅ Perfil guardado exitosamente:", data);
      
//       // ⚡ USAR DATOS DE LA RESPUESTA DIRECTAMENTE (sin petición adicional)
//       if (data.user) {
//         const updatedUser = data.user;
        
//         // Actualizar formulario con datos del servidor
//         const newFormData = {
//           first_name: updatedUser.first_name || "",
//           last_name: updatedUser.last_name || "",
//           email: updatedUser.email || "",
//           phone: updatedUser.phone || "",
//           company: updatedUser.company || "",
//           country: updatedUser.country || "",
//           state: updatedUser.state || "",
//           city: updatedUser.city || "",
//           job: updatedUser.job || "",
//         };
        
//         setFormData(newFormData);
        
//         // Actualizar cache local sin petición adicional
//         const completeUser = {
//           id: updatedUser.id,
//           email: updatedUser.email,
//           username: updatedUser.username,
//           firstName: updatedUser.first_name,
//           lastName: updatedUser.last_name,
//           phone: updatedUser.phone,
//           company: updatedUser.company,
//           country: updatedUser.country,
//           state: updatedUser.state,
//           city: updatedUser.city,
//           job: updatedUser.job,
//         };
        
//         // Actualizar localStorage y contexto
//         localStorage.setItem("user_data", JSON.stringify(completeUser));
//         updateAuthUser?.(completeUser);
        
//         console.log("⚡ Cache actualizado sin petición adicional");
//       }
      
//       setSaveMessage('¡Perfil actualizado correctamente!'); 
//       setSaveStatus('success');
      
//     } catch (err) {
//       console.error("❌ Error al guardar perfil:", err);
//       setSaveMessage(err.response?.data?.message || err.message || 'Error al actualizar perfil');
//       setSaveStatus('error');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Cambiar contraseña
//   const handleChangePassword = async e => {
//     e.preventDefault();
//     if (!validatePassword()) return;
//     setIsChangingPassword(true); setPasswordMessage(''); setPasswordStatus('');
//     try {
//       const { data } = await api.post("/custom/v1/change-password", {
//         current_password: passwordData.current_password,
//         new_password: passwordData.new_password
//       });
//       if (!data.success) throw new Error(data.message);
//       setPasswordMessage('¡Contraseña actualizada!'); setPasswordStatus('success');
//       setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
//     } catch (err) {
//       console.error(err);
//       setPasswordMessage(err.response?.data?.message || 'Error al cambiar contraseña');
//       setPasswordStatus('error');
//     } finally {
//       setIsChangingPassword(false);
//     }
//   };

//   // Cambio de inputs
//   const handleInputChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   // Render loading / error
//   if (isLoading) return (
//     <div className="profile-loading">
//       <div className="loading-spinner"></div>
//       <p>Cargando perfil...</p>
//     </div>
//   );
  
//   if (hasError) return (
//     <div className="profile-error">
//       <i className="bi bi-exclamation-circle"></i>
//       <p>Error cargando perfil.</p>
//       <button onClick={handleForceReload}>Intentar de nuevo</button>
//     </div>
//   );

//   return (
//     <div className="profile-section">
//       <h2>Your Profile</h2>
//       <p>View or edit your personal information.</p>

//       <form className="profile-form" onSubmit={handleSave}>
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="Name"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="Last Name"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
        
//         <div className="form-row">
//           <label>Email <span className="required">*</span></label>
//           <input type="email" value={formData.email} readOnly className="readonly-field" />
//           <small>El email no se puede modificar.</small>
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="tel"
//             as="input"
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             placeholder="+34 623 456 789"
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="Company"
//             name="company"
//             value={formData.company}
//             onChange={handleInputChange}
//             placeholder="Nombre de tu empresa"
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="Country"
//             name="country"
//             value={formData.country}
//             onChange={handleInputChange}
//             placeholder="Ej: España"
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="State/Province"
//             name="state"
//             value={formData.state}
//             onChange={handleInputChange}
//             placeholder="Ej: Madrid"
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="City"
//             name="city"
//             value={formData.city}
//             onChange={handleInputChange}
//             placeholder="Ej: Getafe"
//           />
//         </div>
        
//         <div className="form-row">
//           <SmartInput
//             type="text"
//             as="input"
//             label="Job"
//             name="job"
//             value={formData.job}
//             onChange={handleInputChange}
//             placeholder="Ej: Web Developer"
//           />
//         </div>
        
//         <div className="form-actions">
//           <button type="submit" disabled={isSaving || !validateFields()} className="save-button">
//             {isSaving ? 'Guardando...' : 'Guardar Cambios'}
//           </button>
//           {saveMessage && <div className={`save-message ${saveStatus}`}>{saveMessage}</div>}
//         </div>
//       </form>

//       <div className="password-section">
//         <h3>Change Password</h3>
//         <form className="password-form" onSubmit={handleChangePassword}>
//           <PasswordInput
//             label="Current Password"
//             value={passwordData.current_password}
//             onChange={e => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
//             required
//           />
//           <PasswordInput
//             label="New Password"
//             value={passwordData.new_password}
//             onChange={e => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
//             required
//             minLength={8}
//           />
//           <PasswordInput
//             label="Confirm New Password"
//             value={passwordData.confirm_password}
//             onChange={e => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
//             required
//           />
//           <div className="form-actions">
//             <button
//               type="submit"
//               disabled={isChangingPassword || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
//               className="save-button"
//             >
//               {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
//             </button>
//             {passwordMessage && <div className={`save-message ${passwordStatus}`}>{passwordMessage}</div>}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;




import axios from "axios";
import { useAuth } from "../../../context/authProviderContext";
import "../sections/styles/profile.scss";
import React, { useEffect, useState } from 'react';
import SmartInput from "../../../components/globalComponents/smartInput/smartInput";

// ✅ CORREGIDO: URL base de Olawee
const api = axios.create({
  baseURL: "https://api.olawee.com/wp-json"
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Componente de input de contraseña con toggle
const PasswordInput = ({ label, value, onChange, required = false, placeholder = "", minLength }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="form-row">
      <label>{label} {required && <span className="required">*</span>}</label>
      <div className="password-input-container">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          className="password-input"
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={e => { e.preventDefault(); setShow(!show); }}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} toggle-visibility`} />
        </button>
      </div>
      {minLength && <small>Mínimo {minLength} caracteres</small>}
    </div>
  );
};

const Profile = () => {
  const { user: authUser } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "", 
    last_name: "", 
    email: "",
    phone: "", 
    company: "", 
    country: "",
    state: "", 
    city: "", 
    job: "",
  });

  const [passwordData, setPasswordData] = useState({ 
    current_password: "", 
    new_password: "", 
    confirm_password: "" 
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  // const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  // ✅ SIMPLIFICADO: Cargar datos del contexto de autenticación
  useEffect(() => {
    if (authUser && authUser.email) {
      console.log("✅ Cargando datos del usuario desde contexto:", authUser);
      
      setFormData({
        first_name: authUser.firstName || authUser.first_name || "",
        last_name: authUser.lastName || authUser.last_name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        company: authUser.company || authUser.empresa || "", // empresa del plugin
        country: authUser.country || "",
        state: authUser.state || "",
        city: authUser.city || "",
        job: authUser.job || "",
      });
      
      setIsLoading(false);
    } else {
      // Si no hay datos en el contexto, intentar obtenerlos del servidor
      fetchUserData();
    }
  }, [authUser]);

  // ✅ CORREGIDO: Obtener datos usando endpoint válido
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // ✅ USAR ENDPOINT CORRECTO: /custom-api/validate
      const { data } = await api.get("/custom-api/validate");
      
      if (data.valid && data.user) {
        const user = data.user;
        console.log("✅ Datos recibidos del servidor:", user);
        
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          company: user.empresa || "", // ✅ usar 'empresa' del plugin
          country: user.country || "",
          state: user.state || "",
          city: user.city || "",
          job: user.job || "",
        });
      } else {
        throw new Error("Datos de usuario no válidos");
      }
    } catch (error) {
      console.error("❌ Error al obtener datos del usuario:", error);
      setSaveMessage("Error al cargar los datos del perfil");
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Validaciones
  const validateFields = () => {
    return ['first_name', 'last_name', 'email'].every(field => 
      formData[field]?.trim()
    );
  };

  // ⚠️ COMENTADO: Función no utilizada hasta implementar endpoint de cambio de contraseña
  // const validatePassword = () => {
  //   if (!passwordData.current_password) {
  //     setPasswordMessage('La contraseña actual es obligatoria');
  //     setPasswordStatus('error');
  //     return false;
  //   }
  //   if (!passwordData.new_password) {
  //     setPasswordMessage('La nueva contraseña es obligatoria');
  //     setPasswordStatus('error');
  //     return false;
  //   }
  //   if (passwordData.new_password !== passwordData.confirm_password) {
  //     setPasswordMessage('Las contraseñas no coinciden');
  //     setPasswordStatus('error');
  //     return false;
  //   }
  //   if (passwordData.new_password.length < 8) {
  //     setPasswordMessage('La contraseña debe tener al menos 8 caracteres');
  //     setPasswordStatus('error');
  //     return false;
  //   }
  //   return true;
  // };

  // ⚠️ FUNCIONALIDAD LIMITADA: Tu plugin no tiene endpoint de actualización
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) {
      setSaveMessage('Completa los campos requeridos');
      setSaveStatus('error');
      return;
    }

    // ⚠️ TEMPORAL: Solo actualizar localStorage hasta que implementes el endpoint
    try {
      setIsSaving(true);
      setSaveMessage('');
      setSaveStatus('');

      console.log("⚠️ Actualizando solo en localStorage (endpoint no disponible):", formData);
      
      // Actualizar localStorage
      const updatedUser = {
        ...authUser,
        firstName: formData.first_name,
        lastName: formData.last_name,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        job: formData.job,
      };
      
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      
      setSaveMessage('⚠️ Datos guardados localmente (actualización en servidor pendiente)');
      setSaveStatus('warning');
      
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setSaveMessage('Error al guardar los datos');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // ⚠️ FUNCIONALIDAD NO DISPONIBLE: Endpoint de cambio de contraseña no existe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    setPasswordMessage('⚠️ Funcionalidad de cambio de contraseña no disponible. El endpoint no existe en el plugin actual.');
    setPasswordStatus('warning');
    
    // TODO: Implementar endpoint /custom-api/change-password en el plugin
    return;
  };

  // Cambio de inputs
  const handleInputChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  // Render loading
  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h2>Your Profile</h2>
      <p>View or edit your personal information.</p>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <label>Email <span className="required">*</span></label>
          <input 
            type="email" 
            value={formData.email} 
            readOnly 
            className="readonly-field" 
          />
          <small>El email no se puede modificar.</small>
        </div>
        
        <div className="form-row">
          <SmartInput
            type="tel"
            as="input"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+34 623 456 789"
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Nombre de tu empresa"
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Ej: España"
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Ej: Madrid"
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ej: Getafe"
          />
        </div>
        
        <div className="form-row">
          <SmartInput
            type="text"
            as="input"
            label="Job"
            name="job"
            value={formData.job}
            onChange={handleInputChange}
            placeholder="Ej: Web Developer"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSaving || !validateFields()} 
            className="save-button"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {saveMessage && (
            <div className={`save-message ${saveStatus}`}>
              {saveMessage}
            </div>
          )}
        </div>
      </form>

      <div className="password-section">
        <h3>Change Password</h3>
        <p className="warning-text">
          ⚠️ Esta funcionalidad requiere implementar el endpoint de cambio de contraseña en el plugin.
        </p>
        <form className="password-form" onSubmit={handleChangePassword}>
          <PasswordInput
            label="Current Password"
            value={passwordData.current_password}
            onChange={e => setPasswordData(prev => ({ 
              ...prev, 
              current_password: e.target.value 
            }))}
            required
          />
          <PasswordInput
            label="New Password"
            value={passwordData.new_password}
            onChange={e => setPasswordData(prev => ({ 
              ...prev, 
              new_password: e.target.value 
            }))}
            required
            minLength={8}
          />
          <PasswordInput
            label="Confirm New Password"
            value={passwordData.confirm_password}
            onChange={e => setPasswordData(prev => ({ 
              ...prev, 
              confirm_password: e.target.value 
            }))}
            required
          />
          <div className="form-actions">
            <button
              type="submit"
              disabled={true} // ⚠️ Deshabilitado hasta implementar endpoint
              className="save-button disabled"
            >
              Cambiar Contraseña (No disponible)
            </button>
            {passwordMessage && (
              <div className={`save-message ${passwordStatus}`}>
                {passwordMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;