import "./contactForm.scss"

const ContactForm = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    /*LÓGICA PARA EL ENVÍO*/
    alert("Formulario enviado correctamente");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>CONTACT US</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="Your name" required />
          </label>
          <label>
            Email:
            <input type="email" name="Your email address" required />
          </label>
          <label>
            Asunto:
            <input type="text" name="Subject" required />
          </label>
          <label>
            Descripción:
            <textarea name="Description" rows="4" required></textarea>
          </label>

          <div className="modal-buttons">
            <button type="submit">Enviar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;