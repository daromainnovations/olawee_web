
import "./comparativeTable.scss"; // Estilos CSS

const comparativeTable = [
  {
    feature: "Acceso a IA avanzada",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Análisis de ROI ilimitados",
    free: false,
    basicMonthly: false,
    premiumMonthly: true,
    basicYearly: false,
    premiumYearly: true,
  },
  {
    feature: "Proyectos personalizados",
    free: "3 Proyectos",
    basicMonthly: "Ilimitado",
    premiumMonthly: "Ilimitado",
    basicYearly: "Ilimitado",
    premiumYearly: "Ilimitado",
  },
  {
    feature: "Variables avanzadas",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Soporte prioritario",
    free: false,
    basicMonthly: false,
    premiumMonthly: true,
    basicYearly: false,
    premiumYearly: true,
  },
  {
    feature: "Informes descargables",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Acceso multiplataforma",
    free: true,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Cálculos rápidos (IA)",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Acceso prioritario a funciones nuevas",
    free: false,
    basicMonthly: false,
    premiumMonthly: true,
    basicYearly: false,
    premiumYearly: true,
  },
  {
    feature: "Comparación de escenarios",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Memoria ampliada de cálculos",
    free: false,
    basicMonthly: true,
    premiumMonthly: true,
    basicYearly: true,
    premiumYearly: true,
  },
  {
    feature: "Colaboración en equipo",
    free: false,
    basicMonthly: false,
    premiumMonthly: true,
    basicYearly: false,
    premiumYearly: true,
  },
  {
    feature: "Descuentos en renovaciones",
    free: false,
    basicMonthly: false,
    premiumMonthly: true,
    basicYearly: false,
    premiumYearly: true,
  },
];

const PlansTable = () => {
  return (
    <div className="plans-table-container">
      <table className="plans-table">
        <thead>
          <tr>
            <th>Funciones</th>
            <th>Free</th>
            <th>Basic <br /> Mensual</th>
            <th>Premium <br /> Mensual</th>
            <th>Basic <br /> Anual</th>
            <th>Premium <br /> Anual</th>
          </tr>
        </thead>
        <tbody>
          {comparativeTable.map((row, index) => (
            <tr key={index}>
              <td className="feature">{row.feature}</td>
              <td>{row.free === true ? "✅" : row.free === false ? "X" : row.free}</td>
              <td>{row.basicMonthly === true ? "✅" : row.basicMonthly === false ? "X" : row.basicMonthly}</td>
              <td>{row.premiumMonthly === true ? "✅" : row.premiumMonthly === false ? "X" : row.premiumMonthly}</td>
              <td>{row.basicYearly === true ? "✅" : row.basicYearly === false ? "X" : row.basicYearly}</td>
              <td>{row.premiumYearly === true ? "✅" : row.premiumYearly === false ? "X" : row.premiumYearly}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
