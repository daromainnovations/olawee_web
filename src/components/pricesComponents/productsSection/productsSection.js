
// // src/components/pricesComponents/productsSection/productsSection.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CustomCard from "../customCard/customCard";
// import { getProducts } from "../../../services/wooCommerceService";
// import { useAuth } from "../../../context/authProviderContext";
// import "./productsSection.scss";

// const CACHE_KEY = "products_cache_v1";
// const USE_ID_FILTER = true;
// const ORDERED_IDS = ["78", "93", "92"];

// const BADGES = {
//   "78": "14 días de prueba gratis",
//   "93": "1 licencia",
//   "92": "3 licencias incluidas",
// };

// const ProductsSection = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   const navigate = useNavigate();
//   const { selectProductForCheckout, isAuthenticated } = useAuth();

//   useEffect(() => {
//     const cached = sessionStorage.getItem(CACHE_KEY);
//     if (cached) {
//       try {
//         const cachedData = JSON.parse(cached);
//         setProducts(cachedData);
//         setLoading(false);
//       } catch (e) {
//         console.error("Error parseando caché:", e);
//       }
//     }
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       const response = await getProducts({
//         perPage: 100,
//         orderby: 'menu_order',
//         order: 'asc'
//       });

//       if (response && response.success && Array.isArray(response.products)) {
//         const newProducts = response.products;
//         const cached = sessionStorage.getItem(CACHE_KEY);
//         const newCache = JSON.stringify(newProducts);
        
//         if (!cached || cached !== newCache) {
//           setProducts(newProducts);
//           sessionStorage.setItem(CACHE_KEY, newCache);
//         }
//       } else {
//         console.warn("Respuesta inesperada del API:", response);
//         setError("Error: formato de respuesta incorrecto");
//       }
//     } catch (e) {
//       const errorMsg = e?.response?.data?.message || e?.message || "Error desconocido";
//       setError(`Error: ${errorMsg}`);
//       console.error("Error cargando productos:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Manejar click en "Empezar"
//   const handleProductClick = (product) => {
//     // Si el precio es 0 o no tiene precio, es "Contactar"
//     if (!product.price || product.price === "0.00") {
//       window.location.href = "mailto:contacto@olawee.com";
//       return;
//     }

//     // Guardar el producto para el checkout
//     selectProductForCheckout(product);
    
//     // Si no está autenticado, guardar y redirigir a la página actual con un parámetro
//     if (!isAuthenticated) {
//       sessionStorage.setItem('pending_product', JSON.stringify(product));
//       sessionStorage.setItem('redirect_after_login', '/checkout');
//       // Aquí debes abrir tu AuthModal en lugar de navegar
//       // Dispara un evento para que tu app abra el modal
//       window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type: 'login' } }));
//       return;
//     }

//     // Si está autenticado, ir directo al checkout
//     navigate('/checkout');
//   };

//   if (error) {
//     return (
//       <div className="product-cards-section">
//         <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (loading && products.length === 0) {
//     return (
//       <div className="product-cards-section">
//         {[1, 2, 3].map(i => (
//           <div className="custom-card skeleton" key={i}></div>
//         ))}
//       </div>
//     );
//   }

//   let displayProducts = [...products];

//   if (USE_ID_FILTER) {
//     displayProducts = displayProducts.filter(product => 
//       ORDERED_IDS.includes(String(product.id))
//     );
    
//     displayProducts.sort(
//       (a, b) => ORDERED_IDS.indexOf(String(a.id)) - ORDERED_IDS.indexOf(String(b.id))
//     );
//   }

//   if (USE_ID_FILTER && displayProducts.length === 0 && !loading) {
//     return (
//       <div className="product-cards-section">
//         <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
//           No se encontraron productos con los IDs especificados.
//           <br />
//           <small>Buscando IDs: {ORDERED_IDS.join(", ")}</small>
//         </div>
//       </div>
//     );
//   }

//   if (displayProducts.length === 0 && !loading) {
//     return (
//       <div className="product-cards-section">
//         <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
//           No se encontraron productos publicados.
//         </div>
//       </div>
//     );
//   }

//   const extractFeaturesFromHtml = (html) => {
//     if (!html) return [];
//     const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map(m =>
//       m[1].replace(/<[^>]+>/g, "").trim()
//     ).filter(Boolean);
//     if (liMatches.length) return liMatches;
  
//     const text = html.replace(/<[^>]+>/g, "\n");
//     return text
//       .split(/\r?\n+/)
//       .map(s => s.replace(/^\s*[-–•]\s*/, "").trim())
//       .filter(Boolean);
//   };

//   return (
//     <div className="product-cards-section">
//       {displayProducts.map(product => (
//         <CustomCard
//           key={product.id}
//           title={product.name}
//           price={
//             product.price && product.price !== "0.00"
//               ? `${product.price} €`
//               : ""
//           }
//           features={extractFeaturesFromHtml(product.short_description)}
//           buttonText={
//             !product.price || product.price === "0.00"
//               ? "Contactar"
//               : "Empezar"
//           }
//           onButtonClick={() => handleProductClick(product)}
//           imageUrl={product.featured_image}
//           badge={BADGES[product.id]}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProductsSection;











// src/components/pricesComponents/productsSection/productsSection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "../customCard/customCard";
import { getProducts } from "../../../services/wooCommerceService";
import { useAuth } from "../../../context/authProviderContext";
import "./productsSection.scss";

const CACHE_KEY = "products_cache_v1";
const USE_ID_FILTER = true;
const ORDERED_IDS = ["78", "93", "92"];

// ✅ Productos que deben mostrar SIEMPRE "0 €"
const TRIAL_CONFIG = {
  "78": { later: 50, trialDays: 14 }, // Olawee Explora
};

const BADGES = {
  "78": "14 días de prueba gratis",
  "93": "1 licencia",
  "92": "3 licencias incluidas",
};

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { selectProductForCheckout, isAuthenticated } = useAuth();

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setProducts(cachedData);
        setLoading(false);
      } catch (e) {
        console.error("Error parseando caché:", e);
      }
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts({
        perPage: 100,
        orderby: "menu_order",
        order: "asc",
      });

      if (response && response.success && Array.isArray(response.products)) {
        const newProducts = response.products;
        const cached = sessionStorage.getItem(CACHE_KEY);
        const newCache = JSON.stringify(newProducts);

        if (!cached || cached !== newCache) {
          setProducts(newProducts);
          sessionStorage.setItem(CACHE_KEY, newCache);
        }
      } else {
        console.warn("Respuesta inesperada del API:", response);
        setError("Error: formato de respuesta incorrecto");
      }
    } catch (e) {
      const errorMsg =
        e?.response?.data?.message || e?.message || "Error desconocido";
      setError(`Error: ${errorMsg}`);
      console.error("Error cargando productos:", e);
    } finally {
      setLoading(false);
    }
  };

  // Click en CTA
  const handleProductClick = (product) => {
    const idStr = String(product.id);

    // Si NO es trial y su precio real es 0 -> contactar
    if (!TRIAL_CONFIG[idStr] && (!product.price || product.price === "0.00")) {
      window.location.href = "mailto:contacto@olawee.com";
      return;
    }

    // Guardar el producto para el checkout
    selectProductForCheckout(product);

    // Autenticación
    if (!isAuthenticated) {
      sessionStorage.setItem("pending_product", JSON.stringify(product));
      sessionStorage.setItem("redirect_after_login", "/checkout");
      window.dispatchEvent(
        new CustomEvent("openAuthModal", { detail: { type: "login" } })
      );
      return;
    }

    // Ir al checkout
    navigate("/checkout");
  };

  if (error) {
    return (
      <div className="product-cards-section">
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          {error}
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="product-cards-section">
        {[1, 2, 3].map((i) => (
          <div className="custom-card skeleton" key={i}></div>
        ))}
      </div>
    );
  }

  let displayProducts = [...products];

  if (USE_ID_FILTER) {
    displayProducts = displayProducts.filter((product) =>
      ORDERED_IDS.includes(String(product.id))
    );

    displayProducts.sort(
      (a, b) =>
        ORDERED_IDS.indexOf(String(a.id)) - ORDERED_IDS.indexOf(String(b.id))
    );
  }

  if (USE_ID_FILTER && displayProducts.length === 0 && !loading) {
    return (
      <div className="product-cards-section">
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No se encontraron productos con los IDs especificados.
          <br />
          <small>Buscando IDs: {ORDERED_IDS.join(", ")}</small>
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0 && !loading) {
    return (
      <div className="product-cards-section">
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No se encontraron productos publicados.
        </div>
      </div>
    );
  }

  const extractFeaturesFromHtml = (html) => {
    if (!html) return [];
    const liMatches = Array.from(
      html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)
    )
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);
    if (liMatches.length) return liMatches;

    const text = html.replace(/<[^>]+>/g, "\n");
    return text
      .split(/\r?\n+/)
      .map((s) => s.replace(/^\s*[-–•]\s*/, "").trim())
      .filter(Boolean);
  };

  // ✅ Mostrar SIEMPRE "0 €" si el producto está en TRIAL_CONFIG
  const getDisplayPrice = (product) => {
    const idStr = String(product.id);
    if (TRIAL_CONFIG[idStr]) {
      return "0 €";
    }
    if (product.price && product.price !== "0.00") {
      return `${product.price} €`;
    }
    return "";
  };

  const getButtonText = (product) => {
    const idStr = String(product.id);
    if (TRIAL_CONFIG[idStr]) return "Empezar";
    return !product.price || product.price === "0.00" ? "Contactar" : "Empezar";
  };

  return (
    <div className="product-cards-section">
      {displayProducts.map((product) => (
        <CustomCard
          key={product.id}
          title={product.name}
          price={getDisplayPrice(product)}
          features={extractFeaturesFromHtml(product.short_description)}
          buttonText={getButtonText(product)}
          onButtonClick={() => handleProductClick(product)}
          imageUrl={product.featured_image}
          badge={BADGES[product.id]}
        />
      ))}
    </div>
  );
};

export default ProductsSection;
