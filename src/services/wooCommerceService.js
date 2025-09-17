
// ✅ ARCHIVO ACTUALIZADO: wooCommerceService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_WC_API_URL;
const CONSUMER_KEY = process.env.REACT_APP_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.REACT_APP_WC_CONSUMER_SECRET;

// Extrae y estructura el usuario desde la respuesta del registro
const buildUserFromRegister = (responseUser = {}, extraFields = {}, email, username) => {
  return {
    id: responseUser.id || null,
    username: username,
    email: email,
    displayName: responseUser.displayName || `${extraFields.first_name || ""} ${extraFields.last_name || ""}`.trim(),
    firstName: responseUser.first_name || extraFields.first_name || "",
    lastName: responseUser.last_name || extraFields.last_name || "",
    phone: responseUser.phone || extraFields.phone || "",
    company: responseUser.company || extraFields.company || "",
    country: responseUser.country || extraFields.country || "",
    state: responseUser.state || extraFields.state || "",
    city: responseUser.city || extraFields.city || "",
    job: responseUser.job || extraFields.job || "",
    meta: {},
  };
};

export const registerUser = async (email, username, password, extraFields = {}) => {
  try {
    const response = await axios.post(
      "https://api.olawee.com/wp-json/custom-api/register",
      {
        email,
        username,
        password,
        first_name: extraFields.first_name,
        last_name: extraFields.last_name,
        phone: extraFields.phone,
        company: extraFields.company,
        country: extraFields.country,
        state: extraFields.state,
        city: extraFields.city,
        job: extraFields.job,
      },
      {
        timeout: 20000,
      }
    );

    // Si no tiene user.id, enriquecemos localmente
    const enrichedUser = buildUserFromRegister(response.data?.user || {}, extraFields, email, username);
    return { ...response.data, user: enrichedUser };
  } catch (error) {
    console.error("🚨 Error registrando usuario:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async (identifier) => {
  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const response = await axios.get(`${API_URL}/customers`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
      params: isEmail ? { email: identifier } : { username: identifier },
    });

    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("🚨 Error obteniendo usuario:", error.response?.data || error.message);
    return null;
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get("https://api.olawee.com/wp-json/olawee/v1/public-products");
    return response.data;
  } catch (error) {
    console.error("🚨 Error obteniendo productos:", error.message);
    return [];
  }
};
