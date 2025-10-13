
import "./savingsAndBenefits.scss"
import graphImage from "../../../media/img/userCases/img_beneficios.png";
import PrincipalButton from "../../globalComponents/principalButton/principalButton";

const SavingsAndBenefits = () => {
    return (
        <div className="mb-5 container-custom">
            <div className="container-title-savings-benefits d-flex justify-content-center">
                <h1 className="text-center">Haz más, en menos tiempo, con la IA que se adapta a ti.
                </h1>
            </div>
            
            <div className="row container-benefits-and-savings">
                {/* Columna izquierda con la imagen */}
                <div className="container-img-graph col-md-6 d-flex justify-content-center align-items-center">
                    <img src={graphImage} alt="Graph of savings and benefits" className="img-fluid custom-image img_beneficios" />
                </div>

                {/* Columna derecha con los tres divs y el botón */}
                <div className="col-md-6 container-text-benefits">
                    <div className="info-section savings">
                        <h4>COMPARTE ASISTENTES Y PROMPTS</h4>
                        <p><span className="highlight">Colabora eficientemente compartiendo recursos personalizados y creando red entre organizaciones.</span></p>
                    </div>
                    <div className="info-section benefits">
                        <h4>SELECCIONA TUS IAs</h4>
                        <p><span className="highlight">Elige entre distintos modelos y proveedores según las necesidades concretas de tu entidad.
                        </span></p>
                    </div>
                    <div className="info-section roi">
                        <h4>AUTOMATIZA TAREAS Y AUMENTA LA PRODUCTIVIDAD</h4>
                        <p><span className="highlight">Libera horas de trabajo eliminando procesos repetitivos y enfócate en lo estratégico.
                        </span></p>
                    </div>
                     <div className="info-section impacto">
                        <h4>COMUNIDAD OLAWEE</h4>
                        <p><span className="highlight">Un espacio vivo donde profesionales y entidades comparten experiencias, casos de uso y buenas prácticas.</span></p>
                    </div>
                    
                    <PrincipalButton text="EMPEZAR YA" className="btn-custom btn-savings" containerClass="container-btn-savings"/>
                </div>
            </div>
        </div>
    );
}

export default SavingsAndBenefits;