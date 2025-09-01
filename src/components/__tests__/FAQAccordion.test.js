
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import FAQAccordion from "../faqComponents/FAQAccordion/FAQAccordion";
import faqData from "../faqComponents/data/faqData";

describe("FAQAccordion", () => {
  it("debe renderizar todas las categorías y preguntas", () => {
    render(<FAQAccordion />);

    faqData.forEach((category) => {
      expect(screen.getByText(category.category)).toBeInTheDocument();

      category.questions.forEach((q) => {
        expect(screen.getByText(q.question)).toBeInTheDocument();
      });
    });
  });

  it("debe mostrar y ocultar la respuesta al hacer click en la pregunta", () => {
    render(<FAQAccordion />);

    const firstQuestion = faqData[0].questions[0];
    const button = screen.getByText(firstQuestion.question);

    expect(screen.queryByText(firstQuestion.answer)).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(firstQuestion.answer)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText(firstQuestion.answer)).not.toBeInTheDocument();
  });

  it("solo debe mostrar una respuesta expandida a la vez", () => {
    render(<FAQAccordion />);

    const firstQuestion = faqData[0].questions[0];
    const secondQuestion = faqData[0].questions[1];

    const firstButton = screen.getByText(firstQuestion.question);
    const secondButton = screen.getByText(secondQuestion.question);

    fireEvent.click(firstButton);
    expect(screen.getByText(firstQuestion.answer)).toBeInTheDocument();

    fireEvent.click(secondButton);
    expect(screen.getByText(secondQuestion.answer)).toBeInTheDocument();
    expect(screen.queryByText(firstQuestion.answer)).not.toBeInTheDocument();
  });

  it("debe cambiar el ícono de la flecha al expandir o contraer una pregunta", () => {
    render(<FAQAccordion />);
  
    const firstQuestion = faqData[0].questions[0];
  
    // Buscar el botón correspondiente a la primera pregunta
    const questionButton = screen.getAllByRole("button").find(btn =>
      btn.textContent.includes(firstQuestion.question)
    );
  
    expect(questionButton).toBeDefined();
  
    // Usar `within` para acceder al contenido del botón
    const iconSpan = within(questionButton).getByText("^");
    expect(iconSpan).toBeInTheDocument();
  
    // Click para expandir
    fireEvent.click(questionButton);
  
    // Verificar que el ícono ha cambiado a ˅
    expect(within(questionButton).getByText("˅")).toBeInTheDocument();
  
    // Click para colapsar
    fireEvent.click(questionButton);
  
    expect(within(questionButton).getByText("^")).toBeInTheDocument();
  });
  
});
