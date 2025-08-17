import { useState } from "react";
// Style
import "./ExpandableDropdown.css";
// Components
import Icon from "../ui/Icon";
// Data
import { SVG_PATHS } from "../../data/utilsData";

export default function ExpandableDropdown({ title = "Title", children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-dropdown">
      <div className="dropdown-header" onClick={() => setExpanded(!expanded)}>
        <h6 className="small-h">{title}</h6>
        <Icon
          className={expanded ? "rotated" : ""}
          path={SVG_PATHS.chevronDown}
          size={20}
        />
      </div>

      <div className={`dropdown-content ${expanded ? "expanded" : ""}`}>
        {children}
      </div>
    </div>
  );
}
