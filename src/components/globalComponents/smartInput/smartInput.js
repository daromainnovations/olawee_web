import React, { useRef } from "react";

const SmartInput = ({
  label,
  value,
  onChange,
  name,
  required = false,
  placeholder = "",
  type = "text",
  className = "",
  as = "input", // "input" | "textarea" | "select"
  rows = 4,
  options = [], // solo para select
}) => {
  const originalValue = useRef(value);

  const handleFocus = () => {
    if (value === originalValue.current) {
      onChange({ target: { value: "", name } });
    }
  };

  const handleBlur = () => {
    if (value.trim?.() === "") {
      onChange({ target: { value: originalValue.current, name } });
    }
  };

  const commonProps = {
    name,
    value,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange,
    required,
    className,
  };

  return (
    <div className="form-row">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea {...commonProps} rows={rows} placeholder={placeholder} />
      ) : as === "select" ? (
        <select {...commonProps}>
          <option value="">{placeholder || "-- Selecciona una opción --"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...commonProps} type={type} placeholder={placeholder} />
      )}
    </div>
  );
};

export default SmartInput;
