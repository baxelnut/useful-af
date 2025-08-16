import { QRCodeCanvas } from "qrcode.react";
// Style
import "./Output.css";

export default function Output({ input, qrRef }) {
  return (
    <div className="qr-output">
      {!input && (
        <em className="output-placeholder small-p">
          Your QR will be generated here.
        </em>
      )}
      {input?.trim() && (
        <div ref={qrRef}>
          <QRCodeCanvas value={input} size={260} marginSize={2} />
        </div>
      )}
    </div>
  );
}
