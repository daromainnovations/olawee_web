
import { useState } from 'react';
import PrincipalButton from '../../globalComponents/principalButton/principalButton';
import './goalDescriptionInput.scss';

const GoalDescriptionInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
    setIsPlaceholderVisible(false);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (!e.target.value.trim()) {
      setIsPlaceholderVisible(true);
    }
  };

  return (
    // <div className={`text-area-container ${isFocused ? "focused" : ""}`}>
    //   {/* Textarea con placeholder */}
    //   <div className="textarea-wrapper">
    //     <textarea
    //       className="text-area"
    //       placeholder={isPlaceholderVisible ? "Write about what you want to save for..." : ""}
    //       onFocus={handleFocus}
    //       onBlur={handleBlur}
    //     ></textarea>
    //     {/* Contenedor de los botones */}
    //     <div className="button-container">
    //       <button className="btn">Ejemplo 1</button>
    //       <button className="btn">Ejemplo 2</button>
    //       <button className="btn">Ejemplo 3</button>
    //       <button className="btn">Ejemplo 4</button>
    //     </div>
    //   </div>

    //   {/* Línea debajo de los botones */}
    //   <div className="line"></div>

    //   {/* Botón a la derecha debajo de la línea */}
    //   <div className="right-button-container">
    //     <PrincipalButton containerClass="right-button-container" className="btn-custom" text="START" />
    //   </div>
    // </div>
    <div className={`text-area-container ${isFocused ? "focused" : ""}`}>

      {/* Textarea con placeholder */}
      <div className="textarea-wrapper">
      <div className="textarea-disabled-overlay">🚧 En Construcción</div>
        <textarea
          className="text-area"
          placeholder={isPlaceholderVisible ? "Write about what you want to save for..." : ""}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled // <- esto desactiva el textarea
        ></textarea>

        {/* Contenedor de los botones */}
        <div className="button-container">
          <button className="btn" disabled>Ejemplo 1</button>
          <button className="btn" disabled>Ejemplo 2</button>
          <button className="btn" disabled>Ejemplo 3</button>
          <button className="btn" disabled>Ejemplo 4</button>
        </div>
      </div>

      {/* Línea debajo de los botones */}
      <div className="line"></div>

      {/* Botón a la derecha debajo de la línea */}
      <div className="right-button-container">
        <PrincipalButton containerClass="right-button-container" className="btn-custom" text="START" disabled />
      </div>
    </div>

  );
};

export default GoalDescriptionInput;