
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
              <h4 className="mb-4 d-flex align-items-center justify-content-center m-auto text-center">Descubre cómo funciona OLAWEE</h4>
    
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
                      <span className="step-point"></span>Paso 1: Comienza con un prompt
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Describe tu tarea o proyecto OLAWEE. La IA te ayuda a refinar tu entrada para obtener los mejores resultados.
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
                      <span className="step-point"></span>Paso 2: Obtén un flujo de trabajo detallado con IA
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Crea y guarda tus prompts más efectivos, organiza tus agentes personales y reutilízalos siempre que lo necesites. Lleva tus flujos de trabajo a otro nivel con IA adaptada a ti..
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
                      <span className="step-point"></span>Paso 3: Ajusta parámetros para mayor precisión
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Publica tus mejores prompts y agentes, descubre ideas de otros usuarios y colabora en la construcción de una comunidad donde la inteligencia artificial se convierte en un recurso compartido.
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
                      <span className="step-point"></span>Paso 4: Trabaja de forma más inteligente, en equipo
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                    Nuestro agente especializado en auditorías analiza cómo aplicas la IA en tu empresa y detecta oportunidades de mejora, optimización y seguridad. Una mirada profesional que te ayuda a tomar decisiones estratégicas basadas en datos.
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