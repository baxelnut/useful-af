// Style
import "./GeneratorTypeInput.css";
// Components
import Input from "../../../components/input/Input";

export default function GeneratorTypeInput({
  input,
  setInput,
  selectedType,
  setSelectedType,
  GENERATOR_TYPE,
  detectType,
}) {
  const handleChange = (e) => {
    const v = e.target.value;
    setInput(v);
    const detected = detectType(v);
    if (detected && detected !== selectedType) {
      setSelectedType(detected);
    }
  };

  const placeholder = GENERATOR_TYPE.find(
    (g) => g.key === selectedType
  )?.placeholder;

  return (
    <div className="generator-type-input">
      <Input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={handleChange}
        fullWidth
        noBorder
      />
      <em className="small-p">
        (Your QR Code will be generated automatically)
      </em>
    </div>
  );
}
