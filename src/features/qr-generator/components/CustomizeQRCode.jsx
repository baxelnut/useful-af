// Style
import "./CustomizeQRCode.css";
// Components
import ExpandableDropdown from "../../../components/input/ExpandableDropdown";
import Dropdown from "../../../components/input/Dropdown";
import Input from "../../../components/input/Input";
// Data
import { MODULE_OPTIONS } from "../../../data/qrData";

export default function CustomizeQRCode({
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  moduleShape,
  setModuleShape,
  eyeShape,
  setEyeShape,
}) {
  return (
    <div className="customize-qr">
      <ExpandableDropdown
        title="COLOR"
        children={
          <>
            <label className="expanded-row color">
              <p>Foreground</p>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </label>

            <label className="expanded-row color">
              <p>Background</p>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </label>
          </>
        }
      />

      <ExpandableDropdown
        title="SHAPE"
        children={
          <>
            <label className="expanded-row shape">
              <p>Module shape</p>
              <Dropdown
                options={MODULE_OPTIONS}
                value={moduleShape}
                onChange={(e) => setModuleShape(e.target.value)}
                hasChevron
                short
              />
            </label>
            <label className="expanded-row shape">
              <p>Finder eye</p>
              <Dropdown
                options={MODULE_OPTIONS}
                value={eyeShape}
                onChange={(e) => setEyeShape(e.target.value)}
                hasChevron
                short
              />
            </label>
          </>
        }
      />

      <ExpandableDropdown
        title="FRAME"
        children={
          <>
            <Input placeholder="Type here..." type="text" fullWidth />
          </>
        }
      />

      <ExpandableDropdown
        title="LOGO"
        children={
          <>
            <p>skibidi toilet</p>
          </>
        }
      />
    </div>
  );
}
