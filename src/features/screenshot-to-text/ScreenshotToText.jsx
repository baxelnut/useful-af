import { useState, useRef } from "react";
// Style
import "./ScreenshotToText.css";
// Components
import STTPreview from "./components/STTPreview";
import STTOutput from "./components/STTOutput";
// Hooks & helpers
import { useOCR } from "../../hooks/useOCR";
import {
  handleDropEvent,
  handlePasteEvent,
  handleFileUpload,
} from "../../helpers/fileHandler";

export default function ScreenshotToText() {
  const [imgPreview, setImgPreview] = useState(null);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const fileInputRef = useRef(null);
  const { loading, progress, text, setText, recognize } = useOCR();

  const handleFile = (file) =>
    handleFileUpload(file, (url) => {
      setImgPreview(url);
      recognize(url);
    });

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy"), 1500);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted-text.txt";
    link.click();
  };

  return (
    <div
      className="screenshot-to-text"
      onDrop={(e) => handleDropEvent(e, handleFile)}
      onDragOver={(e) => e.preventDefault()}
      onPaste={(e) => handlePasteEvent(e, handleFile)}
    >
      <STTPreview
        loading={loading}
        imgPreview={imgPreview}
        fileInputRef={fileInputRef}
        setImgPreview={setImgPreview}
        setText={setText}
        onFileChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />
      <STTOutput
        loading={loading}
        imgPreview={imgPreview}
        progress={progress}
        text={text}
        setText={setText}
        copyLabel={copyLabel}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onReRun={() => imgPreview && recognize(imgPreview)}
      />
    </div>
  );
}
