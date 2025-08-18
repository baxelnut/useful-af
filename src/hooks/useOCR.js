import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";

export function useOCR() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");

  const recognize = useCallback(async (imageUrl) => {
    if (!imageUrl) return;
    setLoading(true);
    setText("");
    try {
      const { data } = await Tesseract.recognize(imageUrl, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      setText(data.text);
    } catch (err) {
      console.error(err);
      setText("OCR failed. Check console.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  return { loading, progress, text, setText, recognize };
}
