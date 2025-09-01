
import { useEffect, useState } from "react";
import "../login/styles/authModal.scss";
import { registerUser } from "../../../services/wooCommerceService";
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

  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("ES"); // España por defecto
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [prefix, setPrefix] = useState('+34');
  const fullPhoneNumber = `${prefix}${phone}`;

  // --------- ESTADOS PARA RESET POR LINK ---------
  const [isSetPasswordMode, setIsSetPasswordMode] = useState(false);
  const [resetKey, setResetKey] = useState("");
  const [resetLogin, setResetLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const { login } = useAuth();

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

  // --------- DETECTAR SI HAY RESET POR ENLACE (key/login en URL) ---------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    const login = params.get("login");
    if (key && login) {
      setIsSetPasswordMode(true);
      setResetKey(key);
      setResetLogin(login);
      setModalType("set-new-password");
    }
  }, [setModalType]);

  // --------- FUNCIÓN PRINCIPAL DE LOGIN/REGISTRO ---------
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

    if (modalType === "login") {
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
        setLoading(false);
        return;
      }
      try {
        await login(email.trim(), password.trim());

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
      } finally {
        setLoading(false);
      }
      return;
    }

    // REGISTRO
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
      setLoading(false);
      return;
    }

    // REGISTRO y LOGIN AUTOMÁTICO
    try {
      await registerUser(email, username, password, {
        first_name: firstName,
        last_name: lastName,
        phone: fullPhoneNumber,
        company: company,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        job: job,
      });

      await login(username, password);

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
      const code = err.response?.data?.code;
      if (code === "email_exists" || code === "username_exists") {
        setUserExists(true);
        setError(null);
      } else {
        setError("🚨 Error al registrar usuario. Puede que ya exista o haya un problema con WooCommerce.");
        setSuccess(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------- FUNCIÓN PARA RESET PASSWORD DESDE ENLACE (SET-NEW-PASSWORD) ---------
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);

    // Validaciones
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
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/custom/v1/set-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: resetKey,
            login: resetLogin,
            password: newPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password updated. You can now log in.");
        setTimeout(() => {
          setModalType("login");
          setIsSetPasswordMode(false);
          setNewPassword("");
          setRepeatNewPassword("");
        }, 2000);
      } else {
        setError(data.message || "Error resetting password.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
    
  };

  // --------- RENDER ---------
  return (
    <div className="modal-overlay" onClick={() => setModalType(null)}>
      <div className={`modal-content ${loading ? "blurred" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* ----------- FORMULARIO DE SET-NEW-PASSWORD ----------- */}
        {modalType === "set-new-password" && (
          <form className="auth-form p-2">
            <div className="modal-header d-flex justify-content-center">
              <h2>Set New Password</h2>
              <button className="btn-close" onClick={() => setModalType(null)}>❌</button>
            </div>
            <div className="form-group p-3">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group p-3">
              <label>Repeat New Password</label>
              <input
                type="password"
                value={repeatNewPassword}
                onChange={e => setRepeatNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="container-btn-submit">
              <button
                className="btn-submit"
                onClick={handleSetNewPassword}
                disabled={loading}
              >
                Set New Password
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            {loading && <Loader message={loadingMessage} />}
          </form>
        )}

        {/* ----------- FLUJO NORMAL: LOGIN, SIGNUP, FORGOT ----------- */}
        {!isSetPasswordMode && modalType !== "set-new-password" && (
          <>
            <div className="modal-header d-flex justify-content-center">
              <h2>
                {forgotPassword
                  ? "Restablecer Contraseña"
                  : modalType === "login"
                  ? "Log In to OKAPI"
                  : "Sign UP to OKAPI"}
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
                    onClick={async (e) => {
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
                        const response = await fetch(
                          "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/custom/v1/reset-password",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: resetEmail }),
                          }
                        );

                        const result = await response.json();

                        if (response.ok) {
                          setMessage("✅ Revisa tu correo para restablecer tu contraseña.");
                          setResetEmail("");
                        } else {
                          setError(result.message || "🚨 Hubo un error.");
                        }
                      } catch (err) {
                        setError("🚨 Error al conectar con el servidor.");
                      } finally {
                        setLoading(false);
                      }
                    }}
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
              </form>
            ) : modalType === "signup" ? (
              <form className="auth-form p-4">
                <div className="form-row row">
                  <div className="form-group col-md-6 mb-4">
                    <label>First Name <span>*</span></label>
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
                    <label>Last Name <span className="text-muted">(Opcional)</span></label>
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
                    <label>Username <span>*</span></label>
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
                    <label htmlFor="phonePrefix">Phone <span className="text-muted">(Optional)</span></label>
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
                    <label>Company <span>*</span></label>
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
                    <label>Job Title <span>*</span></label>
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
                    <label>Country <span>*</span></label>
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
                      <option value="">Select Country</option>
                      {countriesList.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                    {fieldErrors.country && <div className="form-error">{fieldErrors.country}</div>}
                  </div>
                  <div className="form-group col-md-4 mb-4">
                    <label>Province<span>*</span></label>
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
                      <option value="">Select State</option>
                      {statesList.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                    {fieldErrors.state && <div className="form-error">{fieldErrors.state}</div>}
                  </div>
                  <div className="form-group col-md-4 mb-4">
                    <label>City <span className="text-muted">(Opcional)</span></label>
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
                    <label>Password <span>*</span></label>
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
                    <label>Repeat Password <span>*</span></label>
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
                    <label>Password <span>*</span></label>
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
                  Forgot your password?
                </button>
              </>
            ) : null}

            {userExists && (
              <p className="error-message">
                ⚠️ The account already exists.{" "}
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
                <button className="btn-submit" onClick={handleAuth}>
                  {modalType === "login" ? "Entrar" : "Registrarse"}
                </button>
              </div>
            )}
            {loading && <Loader message={loadingMessage} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
