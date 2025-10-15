import Menu from "../../components/globalComponents/headerMenu/menu"
import Footer from "../../components/globalComponents/footer/footer";
import FAQAccordion from "../../components/faqComponents/FAQAccordion/FAQAccordion";

import "./faqPages.scss";


const FaqPages = () => { 
    return (
        <div className="faq-page">
          <Menu />
          <div className="faq-header d-flex flex-column align-items-center text-center">
            <h6>Preguntas frecuentes</h6>
            <h1 className="title-faq">Tus dudas, resueltas.</h1>
            <p>¡Bienvenido/a a las FAQs de Olawee! Hemos recopilado respuestas a las preguntas más comunes para que encuentres lo que necesitas en segundos. Si no ves tu caso, ¡contacta con nuestro equipo de soporte y te ayudamos encantados!</p>
          </div>
          <FAQAccordion />
          <Footer />
        </div>
    )
}

export default FaqPages;