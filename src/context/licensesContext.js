import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./authProviderContext";

const LICENSES_URL = "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/okapi/v1/user-licenses";
const PRODUCTS_URL = "https://okapi-woocommerc-wr9i20lbrp.live-website.com/wp-json/okapi/v1/all-product-names";

const LicensesContext = createContext();

export const LicensesProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [licenses, setLicenses] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Trae los nombres de productos una sola vez
  useEffect(() => {
    axios.get(PRODUCTS_URL)
      .then(res => {
        const map = {};
        res.data.forEach(p => { map[p.id] = p.name; });
        setProductsMap(map);
      })
      .catch(() => setProductsMap({}));
  }, []);

  // Trae las licencias cada vez que cambia el usuario
  const fetchLicenses = useCallback(() => {
    if (!userId) {
      setLicenses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(LICENSES_URL, { params: { user_id: userId } })
      .then((res) => setLicenses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setLicenses([]))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  // Devuelve todo lo necesario por contexto
  return (
    <LicensesContext.Provider
      value={{
        licenses,
        loading,
        productsMap,
        refreshLicenses: fetchLicenses, // Si quieres refrescar manualmente después de una compra/cambio
      }}
    >
      {children}
    </LicensesContext.Provider>
  );
};

// Hook personalizado para usarlo fácilmente
export const useLicenses = () => useContext(LicensesContext);
