// Style
import "./Hero.css";
// Components
import TabsContainer from "./TabsContainer";
// Data
import { SAVAGE_GREETINGZ } from "../../data/utilsData";

export default function Hero({ featuresRoutes, selected, setSelected }) {
  const heroImage = selected?.heroImage || "/stock/oil-black-1.webp"; // fallback
  const heroTitle = selected
    ? selected.label
    : SAVAGE_GREETINGZ[Math.floor(Math.random() * SAVAGE_GREETINGZ.length)];

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <h2 className="hero-title">{heroTitle}</h2>
      <TabsContainer
        featuresRoutes={featuresRoutes}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
