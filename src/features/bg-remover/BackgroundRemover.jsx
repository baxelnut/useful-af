import { useRef, useState, useEffect } from "react";
// Style
import "./BackgroundRemover.css";
// Components
import Button from "../../components/button/Button";
import LoadingBar from "../../components/utils/LoadingBar";
// Helpers
import { removeBackground } from "../../helpers/bg-remover/bgRemover";
import { startFakeProgress } from "../../helpers/bg-remover/fakeProgress";

export default function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const REMOVE_ENDPOINT = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/remove`
    : "/remove";

  // cleanup object URLs when component unmounts or when urls change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  useEffect(() => {
    // revoke previous preview when new preview is set to avoid memory leaks
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    // revoke result when replaced
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null); // clear any previous result
    }
    setFile(f);
    const p = URL.createObjectURL(f);
    setPreview(p);
    autoRemove(f); // auto trigger removal
  }

  async function autoRemove(selectedFile) {
    if (!selectedFile) return;
    setLoading(true);
    setProgress(0);
    const controller = startFakeProgress((p) => setProgress(p));
    try {
      const url = await removeBackground(selectedFile, REMOVE_ENDPOINT);
      controller.stop(100);
      setResultUrl(url);
    } catch (err) {
      controller.cancel();
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        window.location.reload(); // Refresh window after every remove
      }, 350);
    }
  }

  function handleClear() {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setFile(null);
    setProgress(0);
    setLoading(false);
  }

  return (
    <div className="bg-remover">
      <p className="hint">Transparent result is returned as PNG.</p>

      <div className="cards-container row controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />

        {!file ? (
          <Button
            text="Upload Image"
            onClick={() => fileInputRef.current?.click()}
          />
        ) : (
          <Button text="Remove" onClick={handleClear} hollow short />
        )}
      </div>

      {file && (
        <div className="cards-container row previews">
          <div className="card preview">
            <p>Original</p>
            {preview && <img src={preview} alt="original preview" />}
          </div>

          <div className="card result">
            <p>Result</p>
            {loading ? (
              <LoadingBar
                placeholder="Removing background…"
                progress={progress}
              />
            ) : (
              resultUrl && <img src={resultUrl} alt="result" />
            )}
          </div>
        </div>
      )}

      {resultUrl && (
        <Button
          text="Download PNG"
          href={resultUrl}
          className="download"
          download="no-bg.png"
        />
      )}
    </div>
  );
}
