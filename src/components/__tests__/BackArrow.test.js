
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import BackArrow from "../globalComponents/backArrow/backArrow";

// Mock del hook useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: jest.fn(),
  };
});

describe("BackArrow", () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it("debe redirigir a '/' si estamos en /faq", () => {
    useLocation.mockReturnValue({ pathname: "/faq" });

    render(
      <MemoryRouter>
        <BackArrow />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button")); // Hace click en el botón

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("debe retroceder una página si estamos en otra ruta distinta de /faq", () => {
    useLocation.mockReturnValue({ pathname: "/otra-pagina" });

    render(
      <MemoryRouter>
        <BackArrow />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button")); // Hace click en el botón

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
