// Style
import "./Hero.css";
// Components
import TabsContainer from "./TabsContainer";

export default function Hero({ featuresRoutes, selected, setSelected }) {
  const heroImage = selected?.heroImage || "/stock/oil-purple-1.webp"; // fallback

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <h2 className="hero-title">
        {selected ? selected.label : "Yo whatchu want fool?👇"}
      </h2>
      <TabsContainer
        featuresRoutes={featuresRoutes}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
