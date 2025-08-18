// Style
import "./OCRControls.css";
// Components
import Button from "../../../components/button/Button";

export default function OCRControls({
  text,
  copyLabel,
  onCopy,
  onDownload,
  onReRun,
}) {
  return (
    <div className="cards-container row stt-actions">
      <Button text="Re-run OCR" onClick={onReRun} disabled={!text} short />
      <Button
        text="Download .txt"
        onClick={onDownload}
        disabled={!text}
        short
        hollow
      />
      <Button text={copyLabel} onClick={onCopy} disabled={!text} short hollow />
    </div>
  );
}
