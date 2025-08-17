// Style
import "./Dropdown.css";
// Components
import Icon from "../ui/Icon";
// Data
import { SVG_PATHS } from "../../data/utilsData";

export default function Dropdown({
  options = [],
  value = "",
  onChange = () => {},
  hasChevron = false,
  short = false,
  label = "",
}) {
  return (
    <div className="dropdown-wrapper">
      {label && <label className="dropdown-label">{label}</label>}

      <select
        className={`dropdown ${short ? "short" : ""}`}
        value={value}
        onChange={onChange}
      >
        {options.map((option) =>
          option.options ? (
            <optgroup key={option.label} label={option.label}>
              {option.options.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>

      {hasChevron && (
        <span className="dropdown-icon">
          <Icon path={SVG_PATHS.chevronDown} size={14} fill="var(--text)" />
        </span>
      )}
    </div>
  );
}
