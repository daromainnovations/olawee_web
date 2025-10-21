
import { useState } from "react";
import { registerUser } from "../../../services/wooCommerceService";
import { useAuth } from "../../../context/authProviderContext";
import { Link } from "react-router-dom";

const SignUpButton = () => {
  const { login } = useAuth(); // Solo usamos login aquí
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");

  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    setMessage("");
    setUserExists(false);

    if (!firstName || !lastName || !email || !username || !password || !company || !country || !job) {
      setError("Todos los campos son obligatorios, excepto el teléfono.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // 1. REGISTRAR USUARIO (no guardes el resultado, no es el usuario completo)
      await registerUser(email, username, password, {
        first_name: firstName,
        last_name: lastName,
        phone,
        company,
        country,
        job
      });

      // 2. LOGIN AUTOMÁTICO después de registro
      await login(email, password);

      setMessage("✅ Registro exitoso. ¡Bienvenido!");
      // No necesitas hacer setUser ni tocar localStorage: el contexto lo gestiona en login.

      // Opcional: puedes recargar o redirigir si quieres refrescar la interfaz
      // window.location.reload();
    } catch (err) {
      if (err.response?.data?.code === "registration-error-email-exists" || err.response?.data?.code === "email_exists") {
        setUserExists(true);
      } else if (err.response?.data?.code === "username_exists") {
        setError("El nombre de usuario ya existe. Elige otro.");
      } else {
        setError("🚨 Error en el registro: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {userExists && (
        <p style={{ color: "red" }}>
          ⚠️ El usuario ya está registrado.{" "}
          <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>Inicia sesión aquí</Link>.
        </p>
      )}

      <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input type="text" placeholder="País" value={country} onChange={(e) => setCountry(e.target.value)} />
      <input type="text" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="text" placeholder="Puesto de trabajo" value={job} onChange={(e) => setJob(e.target.value)} />

      <button onClick={handleSignUp}>Registrarse</button>
    </div>
  );
};

export default SignUpButton;
