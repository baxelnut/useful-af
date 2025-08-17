import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
// Style
import "./Output.css";
// Components
import Button from "../../../components/button/Button";

export default function Output({
  input,
  qrRef, // parent passes a ref; we'll set it to the DOM container
  fgColor = "#000000",
  bgColor = "#ffffff",
  moduleShape = "square",
  eyeShape = "square",
  image = null, // logo URL / data URI
  logoUrl,
  onRemoveLogo,
  autoLogo,
  setAutoLogo,
}) {
  const mountRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = new QRCodeStyling({
        width: 260,
        height: 260,
        type: "svg",
        data: input || "",
        margin: 2,
        dotsOptions: { color: fgColor, type: moduleShape },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: eyeShape },
        cornersDotOptions: { color: fgColor, type: eyeShape },
        image: image || undefined,
        imageOptions: {
          crossOrigin: "anonymous",
          hideBackgroundDots: true,
          imageSize: 0.2,
        },
      });

      if (mountRef.current) instanceRef.current.append(mountRef.current);
    }

    // always update QR
    instanceRef.current.update({
      data: input || "",
      dotsOptions: { color: fgColor, type: moduleShape },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: eyeShape },
      cornersDotOptions: { color: fgColor, type: eyeShape },
      image: autoLogo ? image : null,
      imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: true,
        imageSize: 0.3,
      },
    });

    if (qrRef) qrRef.current = mountRef.current;

    return () => {
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [input, fgColor, bgColor, moduleShape, eyeShape, image, autoLogo, qrRef]);

  return (
    <div className="qr-output" style={{ position: "relative" }}>
      {!input && (
        <em className="output-placeholder small-p">
          Your QR will be generated here.
        </em>
      )}
      <div ref={mountRef} />
      <div className="logo-preview">
        {input && (
          <label className="logo-checkbox">
            <input
              type="checkbox"
              checked={autoLogo}
              onChange={(e) => setAutoLogo(e.target.checked)}
            />
            <span className="small-p">Auto assign logo by type</span>
          </label>
        )}
        {logoUrl && autoLogo && (
          <Button text="Remove Logo" onClick={onRemoveLogo} short hollow />
        )}
      </div>
    </div>
  );
}
