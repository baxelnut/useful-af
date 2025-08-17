export const MOOD_PALETTES = {
  happy: ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#FF9F1C"],
  calm: ["#A8DADC", "#457B9D", "#1D3557", "#F1FAEE", "#E9F4F6"],
  energetic: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF8CC6"],
  moody: ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE", "#6FFFE9"],
  romantic: ["#FDE2E4", "#FFC5D9", "#F7A6C2", "#E58FB2", "#C56CA3"],
  retro: ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"],
  pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  neon: ["#39FF14", "#0AFFE1", "#FF073A", "#FFDC00", "#7D2AE8"],
  neutral: ["#111827", "#374151", "#6B7280", "#9CA3AF", "#E5E7EB"],
  autumn: ["#7C2E0F", "#C1440E", "#F6AE2D", "#F8E9A1", "#6C584C"],
  ocean: ["#034F84", "#92A8D1", "#BFD7EA", "#0E7C7B", "#2E8B57"],
  tech: ["#0F172A", "#0EA5A4", "#60A5FA", "#A78BFA", "#06B6D4"],
  earthy: ["#3D2B2B", "#705038", "#B08968", "#DAB78F", "#F2E9DC"],
  somber: ["#2D3436", "#485563", "#7B8A8B", "#B0B7B8", "#DCE2E6"],
  whimsical: ["#FFB4D6", "#C2F970", "#8EC5FF", "#FFD580", "#E9D5FF"],
};

export const MOOD_OPT = Object.keys(MOOD_PALETTES).map((k) => ({
  value: k,
  label: k[0].toUpperCase() + k.slice(1),
}));

export const COUNT_OPT = [
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
];

export const MOOD_KEYWORDS = {
  happy: ["happy", "joy", "cheer", "fun", "celebrate", "yay", "excite"],
  calm: ["calm", "relax", "peace", "zen", "chill", "soothing", "calmly"],
  energetic: ["workout", "energetic", "hype", "energy", "active", "pump"],
  moody: ["dark", "moody", "gloom", "mystery", "noir", "broody"],
  romantic: [
    "love",
    "romance",
    "valentine",
    "date",
    "heart",
    "lovely",
    "horny",
  ],
  retro: ["retro", "vintage", "old-school", "nostalgia", "classic"],
  pastel: ["pastel", "soft", "sweet", "cute", "gentle"],
  neon: ["neon", "glow", "cyber", "electric", "rave"],
  neutral: ["minimal", "neutral", "professional", "clean", "mono"],
  autumn: ["autumn", "fall", "pumpkin", "harvest", "cozy"],
  ocean: ["ocean", "sea", "beach", "marine", "wave", "aqua"],
  tech: ["tech", "startup", "developer", "code", "digital"],
  earthy: ["earth", "organic", "natural", "soil", "forest"],
  somber: ["sad", "somber", "sober", "serious", "grave"],
  whimsical: ["whimsy", "whimsical", "play", "silly", "quirky"],
};
