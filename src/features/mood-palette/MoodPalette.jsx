import { useState, useMemo, useEffect } from "react";
// Style
import "./MoodPalette.css";
// Components
import Button from "../../components/button/Button";
import Dropdown from "../../components/input/Dropdown";
import Input from "../../components/input/Input";
// Data & Helpers
import { MOOD_OPT, COUNT_OPT, COPY_RESET_DELAY } from "../../data/moodData";
import {
  buildPalette,
  detectMood,
} from "../../helpers/mood-palette/moodColorHelpers";

export default function MoodPalette() {
  const [mood, setMood] = useState("happy");
  const [count, setCount] = useState(6);
  const [seedText, setSeedText] = useState("");
  const [copied, setCopied] = useState(null);

  // auto-detect mood from text
  useEffect(() => {
    const detected = detectMood(seedText);
    if (detected) setMood(detected);
  }, [seedText]);

  const palette = useMemo(
    () => buildPalette(mood, count, seedText),
    [mood, count, seedText]
  );
  const copyToClipboard = async (content, type) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), COPY_RESET_DELAY);
    } catch (e) {
      console.error(e);
    }
  };
  const copyColor = (hex) => copyToClipboard(hex, hex);
  const copyAll = () => copyToClipboard(palette.join(" "), "all");
  const copyCSS = () => {
    const cssBlock = `:root {\n${palette
      .map((c, i) => `  --color-${i + 1}: ${c};`)
      .join("\n")}\n}`;
    copyToClipboard(cssBlock, "css");
  };

  return (
    <div className="mood-palette">
      <header className="mp-header">
        <p>Pick a mood, tweak, and copy colors or CSS.</p>
        <div className="mp-controls">
          <div className="control-col">
            <label className="small-p">Mood</label>
            <Dropdown
              options={MOOD_OPT}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              hasChevron
              short
            />
          </div>
          <div className="control-col">
            <label className="small-p">Amount</label>
            <Dropdown
              options={COUNT_OPT}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              hasChevron
              short
            />
          </div>
        </div>
      </header>

      <Input
        label="Explain yourself (seed text, optional)"
        placeholder="Describe your vibe or paste a sentence..."
        value={seedText}
        onChange={(e) => setSeedText(e.target.value)}
        isTextarea
        resizable
        fullWidth
      />

      <div className="cards-container row mp-actions">
        <Button
          text={copied === "all" ? "Copied!" : "Copy all"}
          onClick={copyAll}
          short
          disabled={palette.length === 0}
        />
        <Button
          text={copied === "css" ? "CSS Copied!" : "Copy CSS"}
          onClick={copyCSS}
          short
          hollow
        />
      </div>

      <div className="cards-container row palette-grid">
        {palette.map((hex, idx) => (
          <SwatchCard
            key={hex + idx}
            hex={hex}
            copied={copied}
            onCopy={copyColor}
          />
        ))}
      </div>

      <p className="hint">
        Tip: type mood keywords (e.g. "relax", "retro", "love") in the seed box
        to auto-select a mood. Click a swatch to copy a single color.
      </p>
    </div>
  );
}

function SwatchCard({ hex, copied, onCopy }) {
  return (
    <div className="card swatch">
      <div
        className="color"
        style={{ backgroundColor: hex }}
        onClick={() => onCopy(hex)}
        title="Click to copy"
      />
      <div className="meta">
        <h6 className="hex small-h">{hex}</h6>
        <div className="buttons">
          <Button
            text={copied === hex ? "Copied" : "Copy"}
            onClick={() => onCopy(hex)}
            short
            hollow
          />
        </div>
      </div>
    </div>
  );
}
