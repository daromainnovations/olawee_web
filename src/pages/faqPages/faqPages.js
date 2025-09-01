import Menu from "../../components/globalComponents/headerMenu/menu"
import Footer from "../../components/globalComponents/footer/footer";
import FAQAccordion from "../../components/faqComponents/FAQAccordion/FAQAccordion";

import "./faqPages.scss";


const FaqPages = () => { 
    return (
        <div className="faq-page">
          <Menu />
          <div className="faq-header d-flex flex-column align-items-center text-center">
            <h6>Frequently Asked Questions</h6>
            <h1 className="title-faq">Your questions, answered.</h1>
            <p>Welcome to the OKAPI FAQ page! We've compiled answers to the most common questions to help you get the information you need quickly. If you don't find what you're looking for, feel free to reach out to our support team!</p>
          </div>
          <FAQAccordion />
          <Footer />
        </div>
    )
}

export default FaqPages;