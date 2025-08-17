// Data
import { MOOD_PALETTES, MOOD_KEYWORDS } from "../../data/moodData";

/* choose palette based on mood + desired count + optional seed text to vary */
export function buildPalette(mood, count = 5, seedText = "") {
  const base = MOOD_PALETTES[mood] || MOOD_PALETTES["neutral"];
  // if count less than base, pick first N
  if (count <= base.length) return base.slice(0, count);
  // otherwise expand by jittering and repeating
  const out = [...base];
  while (out.length < count) {
    // clone a base color and jitter slightly
    const pick = base[out.length % base.length];
    out.push(jitter(pick, 0.08));
  }
  // optional deterministic shuffle based on seedText
  if (seedText && seedText.trim()) {
    const seed = seedText
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    // small pseudo-shuffle
    for (let i = 0; i < seed % 10; i++) {
      const i1 = seed % out.length;
      const i2 = (i + seed) % out.length;
      [out[i1], out[i2]] = [out[i2], out[i1]];
    }
  }
  return out.slice(0, count);
}

/* text -> mood guess (naive keyword matching) */
export function detectMoodFromText(text) {
  if (!text) return null;
  const s = text.toLowerCase();
  for (const [mood, keys] of Object.entries(MOOD_KEYWORDS)) {
    for (const k of keys) {
      if (s.includes(k)) return mood;
    }
  }
  return null;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// blend two hex colors by amount (0..1) towards target
function blend(hexA, hexB, t = 0.5) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  });
}

// slightly jitter a hex color (mix with white or black)
function jitter(hex, amount = 0.06) {
  // random sign
  const t = (Math.random() - 0.5) * amount;
  return blend(hex, t > 0 ? "#FFFFFF" : "#000000", Math.abs(t));
}
