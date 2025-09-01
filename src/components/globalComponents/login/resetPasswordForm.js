
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../login/styles/resetPassword.scss";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const login = searchParams.get("login");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🆕

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

    try {
      setLoading(true); // 🔥 empieza loader

      const response = await fetch(
        "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/custom/v1/set-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, login, password: newPassword }),
        }
      );

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update the password.");
      }

      localStorage.setItem("reset_email", login);
      setMessage("✅ Password updated. Redirecting to login...");
      setError("");

      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-login-modal"));
        }, 300);
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to update the password.");
    } finally {
      setLoading(false); // 🔥 termina loader
    }
  };

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
            flexDirection: 'column', // 🔥 Para que el spinner y texto estén uno encima del otro
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            zIndex: 9999
        }}>
            {/* Spinner */}
            <div style={{
            width: '70px',
            height: '70px',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid #FFC310',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
            }} />

            {/* Texto */}
            <div style={{
            marginTop: '15px',
            color: '#FFC310',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            }}>
            Updating password...
            </div>

            {/* Animación spin */}
            <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}</style>
        </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Botón cerrar en la esquina superior derecha */}
          <button
            type="button"
            className="btn-close-reset"
            onClick={() => navigate("/")}
          >
            ❌
          </button>

          <h2>Reset Password</h2>

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
          {message && <p className="success-message">{message}</p>}

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
