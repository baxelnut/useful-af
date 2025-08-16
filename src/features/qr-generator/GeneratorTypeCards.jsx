// Style
import "./GeneratorTypeCards.css";
// Components
import Icon from "../../components/ui/Icon";

export default function GeneratorTypeCards({
  selectedType,
  setSelectedType,
  GENERATOR_TYPE,
}) {
  return (
    <div className="cards-container row generators">
      {GENERATOR_TYPE.map((gen) => (
        <div
          key={gen.key}
          className={`card generator-type ${
            selectedType === gen.key ? "active" : ""
          }`}
          onClick={() => setSelectedType(gen.key)}
        >
          <Icon path={gen.icon} />
          <p className="small-p">{gen.label}</p>
        </div>
      ))}
    </div>
  );
}
