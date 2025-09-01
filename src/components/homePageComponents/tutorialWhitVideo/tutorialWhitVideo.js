
import { useState } from "react";
import "./tutorialWhitVideo.scss"
import myImg from "../../../../src/media/img/Imagotipo_Okapi_cabeza.png"
const TutorialWhitVideo = () => {
  // Estado para controlar los elementos abiertos del acordeón
  const [activeAccordion, setActiveAccordion] = useState("collapseOne");

  const handleAccordionToggle = (id) => {
    if (activeAccordion === id) {
      setActiveAccordion(""); // Si el elemento ya está abierto, lo cerramos
    } else {
      setActiveAccordion(id); // Abrir el acordeón correspondiente
    }
  };

    return (
        <div className="mb-5 container-tutorial">
          <div className="row">
            {/* Columna izquierda con el título y el acordeón */}
            <div className="col-md-6 mt-1">
              <h4 className="mb-4 d-flex align-items-center justify-content-center m-auto text-center">Discover How OKAPI Functions</h4>
    
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className={`accordion-button ${ activeAccordion === "collapseOne" ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => handleAccordionToggle("collapseOne")}
                      aria-expanded={activeAccordion === "collapseOne" ? "true" : "false"}
                      aria-controls="collapseOne"
                      
                    >
                      <span className="step-point"></span>Step 1: Start with a prompt
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Describe your investment or project to OKAPI. OKAPI's AI can help you refine your input to provide the best results.
                    </div>
                  </div>
                </div>
    
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      <span className="step-point"></span>Step 2: Get a Detailed ROI Analysis
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Our AI will analyze your input and generate a detailed ROI (Return on Investment) report. You’ll receive key financial insights, cost breakdowns, and potential savings.
                    </div>
                  </div>
                </div>
    
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      <span className="step-point"></span>Step 3: Adjust Parameters for Better Accuracy
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Fine-tune the calculations by adjusting different parameters, such as investment amount, time frame, and expected benefits. This helps you get a personalized and precise analysis.
                    </div>
                  </div>
                </div>
    
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      <span className="step-point"></span>Step 4: Make Smarter Decisions
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Use the insights provided by OKAPI to optimize your investments, reduce unnecessary costs, and maximize profitability. Start implementing data-driven decisions today!
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Columna derecha con el video */}
            <div className="col-md-6 ">
              <div className="video-container d-flex justify-content-end align-items-end ">
                <img src={myImg} alt="logo-okapi"></img>
              </div>
            </div>
          </div>
        </div>
      );
}

export default TutorialWhitVideo;