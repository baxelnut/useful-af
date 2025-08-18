// Style
import "./LoadingBar.css";

export default function LoadingBar({ placeholder, progress }) {
  return (
    <div className="loading-bar">
      <p>{placeholder}</p>
      <progress value={progress} max="100" />
    </div>
  );
}
