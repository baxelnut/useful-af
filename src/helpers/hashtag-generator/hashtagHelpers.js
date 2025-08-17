// Data
import { STOPWORDS } from "../../data/epicHashtagData";

/* main generator: returns array of hashtags strings */
export function generateHashtags(text, count = 10) {
  if (!text || !text.trim()) return [];

  const candidates = extractCandidates(text);

  // sort by score desc, then by token length desc to prefer phrases
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.token.length - a.token.length;
  });

  const out = [];
  const seen = new Set();

  for (const { token } of candidates) {
    const tag = toHashtag(token);
    if (!tag) continue;
    const low = tag.toLowerCase();
    if (seen.has(low)) continue;
    // skip too generic like single-word stopwords (should be already low-scored)
    if (tag.length <= 2) continue;
    seen.add(low);
    out.push(tag);
    if (out.length >= count) break;
  }

  // fallback: if not enough tags, use top words (even if stopwords filtered)
  if (out.length < count) {
    const words = sanitizeText(text)
      .split(/\s+/)
      .filter(Boolean)
      .filter((w) => w.length > 2)
      .slice(0, Math.max(0, count - out.length) + 10);
    for (const w of words) {
      const tag = toHashtag(w);
      if (!tag) continue;
      const low = tag.toLowerCase();
      if (seen.has(low)) continue;
      seen.add(low);
      out.push(tag);
      if (out.length >= count) break;
    }
  }

  return out;
}

function sanitizeText(text) {
  if (!text) return "";
  // remove code blocks, urls, emails, extra whitespace, punctuation except internal hyphens/apostrophes
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi, " ")
    .replace(/[^\p{L}\p{N}\-'\s]/gu, " ") // keep letters, numbers, hyphen, apostrophe
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* generate n-grams (1..3), score them by frequency and length */
function extractCandidates(text) {
  const s = sanitizeText(text);
  if (!s) return [];

  const words = s.split(/\s+/).filter(Boolean);
  const len = words.length;
  const freq = new Map();

  // single words
  for (const w of words) {
    if (w.length < 2) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  // bigrams and trigrams (only keep those without stopwords at both ends)
  for (let n = 2; n <= 3; n++) {
    for (let i = 0; i + n <= len; i++) {
      const slice = words.slice(i, i + n);
      // skip if any token is a stopword (optional: we can allow internal stopwords)
      if (slice.some((t) => STOPWORDS.has(t))) continue;
      const phrase = slice.join(" ");
      freq.set(phrase, (freq.get(phrase) || 0) + 1);
    }
  }

  // create candidate array with basic scoring heuristic
  const candidates = [];
  for (const [token, f] of freq.entries()) {
    // filter out if token is predominantly numeric or too-long
    if (/^\d+$/.test(token)) continue;
    if (token.length > 60) continue;

    let score = f; // base score: frequency

    // boost: token length (prefer longer meaningful tokens) and phrase length
    const wordCount = token.split(" ").length;
    score *= 1 + Math.min(token.length / 20, 1); // up to +100%
    score *= 1 + Math.min(wordCount * 0.3, 1); // phrases get a boost

    // penalize single-letter/low-content tokens and stopwords
    const tokenWords = token.split(" ");
    const stopCount = tokenWords.reduce(
      (acc, t) => acc + (STOPWORDS.has(t) ? 1 : 0),
      0
    );
    if (stopCount > 0) score *= 0.2;

    // small penalty for very common words (like "the", though we've filtered most)
    if (token.length <= 2) score *= 0.2;

    candidates.push({ token, score });
  }

  return candidates;
}

/* format a token to a hashtag: remove invalid chars, CamelCase, prepend # */
function toHashtag(token) {
  // strip non-letter/number except spaces/hyphen
  const cleaned = token.replace(/[^\p{L}\p{N}\s\-']/gu, " ").trim();
  if (!cleaned) return null;

  // split on spaces/hyphens/apostrophes, join as CamelCase
  const parts = cleaned
    .split(/[\s\-\_']+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  const joined = parts.join("");
  if (!joined) return null;
  // ensure it starts with letter or number, hashtags can start with number but not punctuation
  return `#${joined}`;
}
