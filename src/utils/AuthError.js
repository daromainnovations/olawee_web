
export class AuthError extends Error {
    constructor(message, code = "unknown_error", raw = null) {
      // Elimina etiquetas HTML del mensaje
      const cleanMessage = typeof message === "string"
        ? message.replace(/<[^>]+>/g, "").trim()
        : "An unexpected error occurred.";
  
      super(cleanMessage);
  
      this.name = "AuthError";
      this.code = code;
      this.raw = raw;
    }
  
    /**
     * Devuelve un mensaje amigable para el usuario
     */
    getFriendlyMessage() {
        switch (this.code) {
          case "incorrect_password":
            return "Incorrect password. Please try again.";
          case "invalid_username":
            return "This user does not exist.";
          case "missing_fields":
            return "Please provide both email and password.";
          case "rest_forbidden":
            return "Access denied. You are not allowed to perform this action.";
          default:
            return this.message || "An unexpected error occurred.";
        }
      }
      
}
  
  