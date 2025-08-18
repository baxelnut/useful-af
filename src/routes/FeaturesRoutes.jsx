// Features
import AIGlorifier from "../features/ai-glorifier/AIGlorifier";
import BackgroundRemover from "../features/bg-remover/BackgroundRemover";
import EpicHashtagGenerator from "../features/hashtag-generator/EpicHashtagGenerator";
import MoodPalette from "../features/mood-palette/MoodPalette";
import QRCodeGenerator from "../features/qr-generator/QRCodeGenerator";
import ReadingTimeEstimator from "../features/reading-time/ReadingTimeEstimator";
import ScreenshotToText from "../features/screenshot-to-text/ScreenshotToText";

export const featuresRoutes = [
  {
    component: <AIGlorifier />,
    id: "ai-glorifier",
    label: "AI Image Glorifier",
    heroImage: "/stock/oil-purple-1.webp",
  },
  {
    component: <BackgroundRemover />,
    id: "bg-remover",
    label: "Background Remover",
    heroImage: "/stock/oil-purple-3.webp",
  },
  {
    component: <EpicHashtagGenerator />,
    id: "hashtag-generator",
    label: "Hashtag Generator",
    heroImage: "/stock/oil-purple-3.webp",
  },
  {
    component: <MoodPalette />,
    id: "mood-palette",
    label: "Mood-Based Color Picker",
    heroImage: "/stock/oil-purple-4.webp",
  },
  {
    component: <QRCodeGenerator />,
    id: "qr-generator",
    label: "QR Code Generator",
    heroImage: "/stock/oil-purple-5.webp",
  },
  {
    component: <ReadingTimeEstimator />,
    id: "reading-time",
    label: "Reading Time Estimator",
    heroImage: "/stock/oil-pink-1.webp",
  },
  {
    component: <ScreenshotToText />,
    id: "screenshot-to-text",
    label: "Screenshot to Text",
    heroImage: "/stock/oil-pink-2.webp",
  },
];
