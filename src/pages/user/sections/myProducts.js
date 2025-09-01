
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import "../sections/styles/myProjects.scss";

const defaultImg = "https://img.icons8.com/fluency/96/calculator.png";
const PRODUCTS_PER_PAGE = 6;

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from('n8n_chats_okapi_principal')
          .select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cálculo para paginación
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="my-products-section">
      <h2>Okapi Projects</h2>
      {loading && <p>Cargando proyectos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && products.length === 0 && <p>No tienes proyectos aún.</p>}
      <div className="products-grid">
        {paginatedProducts.map((prod, idx) => (
          <div className="product-card" key={prod.id || idx}>
            <div className="badges">
              <span className="badge">ID: {prod.id}</span>
            </div>
            <img src={defaultImg} alt="project" className="project-img" />
            <div className="product-title">{prod.name || "Sin nombre"}</div>
            <div className="product-desc">
              <strong>Chat:</strong> {prod.chat_session_id || "No data"}
            </div>
            <button className="view-btn">Go to project</button>
          </div>
        ))}
      </div>
      {/* Paginación solo si hay más de 6 */}
      {products.length > PRODUCTS_PER_PAGE && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
