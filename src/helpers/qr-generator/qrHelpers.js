// Data
import { LOGO_MAP, PREFILL } from "../../data/qrData";

export function handleTypeSelect(
  key,
  autoLogo,
  setSelectedType,
  setInput,
  setLogoUrl
) {
  setSelectedType(key);
  setInput(PREFILL[key] ?? "");
  if (autoLogo) setLogoUrl(LOGO_MAP[key] ?? null);
}

export function handleInputChange(
  value,
  selectedType,
  autoLogo,
  setInput,
  setSelectedType,
  setLogoUrl
) {
  setInput(value);
  const detected = detectType(value);
  if (detected && detected !== selectedType) {
    setSelectedType(detected);
    if (autoLogo) setLogoUrl(LOGO_MAP[detected] ?? null);
  }
}

export async function recolorSvgLogo(url, color) {
  try {
    const res = await fetch(url);
    let svgText = await res.text();
    svgText = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);
    return "data:image/svg+xml;base64," + btoa(svgText);
  } catch (err) {
    console.error("Failed to recolor SVG logo", err);
    return url;
  }
}

export function handleLogoFileUpload(file, setLogoUrl, setAutoLogo) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    setLogoUrl(e.target.result);
    setAutoLogo(false);
  };
  reader.readAsDataURL(file);
}

export const detectType = (raw) => {
  const v = (raw || "").trim();
  if (!v) return "text";
  const lower = v.toLowerCase();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRe.test(v)) return "email";

  const urlRe = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([\/\w\-.?=&%+#]*)?$/i;
  if (urlRe.test(v)) {
    if (lower.includes("instagram.com") || lower.includes("instagr.am"))
      return "instagram";
    if (lower.includes("facebook.com") || lower.includes("fb.com"))
      return "facebook";
    if (lower.includes("x.com") || lower.includes("twitter.com")) return "x";
    if (lower.includes("wa.me") || lower.includes("whatsapp")) return "wa";
    if (lower.includes("t.me") || lower.includes("telegram")) return "telegram";
    if (lower.includes("github.com")) return "github";

    return "url";
  }

  if (v.startsWith("@") && !v.includes("@", 1)) {
    // handle-like: choose X by default
    return "x";
  }

  if (/^\+?\d{7,}$/.test(v)) return "wa";

  if (lower.startsWith("wifi:") || lower.startsWith("WIFI:".toLowerCase()))
    return "wifi";

  return "text";
};
