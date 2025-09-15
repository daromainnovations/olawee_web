
import "./savingsAndBenefits.scss"
import graphImage from "../../../media/img/userCases/img_beneficios.png";
import PrincipalButton from "../../globalComponents/principalButton/principalButton";

const SavingsAndBenefits = () => {
    return (
        <div className="mb-5 container-custom">
            <div className="container-title-savings-benefits d-flex justify-content-center">
                <h1 className="text-center">DESCUBRE LOS BENEFICIOS</h1>
            </div>
            
            <div className="row container-benefits-and-savings">
                {/* Columna izquierda con la imagen */}
                <div className="container-img-graph col-md-6 d-flex justify-content-center align-items-center">
                    <img src={graphImage} alt="Graph of savings and benefits" className="img-fluid custom-image img_beneficios" />
                </div>

                {/* Columna derecha con los tres divs y el botón */}
                <div className="col-md-6 container-text-benefits">
                    <div className="info-section savings">
                        <h4>AHORRO DE TIEMPO</h4>
                        <p><span className="highlight">Reutiliza conocimiento, automatiza tareas y reduce la carga operativa cada semana</span></p>
                    </div>
                    <div className="info-section benefits">
                        <h4>EFICIENCIA</h4>
                        <p><span className="highlight">Impulsa el rendimiento de tu equipo con agentes de IA personalizados y bibliotecas compartidas</span></p>
                    </div>
                    <div className="info-section roi">
                        <h4>COLABORACIÓN</h4>
                        <p><span className="highlight">Conecta equipos y departamentos para innovar sin barreras técnicas</span></p>
                    </div>
                     <div className="info-section impacto">
                        <h4>IMPACTO COMPARTIDO</h4>
                        <p><span className="highlight">Multiplica los beneficios cuando compartes IA dentro de tu organización</span></p>
                    </div>
                    
                    <PrincipalButton text="EMPEZAR YA" className="btn-custom btn-savings" containerClass="container-btn-savings"/>
                </div>
            </div>
        </div>
    );
}

export default SavingsAndBenefits;