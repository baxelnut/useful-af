import { useState } from "react";
// Style
import "./BackgroundRemover.css";

export default function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // If you used "proxy" in package.json, use "/remove" here.
  const REMOVE_ENDPOINT = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/remove`
    : "/remove"; // fallback if you set up a Vite proxy

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file, file.name);
    try {
      const res = await fetch(REMOVE_ENDPOINT, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-remover">
      <h2>Background Remover</h2>
      <form onSubmit={handleSubmit} className="u-form">
        <input type="file" accept="image/*" onChange={handleFile} />
        <button type="submit" disabled={!file || loading} className="btn">
          {loading ? "Processing…" : "Remove Background"}
        </button>
      </form>
      <div className="previews">
        {preview && (
          <div className="card">
            <small>Original</small>
            <img src={preview} alt="original preview" />
          </div>
        )}
        {resultUrl && (
          <div className="card">
            <small>Result</small>
            <img src={resultUrl} alt="result" />
            <a href={resultUrl} download="no-bg.png" className="download">
              Download PNG
            </a>
          </div>
        )}
      </div>
      <p className="note">Tip: Transparent result is returned as PNG.</p>
    </div>
  );
}
