// Features
import AIGlorifier from "../features/ai-glorifier/AIGlorifier";
import AnonymousFeedbackForm from "../features/anon-form/AnonymousFeedbackForm";
import BackgroundRemover from "../features/bg-remover/BackgroundRemover";
import EpicHashtagGenerator from "../features/hashtag-generator/EpicHashtagGenerator";
import IPAddressFinder from "../features/ip-finder/IPAddressFinder";
import LinkShortener from "../features/link-shortener/LinkShortener";
import MoodPalette from "../features/mood-palette/MoodPalette";
import QRCodeGenerator from "../features/qr-generator/QRCodeGenerator";
import ReadingTimeEstimator from "../features/reading-time/ReadingTimeEstimator";
import ScreenshotToText from "../features/screenshot-to-text/ScreenshotToText";

export const featuresRoutes = [
  {
    component: <QRCodeGenerator />,
    id: "qr-generator",
    label: "QR Code Generator",
    heroImage: "/stock/oil-purple-1.webp",
  },
  {
    component: <BackgroundRemover />,
    id: "bg-remover",
    label: "Background Remover",
    heroImage: "/stock/oil-purple-2.webp",
  },
  {
    component: <LinkShortener />,
    id: "link-shortener",
    label: "Link Shortener",
    heroImage: "/stock/oil-purple-3.webp",
  },
  {
    component: <ReadingTimeEstimator />,
    id: "reading-time",
    label: "Reading Time Estimator",
    heroImage: "/stock/oil-purple-4.webp",
  },
  {
    component: <ScreenshotToText />,
    id: "screenshot-to-text",
    label: "Screenshot to Text",
    heroImage: "/stock/oil-purple-5.webp",
  },
  {
    component: <EpicHashtagGenerator />,
    id: "hashtag-generator",
    label: "Epic Hashtag Generator",
    heroImage: "/stock/oil-pink-1.webp",
  },
  {
    component: <IPAddressFinder />,
    id: "ip-finder",
    label: "IP Address Finder",
    heroImage: "/stock/oil-pink-2.webp",
  },
  {
    component: <AnonymousFeedbackForm />,
    id: "anon-form",
    label: "Anonymous Feedback Form",
    heroImage: "/stock/oil-colorful-1.webp",
  },
  {
    component: <MoodPalette />,
    id: "mood-palette",
    label: "Mood-Based Color Palette Picker",
    heroImage: "/stock/oil-orange-1.webp",
  },
  {
    component: <AIGlorifier />,
    id: "ai-glorifier",
    label: "AI-powered Image Glorifier",
    heroImage: "/stock/oil-green-1.webp",
  },
];
