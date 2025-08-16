import { useState, useRef } from "react";
import QRCodeLib from "qrcode";
// Style
import "./QRCodeGenerator.css";
// Components
import ActionButtons from "./ActionButtons";
import GeneratorTypeCards from "./GeneratorTypeCards";
import GeneratorTypeInput from "./GeneratorTypeInput";
import Output from "./Output";
// Data
import { GENERATOR_TYPE } from "../../data/qrData";

export default function QRCodeGenerator() {
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("url");
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [resolution, setResolution] = useState(1024);
  const qrRef = useRef();

  const showToast = (msg) => {
    // Create overlay
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(2px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9998,
    });

    // Create toast
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      background: "var(--text)",
      color: "var(--bg)",
      padding: "8px 12px",
      borderRadius: "0.25rem",
      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    });

    overlay.appendChild(t);
    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), 1000);
  };

  const handleDownload = async (format = selectedFormat) => {
    if (!input?.trim()) return;
    try {
      if (format === "svg") {
        const svgString = await QRCodeLib.toString(input, {
          type: "svg",
          margin: 2,
        });
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(input || "qrcode").slice(0, 40) || "qrcode"}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }

      const type =
        format === "jpg" || format === "jpeg"
          ? "image/jpeg"
          : `image/${format}`;
      const dataUrl = await QRCodeLib.toDataURL(input, {
        type,
        width: resolution,
        margin: 2,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      const ext = format === "jpeg" ? "jpg" : format;
      a.download = `${(input || "qrcode").slice(0, 40) || "qrcode"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed - check console.");
    }
  };

  const handleCopyImage = async (format = selectedFormat) => {
    if (!input?.trim()) return;
    try {
      if (format === "svg") {
        const svgString = await QRCodeLib.toString(input, {
          type: "svg",
          margin: 2,
        });
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/svg+xml": blob }),
          ]);
          showToast("Image copied!");
          return;
        }
        // fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.svg";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      const mime =
        format === "jpg" || format === "jpeg"
          ? "image/jpeg"
          : `image/${format}`;
      const dataUrl = await QRCodeLib.toDataURL(input, {
        type: mime,
        width: resolution,
        margin: 2,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        showToast("Image copied!");
        return;
      }
      // fallback
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qrcode.${format === "jpeg" ? "jpg" : format}`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Copy image failed - check console.");
    }
  };

  const handleShare = async (format = selectedFormat) => {
    if (!input?.trim()) return;
    try {
      let blob;
      if (format === "svg") {
        const svgString = await QRCodeLib.toString(input, {
          type: "svg",
          margin: 2,
        });
        blob = new Blob([svgString], { type: "image/svg+xml" });
      } else {
        const mime =
          format === "jpg" || format === "jpeg"
            ? "image/jpeg"
            : `image/${format}`;
        const dataUrl = await QRCodeLib.toDataURL(input, {
          type: mime,
          width: resolution,
          margin: 2,
        });
        const res = await fetch(dataUrl);
        blob = await res.blob();
      }

      const file = new File(
        [blob],
        `qrcode.${format === "jpeg" ? "jpg" : format}`,
        { type: blob.type }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "QR Code", text: input });
        return;
      }

      if (navigator.share) {
        await navigator.share({ title: "QR Code", text: input });
        return;
      }

      // fallback to download
      handleDownload(format);
    } catch (err) {
      console.error(err);
      alert("Share failed - check console.");
    }
  };

  return (
    <div className="qr-generator">
      <div className="qr-input-container">
        <GeneratorTypeCards
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          GENERATOR_TYPE={GENERATOR_TYPE}
        />
        <GeneratorTypeInput
          input={input}
          setInput={setInput}
          selectedType={selectedType}
          GENERATOR_TYPE={GENERATOR_TYPE}
        />
      </div>

      <div className="qr-generated-container">
        <Output input={input} qrRef={qrRef} />
        <ActionButtons
          handleDownload={handleDownload}
          handleCopyImage={handleCopyImage}
          handleShare={handleShare}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          resolution={resolution}
          setResolution={setResolution}
        />
      </div>
    </div>
  );
}
