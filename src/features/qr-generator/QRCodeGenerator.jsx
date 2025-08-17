import { useState, useRef } from "react";
// Style
import "./QRCodeGenerator.css";
// Components
import ActionButtons from "./components/ActionButtons";
import CustomizeQRCode from "./components/CustomizeQRCode";
import GeneratorTypeCards from "./components/GeneratorTypeCards";
import GeneratorTypeInput from "./components/GeneratorTypeInput";
import Output from "./components/Output";
// Data
import { INPUT_TYPE, PREFILL } from "../../data/qrData";
// Helpers
import { detectType } from "../../helpers/qr-generator/detectType";
import {
  downloadQRCode,
  copyQRCode,
  shareQRCode,
} from "../../helpers/qr-generator/qrOperations";

export default function QRCodeGenerator() {
  const qrRef = useRef();
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("text");
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [resolution, setResolution] = useState(1024);

  // customization state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [moduleShape, setModuleShape] = useState("square");
  const [eyeShape, setEyeShape] = useState("square");

  const onSelectType = (key) => {
    setSelectedType(key);
    setInput(PREFILL[key] ?? "");
  };

  return (
    <div className="qr-generator">
      <div className="qr-input-container">
        <GeneratorTypeCards
          selectedType={selectedType}
          onSelectType={onSelectType}
          INPUT_TYPE={INPUT_TYPE}
        />
        <GeneratorTypeInput
          input={input}
          setInput={setInput}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          detectType={detectType}
          INPUT_TYPE={INPUT_TYPE}
        />
      </div>

      <div className="qr-generated-container">
        <Output
          input={input}
          qrRef={qrRef}
          fgColor={fgColor}
          bgColor={bgColor}
          moduleShape={moduleShape}
          eyeShape={eyeShape}
        />
        <CustomizeQRCode
          fgColor={fgColor}
          setFgColor={setFgColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          moduleShape={moduleShape}
          setModuleShape={setModuleShape}
          eyeShape={eyeShape}
          setEyeShape={setEyeShape}
        />
        <ActionButtons
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          resolution={resolution}
          setResolution={setResolution}
          handleDownload={(f) =>
            downloadQRCode(
              input,
              f || selectedFormat,
              resolution,
              qrRef.current,
              fgColor,
              bgColor
            )
          }
          handleCopyImage={(f) =>
            copyQRCode(
              input,
              f || selectedFormat,
              resolution,
              qrRef.current,
              fgColor,
              bgColor
            )
          }
          handleShare={(f) =>
            shareQRCode(
              input,
              f || selectedFormat,
              resolution,
              qrRef.current,
              fgColor,
              bgColor,
              (fmt) =>
                downloadQRCode(
                  input,
                  fmt,
                  resolution,
                  qrRef.current,
                  fgColor,
                  bgColor
                )
            )
          }
        />
      </div>
    </div>
  );
}
