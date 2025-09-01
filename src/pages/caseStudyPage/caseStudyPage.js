import Menu from "../../components/globalComponents/headerMenu/menu";
import BackArrow from "../../components/globalComponents/backArrow/backArrow";
import imgProblem from "../../media/img/problem.png";
import imgSolution from "../../media/img/solution.png";

import "./caseStudyPage.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FcBearish, FcBullish } from "react-icons/fc";


const CaseStudyPage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const study = location.state;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!study) {
            navigate("/user-cases"); // Redirige solo si no hay datos
        }
    }, [study, navigate]);

    if (!study) {
        return null; // Evita renderizar el componente si ya se está redirigiendo
    }

    return(
        <div>
            <Menu />
            <BackArrow />
            <div className="case-study-container">
                <h1 className="case-study-title">{study.title}</h1>
                <div className="case-study-content">
                    <img src={study.imageUrl} alt={study.title} className="case-study-image"/>
                </div>
                <div className="case-study-container-problem d-flex">
                    <div className="container-problem col-6">
                        <div className="container-title-icon d-flex gap-3 align-items-center">
                            <h3 className="title-problem">The Problem</h3>
                            <FcBearish className="graph-down" size={34} /> 
                        </div>
                        
                        <p>{study.description}</p>
                    </div>
                    <div className="container-problem-graph col-6">
                        <img src={imgProblem} className="case-study-graph" alt="problem"/>
                    </div>
                    
                </div>

                <div className="case-study-container-solution d-flex">
                    <div className="container-solution col-6">
                        <div className="container-title-icon d-flex gap-3 align-items-center">
                            <h3 className="title-solution">The Solution</h3>
                            <FcBullish className="graph-up" size={34} /> 
                        </div>
                        
                        <p>{study.description}</p>
                    </div>
                    <div className="container-solution-graph col-6">
                        <img src={imgSolution} className="case-study-graph" alt="problem"/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
} 

export default CaseStudyPage;