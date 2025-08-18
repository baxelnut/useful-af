// Style
import "./STTOutput.css";
// Components
import Input from "../../../components/input/Input";
import LoadingBar from "../../../components/utils/LoadingBar";
import OCRControls from "./OCRControls";

export default function STTOutput({
  loading,
  imgPreview,
  progress,
  text,
  setText,
  copyLabel,
  onCopy,
  onDownload,
  onReRun,
}) {
  return (
    <div className="stt-output">
      {loading ? (
        <LoadingBar
          placeholder={`Processing OCR... ${progress}%`}
          progress={progress}
        />
      ) : (
        <>
          {text && imgPreview && (
            <OCRControls
              text={text}
              copyLabel={copyLabel}
              onCopy={onCopy}
              onDownload={onDownload}
              onReRun={onReRun}
            />
          )}
          <Input
            value={text}
            placeholder="Extracted text will show here..."
            onChange={(e) => setText(e.target.value)}
            isTextarea
            resizable
            minHeight={imgPreview ? "400px" : "200px"}
            fullWidth
          />
        </>
      )}
    </div>
  );
}
