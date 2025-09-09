
import "./savingsAndBenefits.scss"
import graphImage from "../../../media/img/graph.png";
import PrincipalButton from "../../globalComponents/principalButton/principalButton";

const SavingsAndBenefits = () => {
    return (
        <div className="mb-5 container-custom">
            <div className="container-title-savings-benefits d-flex justify-content-center">
                <h1 className="text-center">Descubre tu productividad y beneficios</h1>
            </div>
            
            <div className="row container-benefits-and-savings">
                {/* Columna izquierda con la imagen */}
                <div className="container-img-graph col-md-6 d-flex justify-content-center align-items-center">
                    <img src={graphImage} alt="Graph of savings and benefits" className="img-fluid custom-image" />
                </div>

                {/* Columna derecha con los tres divs y el botón */}
                <div className="col-md-6 container-text-benefits">
                    <div className="info-section savings">
                        <h4>AHORRO DE TIEMPO</h4>
                        <p><span className="highlight">Automatiza tareas repetitivas.</span> OLAWEE identifica oportunidades para simplificar procesos y reducir la carga operativa, ayudándote a ahorrar horas cada semana.</p>
                    </div>
                    <div className="info-section benefits">
                        <h4>BENEFICIOS</h4>
                        <p><span className="highlight">Impulsa el rendimiento de tu equipo.</span> Descubre el verdadero potencial de tus empleados gracias a agentes de IA personalizados y bibliotecas compartidas de conocimiento.</p>
                    </div>
                    <div className="info-section roi">
                        <h4>COLABORACIÓN</h4>
                        <p><span className="highlight">Potencia a los equipos con IA.</span> OLAWEE fomenta la cooperación entre departamentos, permitiendo que cada persona innove sin barrera técnicas.</p>
                    </div>
                    <PrincipalButton text="EMPEZAR YA" className="btn-custom btn-savings" containerClass="container-btn-savings"/>
                    
                    
                </div>
            </div>
        </div>
    );
}

export default SavingsAndBenefits;