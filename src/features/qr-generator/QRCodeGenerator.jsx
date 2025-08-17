import { useState, useRef, useEffect } from "react";
// Style
import "./QRCodeGenerator.css";
// Components
import ActionButtons from "./components/ActionButtons";
import CustomizeQRCode from "./components/CustomizeQRCode";
import GeneratorTypeCards from "./components/GeneratorTypeCards";
import GeneratorTypeInput from "./components/GeneratorTypeInput";
import Output from "./components/Output";
// Data
import { INPUT_TYPE } from "../../data/qrData";
// Helpers
import {
  handleTypeSelect,
  handleInputChange,
  recolorSvgLogo,
  handleLogoFileUpload,
  detectType,
} from "../../helpers/qr-generator/qrHelpers";
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
  // logo state
  const [logoUrl, setLogoUrl] = useState(null); // dataURL or same-origin URL
  const [autoLogo, setAutoLogo] = useState(true); // auto-assign based on type
  // customization state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [moduleShape, setModuleShape] = useState("square");
  const [eyeShape, setEyeShape] = useState("square");

  useEffect(() => {
    if (logoUrl && logoUrl.endsWith(".svg")) {
      recolorSvgLogo(logoUrl, fgColor).then(setLogoUrl);
    }
  }, [logoUrl, fgColor]);

  // when user selects a tool type
  const onSelectType = (key) =>
    handleTypeSelect(key, autoLogo, setSelectedType, setInput, setLogoUrl);

  // when input changes we might re-detect type and auto assign a logo
  const onInputChange = (v) =>
    handleInputChange(
      v,
      selectedType,
      autoLogo,
      setInput,
      setSelectedType,
      setLogoUrl
    );

  // file upload (user logo) -> convert to data URL and store
  const handleLogoUpload = (file) =>
    handleLogoFileUpload(file, setLogoUrl, setAutoLogo);

  // remove logo from output img
  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setAutoLogo(false);
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
          setInput={onInputChange}
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
          image={logoUrl}
          logoUrl={logoUrl}
          onRemoveLogo={handleRemoveLogo}
          autoLogo={autoLogo}
          setAutoLogo={setAutoLogo}
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
          onLogoUpload={handleLogoUpload}
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
              logoUrl,
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
              logoUrl,
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
              logoUrl,
              fgColor,
              bgColor,
              (fmt) =>
                downloadQRCode(
                  input,
                  fmt,
                  resolution,
                  qrRef.current,
                  logoUrl,
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
