
// import React, { useState } from 'react';
// import "../sections/styles/myProjects.scss";
// import { useProjects } from '../../../context/projectsContext';

// const defaultImg = "https://img.icons8.com/fluency/96/calculator.png";
// const PRODUCTS_PER_PAGE = 6;

// const MyProjects = () => {
//   const { projects, loading, error } = useProjects();
//   const [page, setPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState("recent");

//   let sortedProjects = [...projects];
//   if (sortOrder === "recent") {
//     sortedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
//   } else if (sortOrder === "oldest") {
//     sortedProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
//   } else if (sortOrder === "name") {
//     sortedProjects.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//   }

//   const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PRODUCTS_PER_PAGE));
//   const paginatedProjects = sortedProjects.slice(
//     (page - 1) * PRODUCTS_PER_PAGE,
//     page * PRODUCTS_PER_PAGE
//   );

//   // Si el usuario elimina proyectos y la página actual queda vacía, volver a la anterior
//   React.useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//     // eslint-disable-next-line
//   }, [projects, totalPages]);

//   return (
//     <div className="my-products-section">
//       <h2>Okapi Projects</h2>
//       {projects.length > 0 && (
//         <div className="filter-sort-container">
//           <label htmlFor="project-sort" className="filter-label">
//             Order by:
//           </label>
//           <select
//             id="project-sort"
//             value={sortOrder}
//             onChange={e => setSortOrder(e.target.value)}
//             className="filter-select"
//           >
//             <option value="recent">Most recent</option>
//             <option value="oldest">Oldest</option>
//             <option value="name">A-Z</option>
//           </select>
//         </div>
//       )}

//       {loading && <p>Loading projects...</p>}
//       {error && <p className="error">{error}</p>}
//       {!loading && projects.length === 0 && (
//       <div className="no-projects-message">
//       <div className="no-projects-content">
//         <img
//           src="https://img.icons8.com/fluency/96/idea.png"
//           alt="Start Project"
//           className="no-projects-img"
//         />
//         <h3>No projects yet</h3>
//         <h5>Your journey to smarter investments starts here</h5>
//         <p>
//           You’re one step away from discovering how much value you can truly unlock.
//           Create your first ROI project and take full control of your business decisions.
//         </p>

//         <button
//           className="start-project-btn"
//           onClick={() => {
//             window.scrollTo({ top: 0, behavior: "smooth" });
//           }}
//         >
//           Start now
//         </button>
//       </div>
//     </div>
    
      
//       )}

//       <div className="products-grid">
//         {paginatedProjects.map((prod, idx) => (
//           <div className="product-card" key={prod.id || idx}>
//             <div className="badges">
//               <span className="badge">
//               {new Date(prod.date).toLocaleDateString(undefined, {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//               </span>
//             </div>
//             <img src={defaultImg} alt="project" className="project-img" />
//             <div className="product-title">{prod.name || "No name"}</div>
//             <div className="product-desc">
//               <strong>Chat:</strong> {prod.chat_session_id || "No data"}
//             </div>
//             <button className="view-btn">Go to project</button>
//           </div>
//         ))}
//       </div>
//       {projects.length > 0 && (
//         <div className="pagination">
//           <button
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//             disabled={page === 1 || projects.length === 0}
//           >
//             Previous
//           </button>
//           <span>{page} / {totalPages}</span>
//           <button
//             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages || projects.length === 0}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyProjects;









