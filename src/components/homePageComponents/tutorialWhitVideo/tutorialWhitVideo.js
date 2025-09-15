
//import { useState } from "react";
import "./tutorialWhitVideo.scss"
import myImg from "../../../../src/media/img/Imagotipo_Okapi_cabeza.png"
const TutorialWhitVideo = () => {
  // Estado para controlar los elementos abiertos del acordeón
  //const [activeAccordion, setActiveAccordion] = useState("collapseOne");

  /*const handleAccordionToggle = (id) => {
    if (activeAccordion === id) {
      setActiveAccordion(""); // Si el elemento ya está abierto, lo cerramos
    } else {
      setActiveAccordion(id); // Abrir el acordeón correspondiente
    }
  };*/

    return (
        <div className="mb-5 container-tutorial">
          <div className="row">
            {/* Columna izquierda con el título y el acordeón */}
            <div className="col-md-6 mt-1">
              <h4 className="mb-4 d-flex align-items-center justify-content-center m-auto text-center">Cómo funciona OLAWEE</h4>
    
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded= "false"
                      aria-controls="collapseOne"

                    >
                      <span className="step-point"></span>PASO 1. ELIGE TÚ IA
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Describe tu tarea o proyecto y obtén respuestas ajustadas a tus necesidades
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
                      <span className="step-point"></span>PASO 2. CREA Y REUTILIZA
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Diseña prompts o asistentes personalizados, guárdaloS y úsalos siempre que lo necesites
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
                      <span className="step-point"></span>PASO 3. COMPARTE Y COLABORA
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Publica tus mejores creaciones, descubre las de otros y participa en una comunidad que multiplica el conocimiento
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
                      <span className="step-point"></span>PASO 4. MEJORA TUS DATOS
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Nuestro agente especializado analiza el uso de la IA de tu empresa, detecta oportunidades de optimización y te ayuda a tomar decisiones estratégicas
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