
import React, { useState } from "react";

import "./FAQAccordion.scss";
import faqData from "../data/faqData"; // Importamos los datos desde el archivo externo

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex} className="faq-category">
          <h2 className="category-title">{category.category}</h2> 
          <div className="accordion">
            {category.questions.map((item, index) => {  /* ✅ Mapeamos SOLO preguntas */
              const questionIndex = `${categoryIndex}-${index}`;
              const isOpen = openIndex === questionIndex;

              return (
                <div key={questionIndex} className="accordion-item">
                  <button
                    className={`accordion-question ${isOpen ? "open" : ""}`}
                    onClick={() => toggleQuestion(questionIndex)}
                  >
                    <span className="question-text">{item.question}</span>
                    <span className={`icon ${isOpen ? "rotated" : ""}`} aria-label="arrow-icon">
                      {isOpen ? "˅" : "^"}
                    </span>
                  </button>
                  {isOpen && <div className="accordion-answer">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
        ))}
      </div>
  );
};

export default FAQAccordion;
