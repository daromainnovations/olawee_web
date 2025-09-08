
import "./switchButton.scss";

const SwitchButton = ({ selected, onChange }) => {
  return (
    <div className="switch-container">
      <div className="switch-button">
        {["Mensual", "Anual", "Perpetuo"].map((option) => (
          <button
            key={option}
            className={selected === option ? "active" : ""}
            onClick={() => onChange(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SwitchButton;
