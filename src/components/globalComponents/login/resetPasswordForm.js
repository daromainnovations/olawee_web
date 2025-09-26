
// src/components/globalComponents/login/resetPasswordForm.js
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../login/styles/resetPassword.scss";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  
  // Leer token y email
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoginCta, setShowLoginCta] = useState(false); // ⬅️ nuevo
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Abre el modal de login navegando con state (lo escucha App.js)
  const openLoginModal = () => {
    localStorage.setItem("reset_email", email || "");
    const isDev = window.location.hostname === "localhost";
    const base = isDev ? "http://localhost:3000" : "https://olawee.com";
    window.location.href = `${base}/?openLogin=true`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validar que tengamos token y email
    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    // Validar fortaleza
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNum = /\d/.test(newPassword);
    const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasLen = newPassword.length >= 8;

    if (!(hasUpper && hasLower && hasNum && hasSpec && hasLen)) {
      setError("Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.olawee.com/wp-json/custom-api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            token: token, 
            email: email, 
            password: newPassword 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update the password.");
      }

      if (data.success) {
        // Guardamos email para prefill y mostramos CTA
        localStorage.setItem("reset_email", email || "");
        setError("");
        setMessage("✅ Password updated successfully. You can now log in.");
        setShowLoginCta(true);
      } else {
        throw new Error(data.message || "Failed to update the password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to update the password.");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar error si faltan parámetros
  if (!token || !email) {
    return (
      <div className="reset-password-page">
        <div className="reset-form-container">
          <div className="error-container">
            <h2>Invalid Reset Link</h2>
            <p className="error-message">
              This password reset link is invalid or has expired. 
              Please request a new password reset.
            </p>
            <button 
              className="btn-reset"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-form-container">
      {loading && (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            zIndex: 9999
        }}>
            <div style={{
            width: '70px',
            height: '70px',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid #FFC310',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
            }} />

            <div style={{
            marginTop: '15px',
            color: '#FFC310',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            }}>
            Updating password...
            </div>

            <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}</style>
        </div>
        )}

        <form onSubmit={handleSubmit}>
          <button
            type="button"
            className="btn-close-reset"
            onClick={() => navigate("/")}
          >
            ❌
          </button>

          <h2>Reset Password</h2>
          <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Resetting password for: <strong>{email}</strong>
          </p>

          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} eye-icon`}
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} eye-icon`}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              ></i>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          
          {/* Mensaje de éxito + CTA para abrir login */}
          {message && (
            <p className="success-message" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {message}
              {showLoginCta && (
                <button
                  type="button"
                  className="btn-link"
                  onClick={openLoginModal}
                  style={{ textDecoration: 'underline' }}
                >
                  Ir al login
                </button>
              )}
            </p>
          )}

          <div className="container-btn-update-password">
            <button type="submit" className="btn-reset" disabled={loading}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
