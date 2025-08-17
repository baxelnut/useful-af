import { useState, useMemo, useEffect } from "react";
// Style
import "./MoodPalette.css";
// Components
import Button from "../../components/button/Button";
import Dropdown from "../../components/input/Dropdown";
import Input from "../../components/input/Input";
// Data
import { MOOD_OPT, COUNT_OPT } from "../../data/moodData";
// Helpers
import {
  buildPalette,
  detectMoodFromText,
} from "../../helpers/mood-palette/moodColorHelpers";

export default function MoodPalette() {
  const [mood, setMood] = useState("happy");
  const [count, setCount] = useState(5);
  const [seedText, setSeedText] = useState("");
  const [copied, setCopied] = useState(null);

  // auto-detect mood from text (if user typed a mood keyword)
  useEffect(() => {
    const detected = detectMoodFromText(seedText);
    if (detected) setMood(detected);
  }, [seedText]);

  const palette = useMemo(() => {
    return buildPalette(mood, count, seedText);
  }, [mood, count, seedText]);

  const copyColor = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const copyAll = async () => {
    try {
      const txt = palette.join(" ");
      await navigator.clipboard.writeText(txt);
      setCopied("all");
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const copyCSS = async () => {
    try {
      // generate CSS variable block
      const css = palette.map((c, i) => `--palette-${i + 1}: ${c};`).join("\n");
      const cssBlock = `:root {\n${css}\n}`;
      await navigator.clipboard.writeText(cssBlock);
      setCopied("css");
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mood-palette">
      <header className="mp-header">
        <p>Pick a mood, tweak, and copy colors or CSS.</p>

        <div className="mp-controls">
          <div className="control-row">
            <label className="small-p">Mood</label>
            <Dropdown
              options={MOOD_OPT}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              hasChevron
              short
            />
          </div>

          <div className="control-row">
            <label className="small-p">Colors</label>
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

      <div className="mp-body">
        <Input
          label="Seed text (optional)"
          placeholder="Describe the vibe or paste a sentence..."
          value={seedText}
          onChange={(e) => setSeedText(e.target.value)}
          isTextarea
          resizable
          fullWidth
        />

        <div className="mp-actions">
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

        <div className="palette-grid">
          {palette.map((hex, idx) => (
            <div className="swatch" key={hex + idx}>
              <div
                className="color"
                style={{ backgroundColor: hex }}
                onClick={() => copyColor(hex)}
                title="Click to copy"
              />
              <div className="meta">
                <div className="hex">{hex}</div>
                <div className="buttons">
                  <Button
                    text={copied === hex ? "Copied" : "Copy"}
                    onClick={() => copyColor(hex)}
                    short
                    hollow
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="hint">
          Tip: type mood keywords (e.g. "relax", "retro", "love") in the seed
          box to auto-select a mood. Click a swatch to copy a single color.
        </p>
      </div>
    </div>
  );
}
