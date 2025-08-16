import { useState, useRef, useEffect } from "react";
// Style
import "./Input.css";
// Components
import Icon from "../ui/Icon";
// Data
import { SVG_PATHS } from "../../data/utilsData";

export default function Input({
  type = "text",
  label = "",
  placeholder = "",
  value,
  onChange,
  name,
  required = false,
  fullWidth = false,
  autoFocus = false,
  disabled = false,
  obscurial,
  isTextarea = false,
  resizable = false,
  minHeight = "100px",
  expandable = false,
  noBorder = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password" && obscurial;
  const textareaRef = useRef(null);

  useEffect(() => {
    if (expandable && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={`input-wrapper ${fullWidth ? "full-width" : ""}`}>
      {label && (
        <label className="small-h" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="input-container">
        {isTextarea || noBorder ? (
          <textarea
            id={name}
            name={name}
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            autoFocus={autoFocus}
            disabled={disabled}
            className={`custom-input ${resizable ? "resizable" : ""} ${
              noBorder ? "no-border" : ""
            }`}
            rows={expandable ? 1 : 6}
            style={{
              resize: resizable ? "vertical" : "none",
              ...(expandable ? {} : { minHeight }),
            }}
          />
        ) : (
          <>
            <input
              id={name}
              name={name}
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              required={required}
              autoFocus={autoFocus}
              disabled={disabled}
              className={`custom-input ${noBorder ? "no-border" : ""}`}
            />
            {isPassword && (
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                <Icon
                  path={showPassword ? SVG_PATHS.eyeSlash : SVG_PATHS.eye}
                  size={18}
                />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
