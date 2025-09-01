
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json",
// });

// api.interceptors.request.use(config => {
//   const token = sessionStorage.getItem("jwt_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



// En tu archivo de configuración de axios (api.js)
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json',
  timeout: 15000, // Timeout global de 15 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configuración para mejorar la velocidad
api.interceptors.request.use(request => {
  // Añadir parámetro no-cache para evitar caching en navegador
  if (request.method === 'get') {
    request.params = request.params || {};
    request.params._nc = Date.now(); // Evitar cache
  }
  return request;
});

// Analizar tiempos de respuesta
api.interceptors.response.use(response => {
  const requestTime = Date.now() - response.config.metadata.startTime;
  console.log(`🕒 Tiempo de respuesta para ${response.config.url}: ${requestTime}ms`);
  return response;
}, error => {
  return Promise.reject(error);
});

// Añadir metadata para medir tiempos
api.interceptors.request.use(request => {
  request.metadata = { startTime: Date.now() };
  return request;
});

export default api;