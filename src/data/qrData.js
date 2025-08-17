// Data
import { SVG_PATHS } from "./utilsData";

export const MODULE_OPTIONS = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
];

export const INPUT_TYPE = [
  {
    key: "url",
    label: "URL",
    icon: SVG_PATHS.url,
    placeholder: "Enter URL...",
  },
  {
    key: "text",
    label: "Text",
    icon: SVG_PATHS.alphabet,
    placeholder: "Enter text...",
  },
  {
    key: "wifi",
    label: "WiFi",
    icon: SVG_PATHS.wifi,
    placeholder: "Enter WiFi credentials...",
  },
  {
    key: "wa",
    label: "WhatsApp",
    icon: SVG_PATHS.wa,
    placeholder: "Enter WhatsApp number/message...",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: SVG_PATHS.telegram,
    placeholder: "Enter Telegram username...",
  },
  {
    key: "github",
    label: "GitHub",
    icon: SVG_PATHS.github,
    placeholder: "Enter GitHub username...",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: SVG_PATHS.instagram,
    placeholder: "Enter Instagram profile...",
  },
  {
    key: "x",
    label: "X / Twitter",
    icon: SVG_PATHS.x,
    placeholder: "Enter X profile/link...",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: SVG_PATHS.facebook,
    placeholder: "Enter Facebook profile...",
  },
];

export const PREFILL = {
  url: "https://",
  text: "",
  email: "",
  wifi: "WIFI:S:your_ssid;T:WPA;P:your_password;;",
  wa: "https://wa.me/",
  instagram: "https://instagram.com/@",
  x: "https://x.com/",
  facebook: "https://facebook.com/",
  telegram: "https://t.me/",
  github: "https://github.com/",
};

export const LOGO_MAP = {
  instagram: "/logos/instagram.svg",
  facebook: "/logos/facebook.svg",
  x: "/logos/x.svg",
  twitter: "/logos/x.svg",
  github: "/logos/github.svg",
  telegram: "/logos/telegram.svg",
  wa: "/logos/whatsapp.svg",
  wifi: "/logos/wifi.svg",
};
