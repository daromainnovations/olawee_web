import React, { useState } from "react";
import "./contacto.scss";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    descripcion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Formulario enviado correctamente ✅");
    setFormData({
      nombre: "",
      email: "",
      asunto: "",
      descripcion: ""
    });
  };

  return (
    <div className="formulario-wrapper">
      <div className="formulario-container">
        <h2>Contáctanos</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="asunto">Asunto</label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="4"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;