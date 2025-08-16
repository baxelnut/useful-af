import { useState } from "react";
// Style
import "./App.css";
// Components
import Hero from "./components/ui/Hero";
import Section from "./components/ui/Section";
// Routes
import { featuresRoutes } from "./routes/FeaturesRoutes";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className={`page ${selected?.id || ""}`}>
      <Hero
        featuresRoutes={featuresRoutes}
        selected={selected}
        setSelected={setSelected}
      />
      <Section
        id={selected?.id}
        children={selected ? selected.component : <p>Pick a tool above.</p>}
      />
    </div>
  );
}
