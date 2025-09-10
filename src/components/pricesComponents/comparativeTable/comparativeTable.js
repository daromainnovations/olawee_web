
import "./comparativeTable.scss"; // Estilos CSS

const comparativeTable = [
  {
    feature: "Acceso a asistentes y prompts",
    free: "✅  Ilimitado (15 días)",
    olawee1: true,
    olawee_entidad: true,
    olawee_colectivos: true,
  },
  {
    feature: "Compartir en Olawee Community",
    free: "✅ (15 días)",
    olawee1: "✅",
    olawee_entidad: "✅",
    olawee_colectivos: "✅",
  },
  {
    feature: "Gestión de usuarios",
    free: "✅ (15 días)",
    olawee1: false,
    olawee_entidad: "✅ Avanza (roles, permisos)",
    olawee_colectivos: "✅ Grupos y roles colectivos",
  },
  {
    feature: "Integraciones externas (API, SSO, Webhooks)",
    free: "✅ (15 días)",
    olawee1: false,
    olawee_entidad: "✅",
    olawee_colectivos: "Opcional",
  },
  {
    feature: "Seguridad y auditoría",
    free: "✅ (15 días)",
    olawee1: "Básica",
    olawee_entidad: "✅ Completa",
    olawee_colectivos: "✅ Adaptada a colectivos",
  },
  {
    feature: "Asistentes personalizados",
    free: "✅ (15 días)",
    olawee1: true,
    olawee_entidad: true,
    olawee_colectivos: true,
  },
  {
    feature: "Colaboración en equipo",
    free: "✅ (15 días)",
    olawee1: "Básica",
    olawee_entidad: "✅ Completa",
    olawee_colectivos: "✅ Compartida entre miembros",
  },
  {
    feature: "Soporte",
    free: "✅ (15 días, estándar)",
    olawee1: "Estándar",
    olawee_entidad: "✅ Prioritario",
    olawee_colectivos: "✅ Dedicado al colectivo",
  },
  {
    feature: "Informes y reporting",
    free: "✅ (15 días)",
    olawee1: "Básico",
    olawee_entidad: "✅ Avanzado",
    olawee_colectivos: "✅ Colectivo",
  },
  {
    feature: "Espacios compartidos",
    free: "✅ (15 días)",
    olawee1: false,
    olawee_entidad: "✅",
    olawee_colectivos: "✅ (para asociaciones/comunidades)",
  },
];

const PlansTable = () => {
  return (
    <div className="plans-table-container">
      <table className="plans-table">
        <thead>
          <tr>
            <th>Funciones</th>
            <th>Free <br />(Prueba 15 días)</th>
            <th>OLAWEE</th>
            <th>OLAWEE - ENTIDAD</th>
            <th>OLAWEE - COLECTIVOS</th>
          </tr>
        </thead>
        <tbody>
          {comparativeTable.map((row, index) => (
            <tr key={index}>
              <td className="feature">{row.feature}</td>
              <td>{row.free === true ? "✅ Ilimitado" : row.free === false ? "❌" : row.free}</td>
              <td>{row.olawee1 === true ? "✅ Ilimitado" : row.olawee1 === false ? "❌" : row.olawee1}</td>
              <td>{row.olawee_entidad === true ? "✅ Ilimitado" : row.olawee_entidad === false ? "❌" : row.olawee_entidad}</td>
              <td>{row.olawee_colectivos === true ? "✅ Ilimitado" : row.olawee_colectivos === false ? "❌" : row.olawee_colectivos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
