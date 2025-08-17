import { useState, useMemo } from "react";
// Style
import "./EpicHashtagGenerator.css";
// Components
import Button from "../../components/button/Button";
import Dropdown from "../../components/input/Dropdown";
import Input from "../../components/input/Input";
// Data
import { QUANTITY_CONTROL } from "../../data/utilsData";
// Helpers
import { generateHashtags } from "../../helpers/hashtag-generator/hashtagHelpers";

/* Simple UI component */
export default function EpicHashtagGenerator() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(null);
  const hashtags = useMemo(() => generateHashtags(text, count), [text, count]);

  async function copyAll() {
    if (!hashtags.length) return;
    const txt = hashtags.join(" ");
    try {
      await navigator.clipboard.writeText(txt);
      setCopied("all");
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error(e);
    }
  }

  async function copyOne(tag) {
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(tag);
      setTimeout(() => setCopied(null), 1000);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="hashtag-generator">
      <Input
        label="Paste description, caption, article or whatever"
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        minHeight="250px"
        isTextarea
        resizable
        fullWidth
      />

      <div className="cards-container row actions">
        <Dropdown
          label="How many?"
          options={QUANTITY_CONTROL}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          hasChevron
          short
        />
        {hashtags.length > 0 && (
          <>
            <Button
              text={copied === "all" ? "Copied!" : "Copy all"}
              onClick={copyAll}
              short
            />
            <Button text="Clear" onClick={() => setText("")} short hollow />
          </>
        )}
      </div>

      {hashtags.length > 0 && (
        <p className="hint">
          Tip: click any tag to copy it. Use the dropdown to choose count.
        </p>
      )}

      <div className="results">
        {hashtags.length === 0 ? (
          <p className="hint">Type something to generate tags.</p>
        ) : (
          <div className="cards-container row tags-grid">
            {hashtags.map((t) => (
              <Button
                key={t}
                text={t}
                className={`tag ${copied === t ? "copied" : ""}`}
                onClick={() => copyOne(t)}
                title="Click to copy"
                short
                hollow
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
