
import React, { useEffect, useState } from "react";
import CustomCard from "../customCard/customCard";
import { getProducts } from "../../../services/wooCommerceService";
import "./productsSection.scss";

const CACHE_KEY = "products_cache_v1";

// 🔧 CONFIGURACIÓN: Puedes activar el filtro por IDs si quieres
const USE_ID_FILTER = true; // ← Cambiar a true para filtrar por IDs específicos

const ORDERED_IDS = ["78" , "93", "92" ]; // Solo se usa si USE_ID_FILTER = true

const BADGES = {
  "78": "14 días gratis",  // ← Añadido según tus productos reales
  "93": "Individual",
  "92": "3 licencias incluidas",
};

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Mostrar lo que hay en el cache inmediatamente (sin loading)
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

    // Hacemos SIEMPRE la petición, aunque haya cache (fetch en segundo plano)
    loadProducts();
    // eslint-disable-next-line
  }, []);

  const loadProducts = async () => {
    try {
      // ✅ Llamar con parámetros correctos
      const response = await getProducts({
        perPage: 100, // Traer todos los productos
        orderby: 'menu_order', // Ordenar como en WooCommerce
        order: 'asc'
      });

      // ✅ Verificar estructura de respuesta
      if (response && response.success && Array.isArray(response.products)) {
        const newProducts = response.products;
        
        // Solo actualizamos si los datos han cambiado
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
      const errorMsg = e?.response?.data?.message || e?.message || "Error desconocido";
      setError(`Error: ${errorMsg}`);
      console.error("Error cargando productos:", e);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="product-cards-section">
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    // solo muestra skeleton si no hay nada en cache ni cargando
    return (
      <div className="product-cards-section">
        {[1, 2, 3].map(i => (
          <div className="custom-card skeleton" key={i}></div>
        ))}
      </div>
    );
  }

  // ✅ Filtrar y ordenar productos
  let displayProducts = [...products];

  if (USE_ID_FILTER) {
    // Modo filtrado: Solo productos con IDs específicos
    displayProducts = displayProducts.filter(product => 
      ORDERED_IDS.includes(String(product.id))
    );
    
    // Ordenar según ORDERED_IDS
    displayProducts.sort(
      (a, b) => ORDERED_IDS.indexOf(String(a.id)) - ORDERED_IDS.indexOf(String(b.id))
    );
  }
  // Si USE_ID_FILTER = false, muestra todos los productos sin filtrar

  // Si no hay productos después de filtrar (solo aplica con filtro activo)
  if (USE_ID_FILTER && displayProducts.length === 0 && !loading) {
    return (
      <div className="product-cards-section">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No se encontraron productos con los IDs especificados.
          <br />
          <small>Buscando IDs: {ORDERED_IDS.join(", ")}</small>
        </div>
      </div>
    );
  }

  // Si no hay productos en absoluto
  if (displayProducts.length === 0 && !loading) {
    return (
      <div className="product-cards-section">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No se encontraron productos publicados.
        </div>
      </div>
    );
  }

  const extractFeaturesFromHtml = (html) => {
    if (!html) return [];
    // 1) intenta extraer <li>
    const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map(m =>
      m[1].replace(/<[^>]+>/g, "").trim()
    ).filter(Boolean);
    if (liMatches.length) return liMatches;
  
    // 2) fallback: quitar etiquetas y partir por saltos de línea / guiones
    const text = html.replace(/<[^>]+>/g, "\n");
    return text
      .split(/\r?\n+/)
      .map(s => s.replace(/^\s*[-–•]\s*/, "").trim())
      .filter(Boolean);
  };

  return (
    <div className="product-cards-section">
      {displayProducts.map(product => (
        <CustomCard
          key={product.id}
          title={product.name}
          price={
            product.price && product.price !== "0.00"
              ? `${product.price} €`
              : ""
          }
          features={extractFeaturesFromHtml(product.short_description)}
          buttonText={
            !product.price || product.price === "0.00"
              ? "Contactar"
              : "Empezar"
          }
          onButtonClick={() => window.open(product.permalink, "_blank")}
          // ✅ Usar featured_image en lugar de images[0].src
          imageUrl={product.featured_image}
          badge={BADGES[product.id]}
        />
      ))}
    </div>
  );
};

export default ProductsSection;