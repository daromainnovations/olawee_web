
import "./savingsAndBenefits.scss"
import graphImage from "../../../media/img/graph.png";
import PrincipalButton from "../../globalComponents/principalButton/principalButton";

const SavingsAndBenefits = () => {
    return (
        <div className="mb-5 container-custom">
            <div className="container-title-savings-benefits d-flex justify-content-center">
                <h1 className="text-center">Discover your savings and benefits</h1>
            </div>
            
            <div className="row container-benefits-and-savings">
                {/* Columna izquierda con la imagen */}
                <div className="container-img-graph col-md-6 d-flex justify-content-center align-items-center">
                    <img src={graphImage} alt="Graph of savings and benefits" className="img-fluid custom-image" />
                </div>

                {/* Columna derecha con los tres divs y el botón */}
                <div className="col-md-6 container-text-benefits">
                    <div className="info-section savings">
                        <h4>SAVINGS</h4>
                        <p><span className="highlight">Reduce unnecessary costs.</span>OKAPI identifies opportunities to optimize your investments and minimize expenses, helping you save more with every decision.</p>
                    </div>
                    <div className="info-section benefits">
                        <h4>BENEFITS</h4>
                        <p><span className="highlight">Maximize your profits.</span> Discover the true potential of your investments by leveraging detailed analyses that boost your financial gains.</p>
                    </div>
                    <div className="info-section roi">
                        <h4>ROI (Return on Investment)</h4>
                        <p><span className="highlight">Make informed decisions.</span>OKAPI calculates the estimated return on your investments to ensure you get the most value possible from every penny invested.</p>
                    </div>
                    <PrincipalButton text="EMPEZAR YA" className="btn-custom btn-savings" containerClass="container-btn-savings"/>
                    
                    
                </div>
            </div>
        </div>
    );
}

export default SavingsAndBenefits;