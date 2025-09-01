
import React, { useState } from "react";
import "../sections/styles/magicOkapi.scss";
import { BsStars } from "react-icons/bs";

const predefinedQuestions = [
  "Is it profitable to invest in this project?",
  "Which license suits me best?",
  "How long will it take to recover the investment?",
  "What data do I need to get started?",
  "Can I compare multiple scenarios?",
  "How do I interpret the results report?",
  "What is the long-term impact of this investment?"
];


const MagicOkapi = () => {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Aquí va la lógica para enviar el mensaje
    console.log("Mensaje enviado a Okapi:", message);

    setSubmitted(true);
    setMessage("");
};

const handleCheckboxChange = (question) => {
  setSelectedQuestions((prev) =>
    prev.includes(question)
      ? prev.filter((q) => q !== question)
      : [...prev, question]
  );
};

  return (
    <>
    <div className="magic-okapi-container">
        <div className="magic-okapi-header d-flex"> 
            <BsStars className="icon-magic-okapi" />
            <h2> Magic Okapi</h2>
        </div>
        <p className="intro-text">
          Not sure where to start? Tell Magic Okapi what you need, and we’ll help you out. It’s like sending a wish to your favorite AI companion.
        </p>
        <div className="magic-okapi-questions">
          <div className="checkbox-list">
            <p className="select-instruction">What do you need to know?</p>
            <div className="checkbox-grid">
              {predefinedQuestions.map((question, index) => {
                const isSelected = selectedQuestions.includes(question);
                return (
                  <label
                    key={index}
                    className={`checkbox-item ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(question)}
                    />
                    {question}
                  </label>
                );
              })}   
            </div>
          </div>

        </div>
      
        {!submitted ? (
          <form onSubmit={handleSubmit} className="magic-okapi-form">
            <textarea
              placeholder="Hey Okapi, I’d like help with creating a project, choosing a license, understanding my stats..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        ) : (
          <div className="thank-you">
            <p>💌 Thank you! Magic Okapi received your message.</p>
            <button onClick={() => setSubmitted(false)} className="send-another">Send another</button>
          </div>
        )}
    </div>
    </>
  );
};

export default MagicOkapi;
