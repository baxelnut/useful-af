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
