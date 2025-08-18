import { useState, useRef, useEffect } from "react";
// Style
import "./ScreenshotToText.css";
// Components
import STTPreview from "./components/STTPreview";
import STTOutput from "./components/STTOutput";
// Hooks & helpers
import { useOCR } from "../../hooks/useOCR";
import { handleFileUpload } from "../../helpers/fileHandler";

export default function ScreenshotToText() {
  const [imgPreview, setImgPreview] = useState(null);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const { loading, progress, text, setText, recognize } = useOCR();

  // Global drag & paste listeners on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let file = e.dataTransfer.files?.[0];
      if (!file && e.dataTransfer.items) {
        file = [...e.dataTransfer.items]
          .map((i) => i.getAsFile())
          .find(Boolean);
      }
      if (file) handleFile(file);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const items = e.clipboardData?.items || [];
      const file = [...items]
        .filter((i) => i.kind === "file")
        .map((i) => i.getAsFile())
        .find(Boolean);
      if (file) handleFile(file);
    };

    el.addEventListener("drop", handleDrop);
    el.addEventListener("dragover", (e) => e.preventDefault());
    el.addEventListener("paste", handlePaste);

    return () => {
      el.removeEventListener("drop", handleDrop);
      el.removeEventListener("dragover", (e) => e.preventDefault());
      el.removeEventListener("paste", handlePaste);
    };
  }, []);

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
    <div ref={containerRef} className="screenshot-to-text" tabIndex={0}>
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
