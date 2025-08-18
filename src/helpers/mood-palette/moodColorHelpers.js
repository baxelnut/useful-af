// Data
import {
  MOOD_PALETTES,
  MOOD_KEYWORDS,
  MAX_NGRAM,
  NEGATION_WINDOW,
  FIRST_PERSON_SHOOTER,
  SECOND_PERSON_SHOOTER,
  DEFAULT_SENTENCE_WEIGHT,
  PHRASE_WEIGHTS,
  MIN_CONFIDENCE_RATIO,
  MIN_TOTAL_SCORE,
  NEGATORS,
  POSITIVE_SENT,
  NEGATIVE_SENT,
} from "../../data/moodData";

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? parseInt(
          h
            .split("")
            .map((c) => c + c)
            .join(""),
          16
        )
      : parseInt(h, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function rgbToHex({ r, g, b }) {
  const toHex = (x) =>
    Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

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
  const t = (Math.random() - 0.5) * amount; // -amount..+amount
  return blend(hex, t > 0 ? "#FFFFFF" : "#000000", Math.abs(t));
}

/* choose palette based on mood + desired count + optional seed text to vary */
export function buildPalette(mood, count = 5, seedText = "") {
  const base = MOOD_PALETTES[mood] || MOOD_PALETTES["neutral"];
  if (count <= base.length) return base.slice(0, count);

  const out = [...base];
  while (out.length < count) {
    const pick = base[out.length % base.length];
    out.push(jitter(pick, 0.08));
  }

  if (seedText && seedText.trim()) {
    const seed = seedText
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    for (let i = 0; i < seed % 10; i++) {
      const i1 = seed % out.length;
      const i2 = (i + seed) % out.length;
      [out[i1], out[i2]] = [out[i2], out[i1]];
    }
  }
  return out.slice(0, count);
}

function normalizeText(s = "") {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'\-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function tokenize(s = "") {
  if (!s) return [];
  return normalizeText(s).split(" ").filter(Boolean);
}
function buildKeywordMaps(mapping) {
  const phraseMap = new Map();
  const tokenIndex = new Map();
  for (const [mood, keys] of Object.entries(mapping)) {
    for (const raw of keys) {
      const key = normalizeText(raw);
      if (!key) continue;
      const parts = key.split(" ").filter(Boolean);
      if (parts.length > 1) {
        const phrase = parts.join(" ");
        const set = phraseMap.get(phrase) || new Set();
        set.add(mood);
        phraseMap.set(phrase, set);
      } else {
        const token = parts[0];
        const set = tokenIndex.get(token) || new Set();
        set.add(mood);
        tokenIndex.set(token, set);
      }
    }
  }
  return { phraseMap, tokenIndex };
}
const { phraseMap: PHRASE_MAP, tokenIndex: TOKEN_INDEX } =
  buildKeywordMaps(MOOD_KEYWORDS);

function hasNegationBefore(tokens, i) {
  const start = Math.max(0, i - NEGATION_WINDOW);
  for (let k = start; k < i; k++) if (NEGATORS.has(tokens[k])) return true;
  return false;
}
function sentenceSubjectWeight(tokens) {
  const hasFirst = ["i", "me", "my", "mine", "we", "us", "our"].some((p) =>
    tokens.includes(p)
  );
  const hasSecond = ["you", "your", "yours"].some((p) => tokens.includes(p));
  if (hasFirst && !hasSecond) return FIRST_PERSON_SHOOTER;
  if (hasSecond && !hasFirst) return SECOND_PERSON_SHOOTER;
  return DEFAULT_SENTENCE_WEIGHT;
}
function sentimentFallbackScore(tokens) {
  let score = 0;
  for (const t of tokens) {
    if (POSITIVE_SENT.has(t)) score += 1;
    if (NEGATIVE_SENT.has(t)) score -= 1;
  }
  return score;
}

export function detectMood(text) {
  if (!text || !text.trim()) return null;
  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const scores = {};
  for (const sentence of rawSentences) {
    const tokens = tokenize(sentence);
    if (!tokens.length) continue;
    const sWeight = sentenceSubjectWeight(tokens);

    for (let n = MAX_NGRAM; n >= 1; n--) {
      if (tokens.length < n) continue;
      for (let i = 0; i <= tokens.length - n; i++) {
        const ngram = tokens.slice(i, i + n).join(" ");
        let matched = null;
        if (n > 1 && PHRASE_MAP.has(ngram)) matched = PHRASE_MAP.get(ngram);
        else if (n === 1 && TOKEN_INDEX.has(ngram))
          matched = TOKEN_INDEX.get(ngram);
        if (!matched) continue;

        const neg = hasNegationBefore(tokens, i);
        const weight = PHRASE_WEIGHTS[n] * sWeight * (neg ? -1 : 1);

        for (const m of matched) scores[m] = (scores[m] || 0) + weight;
        if (n > 1) i += n - 1; // skip overlap for phrases
      }
    }
  }

  const wholeTokens = tokenize(text);
  if (Object.keys(scores).length === 0) {
    const sfb = sentimentFallbackScore(wholeTokens);
    if (sfb > 0) return TOKEN_INDEX.has("happy") ? "happy" : null;
    if (sfb < 0) return TOKEN_INDEX.has("melancholic") ? "melancholic" : null;
    return null;
  }

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topMood, topScore] = entries[0] || [null, 0];
  const secondScore = entries[1]?.[1] ?? 0;

  if (Math.abs(topScore) < MIN_TOTAL_SCORE) return null;
  if (
    secondScore > 0 &&
    Math.abs(topScore / (secondScore || 0.0001)) < MIN_CONFIDENCE_RATIO
  )
    return null;

  if (topScore < 0) {
    const positiveToNegative = {
      happy: "melancholic",
      energetic: "calm",
      romantic: "somber",
      playful: "somber",
    };
    return positiveToNegative[topMood] || null;
  }
  return topMood;
}
