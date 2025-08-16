// Style
import "./TabsContainer.css";

export default function TabsContainer({
  featuresRoutes,
  selected,
  setSelected,
}) {
  return (
    <div className="cards-container row tabs">
      {featuresRoutes.map((tool) => (
        <div
          key={tool.id}
          className={`card tab ${selected?.id === tool.id ? "active" : ""}`}
          onClick={() => setSelected(tool)}
        >
          <p>{tool.label}</p>
        </div>
      ))}
    </div>
  );
}
