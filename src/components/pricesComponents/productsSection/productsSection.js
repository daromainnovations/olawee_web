
import React, { useEffect, useState } from "react";
import CustomCard from "../customCard/customCard";
import { getProducts } from "../../../services/wooCommerceService";
import "./productsSection.scss";

const CACHE_KEY = "products_cache_v1";
const ORDERED_IDS = ["84", "86", "87"];
const BADGES = {
  "84": "Monthly",
  "86": "Yearly",
  "87": "Perpetual"
};

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  const [error, setError] = useState("");

  // 1. Mostrar lo que hay en el cache inmediatamente (sin loading)
  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setProducts(JSON.parse(cached));
      setLoading(false);
    }
    // Hacemos SIEMPRE la petición, aunque haya cache (fetch en segundo plano)
    getProducts()
      .then(data => {
        // Solo actualizamos si los datos han cambiado
        if (!cached || cached !== JSON.stringify(data)) {
          setProducts(data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      })
      .catch(e => {
        setError("Error: " + (e?.message || JSON.stringify(e)));
        console.error(e);
      })  
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (loading && products.length === 0) {
    // solo muestra skeleton si no hay nada en cache ni cargando
    return (
      <div className="product-cards-section">
        {[1,2,3].map(i => (
          <div className="custom-card skeleton" key={i}></div>
        ))}
      </div>
    );
  }

  const orderedProducts = [...products].sort(
    (a, b) => ORDERED_IDS.indexOf(String(a.id)) - ORDERED_IDS.indexOf(String(b.id))
  );

  return (
    <div className="product-cards-section">
      {orderedProducts.map(product => (
        <CustomCard
          key={product.id}
          title={product.name}
          price={
            product.price && product.price !== "0.00"
              ? `${product.price} €`
              : ""
          }
          features={[
            product.short_description
              ? product.short_description.replace(/(<([^>]+)>)/gi, "")
              : ""
          ]}
          buttonText={
            !product.price || product.price === "0.00"
              ? "Contact Us"
              : "Get Started"
          }
          onButtonClick={() => window.open(product.permalink, "_blank")}
          //esta sería la imagen si queremos ponerla
          // imageUrl={product.images?.[0]?.src}
          badge={BADGES[product.id]}
        />
      ))}
    </div>
  );
};

export default ProductsSection;
