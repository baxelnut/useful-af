// Style
import "./STTPreview.css";
// Components
import Button from "../../../components/button/Button";

export default function STTPreview({
  loading,
  imgPreview,
  fileInputRef,
  setImgPreview,
  setText,
  onFileChange,
}) {
  return (
    <div className="card stt-preview">
      {imgPreview ? (
        <div className="stt-placeholder has-image">
          <img src={imgPreview} alt="preview" />
          {!loading && (
            <Button
              text="Clear"
              onClick={() => {
                setImgPreview(null);
                setText("");
              }}
              short
              hollow
            />
          )}
        </div>
      ) : (
        <div className="stt-placeholder">
          <p className="hint">Drag & drop, paste, or upload an image.</p>
          <div className="cards-container row stt-controls">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <Button
              text="Upload image"
              onClick={() => fileInputRef.current?.click()}
              short
              hollow
            />
          </div>
        </div>
      )}
    </div>
  );
}
