import { useState, useRef } from "react";
// Style
import "./QRCodeGenerator.css";
// Components
import ActionButtons from "./components/ActionButtons";
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
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("text");
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [resolution, setResolution] = useState(1024);
  const qrRef = useRef();

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
        <Output input={input} qrRef={qrRef} />
        <ActionButtons
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          resolution={resolution}
          setResolution={setResolution}
          handleDownload={(f) =>
            downloadQRCode(input, f || selectedFormat, resolution)
          }
          handleCopyImage={(f) =>
            copyQRCode(input, f || selectedFormat, resolution)
          }
          handleShare={(f) =>
            shareQRCode(input, f || selectedFormat, resolution, (fmt) =>
              downloadQRCode(input, fmt, resolution)
            )
          }
        />
      </div>
    </div>
  );
}
