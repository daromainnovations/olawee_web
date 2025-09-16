
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