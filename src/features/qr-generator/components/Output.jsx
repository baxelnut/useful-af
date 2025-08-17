import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
// Style
import "./Output.css";

export default function Output({
  input,
  qrRef, // parent passes a ref; we'll set it to the DOM container
  fgColor = "#000000",
  bgColor = "#ffffff",
  moduleShape = "square",
  eyeShape = "square",
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
      });

      if (mountRef.current) instanceRef.current.append(mountRef.current);
    }

    instanceRef.current.update({
      data: input || "",
      dotsOptions: { color: fgColor, type: moduleShape },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: eyeShape },
      cornersDotOptions: { color: fgColor, type: eyeShape },
    });

    if (qrRef) qrRef.current = mountRef.current; // expose DOM container to parent via qrRef

    return () => {
      // keep instance around for faster update, but if unmounting clear DOM
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [input, fgColor, bgColor, moduleShape, eyeShape, qrRef]);

  return (
    <div className="qr-output">
      {!input && (
        <em className="output-placeholder small-p">
          Your QR will be generated here.
        </em>
      )}
      <div ref={mountRef} />
    </div>
  );
}
