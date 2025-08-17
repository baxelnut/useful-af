import { useState } from "react";
// Style
import "./ReadingTimeEstimator.css";
// Components
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

export default function ReadingTimeEstimator() {
  const [text, setText] = useState("");

  // calculate words properly
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 200; // average reading speed
  const readingTimeMinutes = Math.ceil(wordCount / wpm);

  return (
    <div className="reading-time-estimator">
      <div className="reading-time-result">
        <p>
          <em>Estimated reading time:</em>{" "}
          <strong>{readingTimeMinutes} min</strong>
        </p>
      </div>

      <Input
        type="text"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        minHeight="300px"
        isTextarea
        resizable
        fullWidth
      />

      <Button
        text="Clear"
        onClick={() => setText("")}
        backgroundColor="var(--primary)"
        short
      />
    </div>
  );
}
