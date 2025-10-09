
import "./comparativeTable.scss"; // Estilos CSS

const comparativeTable = [
  {
    feature: "Chat Base e Historial",
    olawee_explora: "✅  SI (14 días)",
    olawee_impulsa: true,
    olawee_equipo: true,
    olawee_colectivos: true,
  },
  {
    feature: "Selección de modelos de IA",
    olawee_explora: "✅ SI (14 días)",
    olawee_impulsa: "✅",
    olawee_equipo: "✅",
    olawee_colectivos: "✅",
  },
  {
    feature: "Acceso a Compartición de Asistentes",
    olawee_explora: "✅ SI (14 días)",
    olawee_impulsa: true,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Acceso a Compartición de Prompts",
    olawee_explora: "✅ (14 días)",
    olawee_impulsa: true,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Acceso a OLAWEE community",
    olawee_explora: "✅ (14 días)",
    olawee_impulsa: "✅ SI",
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Auditorías",
    olawee_explora: false,
    olawee_impulsa: true,
    olawee_equipo: true,
    olawee_colectivos: true,
  },
  {
    feature: "Gestión de usuarios (múltiples licencias)",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: "✅ SI (3 licencias)",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Integración con apps externas",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Soporte basic",
    olawee_explora: "✅ SI",
    olawee_impulsa: "✅ SI",
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Soporte avanzado",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Formación Personalizada",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Asistentes Personalizados",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: "✅ SI",
    olawee_colectivos: "✅ SI",
  },
  {
    feature: "Branding",
    olawee_explora: false,
    olawee_impulsa: false,
    olawee_equipo: false,
    olawee_colectivos: "✅ SI",
  },
];

const PlansTable = () => {
  return (
    <div className="plans-table-container">
      <table className="plans-table">
        <thead>
          <tr>
            <th>Funciones</th>
            <th>OLAWEE EXPLORA <br />(Prueba 14 días)</th>
            <th>OLAWEE IMPULSA 50€</th>
            <th>OLAWEE EQUIPO 120€</th>
            <th>OLAWEE COLECTIVOS</th>
          </tr>
        </thead>
        <tbody>
          {comparativeTable.map((row, index) => (
            <tr key={index}>
              <td className="feature">{row.feature}</td>
              <td>{row.olawee_explora === true ? "✅ Ilimitado" : row.olawee_explora === false ? "❌" : row.olawee_explora}</td>
              <td>{row.olawee_impulsa === true ? "✅ Ilimitado" : row.olawee_impulsa === false ? "❌" : row.olawee_impulsa}</td>
              <td>{row.olawee_equipo === true ? "✅ Ilimitado" : row.olawee_equipo === false ? "❌" : row.olawee_equipo}</td>
              <td>{row.olawee_colectivos === true ? "✅ Ilimitado" : row.olawee_colectivos === false ? "❌" : row.olawee_colectivos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
