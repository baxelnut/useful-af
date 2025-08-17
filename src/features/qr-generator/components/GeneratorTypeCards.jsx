// Style
import "./GeneratorTypeCards.css";
// Components
import Icon from "../../../components/ui/Icon";

export default function GeneratorTypeCards({
  selectedType,
  onSelectType,
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
          onClick={() => onSelectType(gen.key)}
        >
          <Icon path={gen.icon} />
          <p className="small-p">{gen.label}</p>
        </div>
      ))}
    </div>
  );
}
